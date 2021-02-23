const express = require("express");
const authController = require("../controllers/auth");
const userController = require("../controllers/user");
const router = express.Router();

router.get(
  "/user/:id",
  authController.isSignedIn,
  authController.isAuthenticated,
  userController.getUser
);

router.get(
  "/user/:id/orderlist",
  authController.isSignedIn,
  authController.isAuthenticated,
  userController.getAllPurchesList
);

router.put(
  "/user/:id",
  authController.isSignedIn,
  authController.isAuthenticated,
  userController.updateUser
);

module.exports = router;
