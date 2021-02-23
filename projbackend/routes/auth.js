const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();
const { check } = require("express-validator");
const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;

router.get("/signout", (req, res) => {
  return res.send("User singed out");
});

router.post(
  "/signup",
  [
    check("name", "Name should be min 3").isLength({ min: 3 }),
    check("email", "email is required").isEmail(),
    check("password", "Password should be min 5").isLength({ min: 5 }),
  ],
  authController.signup
);

router.post(
  "/signin",
  [
    check("email", "email is required").isEmail(),
    check("password", "Password is required").isLength({ min: 2 }),
  ],
  authController.signin
);

router.post(
  "/googlesignin",
  authController.signinWithGoogle
);


router.get("/signout", authController.signout);

router.get("/test", authController.isSignedIn, (req, res) => {
  return res.json({ msg: "Test Page" });
});

module.exports = router;
