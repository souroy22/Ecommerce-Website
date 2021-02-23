const User = require("../models/user");

const userController = {
  getUser: async (req, res) => {
    try {
      req.profile.encry_password = undefined;
      req.profile.salt = undefined;
      req.profile.createdAt = undefined;
      req.profile.updatedAt = undefined;
      req.profile.__v = undefined;
      return res.status(200).json(req.profile);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true, useFindAndModify: false }
      );
      if (!user) {
        return res.json({ err: "Not Authorised!" });
      }
      await user.save();

      // return res.json(user);
      return res
        .status(200)
        .json({ msg: "User data is successfully Updated!" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  pushOrderInPurchaseList: (req, res, next) => {
    let purchases = [];
    req.body.order.products.map((product) => {
      purchases.push({
        _id: product._id,
        name: product.name,
        description: product.description,
        category: product.category,
        quantity: product.quantity,
        amount: req.body.order.amount,
        transaction_id: req.body.order.transaction_id
      });
    });

    const { id } = req.params;
    //store thi in DB
    User.findOneAndUpdate(
      { _id: id },
      { $push: { purchases: purchases } },
      { new: true, useFindAndModify: false },
      (err, purchases) => {
        if (err) {
          return res.status(400).json({
            error: "Unable to save purchase list",
          });
        }
        next();
      }
    );
  },

  getAllPurchesList: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      const purchesList = user.purchases;
      return res.json(purchesList);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

module.exports = userController;
