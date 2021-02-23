const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const orderController = require("../controllers/order");
const productController = require("../controllers/product");
const userController = require("../controllers/user");

router.post(
  "/order/create/:id",
  authController.isSignedIn,
  authController.isAuthenticated,
  userController.pushOrderInPurchaseList,
  productController.updateStock,
  orderController.createOrder
);

router.get(
  "/order/:orderId/:id",
  authController.isSignedIn,
  authController.isAuthenticated,
  authController.isAdmin,
  orderController.getOrderById
);

router.get(
  "/orders/all/:id",
  authController.isSignedIn,
  authController.isAuthenticated,
  authController.isAdmin,
  orderController.getAllOrders
);

router.get(
  "/order/status/:id",
  authController.isSignedIn,
  authController.isAuthenticated,
  authController.isAdmin,
  orderController.getAllStatus
);

router.put(
  "/order/:orderId/updateStatus/:id",
  authController.isSignedIn,
  authController.isAuthenticated,
  authController.isAdmin,
  orderController.updateStatus
);

module.exports = router;
