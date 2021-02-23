const User = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENTID
);
const crypto = require("crypto");

const authController = {
  signup: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array()[0].msg });
      }
      const { name, email, password } = req.body;
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.json({ error: "User already exist!" });
      }
      const newUser = new User({
        name,
        email,
        password,
      });
      await newUser.save();
      return res.json({ data: { name, email, password } });
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Internal Server error while SigningUp" });
    }
  },
  signin: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()[0].msg });
      }
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(401)
          .json({ error: "Email or password is not matched!" });
      }
      if (!user.autheticate(password)) {
        return res
          .status(401)
          .json({ error: "Email or password is not matched!" });
      }

      // RSASSA-PSS using SHA-512 hash algorithm (only node ^6.12.0 OR >=8.0.0)
      const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
      res.cookie("token", token, {
        expire: new Date() + 60 * 60 * 24 * 30,
      });
      const { _id, name, role } = user;
      return res.status(200).json({ token, user: { _id, name, email, role } });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  signinWithGoogle: (req, res) => {
    try {
      const { tokenId } = req.body;
      client
        .verifyIdToken({
          idToken: tokenId,
          audience:
          process.env.GOOGLE_CLIENTID,
        })
        .then((responce) => {
          const { email_verified, name, email } = responce.payload;
          if (email_verified) {
            User.findOne({ email }).exec((err, user) => {
              if (err) {
                return res.status(400).json({ error: "Something is wrong.." });
              } else {
                if (user) {
                  const token = jwt.sign(
                    { _id: user._id },
                    process.env.SECRET_KEY
                  );
                  res.cookie("token", token, {
                    expire: new Date() + 60 * 60 * 24 * 7,
                  });
                  const { _id, name, email, role } = user;
                  return res
                    .status(200)
                    .json({ token, user: { _id, name, email, role } });
                } else {
                  let password = crypto.randomBytes(20).toString("hex");
                  let newUser = new User({ name, email, password });
                  newUser.save((err, user) => {
                    if (err) {
                      return res
                        .status(400)
                        .json({ error: "Something is wrong.." });
                    }
                    const token = jwt.sign(
                      { _id: user._id },
                      process.env.SECRET_KEY
                    );
                    res.cookie("token", token, {
                      expire: new Date() + 60 * 60 * 24 * 7,
                    });

                    const { _id, name, email, role } = newUser;
                    return res
                      .status(200)
                      .json({ token, user: { _id, name, email, role } });
                  });
                }
              }
            });
          }
        });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  signout: async (req, res) => {
    try {
      res.clearCookie("token");
      return res.json({
        msg: "User signout successfully",
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // protected routes
  isSignedIn: expressJwt({
    secret: process.env.SECRET_KEY,
    algorithms: ["HS256"],
    userProperty: "auth",
  }),

  // custom middleware
  isAuthenticated: async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(403).json({ error: "User not found!" });
    }
    req.profile = user;

    // first check that is signedin or not, then check that user is authorised user or not
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!checker) {
      return res.status(403).json({ error: "Access Denied!" });
    }
    next();
  },

  isAdmin: (req, res, next) => {
    if (req.profile.role === 0) {
      return res
        .status(403)
        .json({ error: "You are not ADMIN, Access Denied!" });
    }
    next();
  },
};

module.exports = authController;
