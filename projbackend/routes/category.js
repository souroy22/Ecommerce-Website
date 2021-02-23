const express = require("express");
const authController = require("../controllers/auth");
const categoryController = require("../controllers/category");
const router = express.Router();

router.post(
  "/create/category/:id",
  authController.isSignedIn,
  authController.isAuthenticated,
  authController.isAdmin,
  categoryController.createCategory
);

router.get(
  "/category/:categoryId/:id",
  authController.isSignedIn,
  authController.isAuthenticated,
  categoryController.getCategoryById
);

router.get("/categories", categoryController.getcategories);

router.put(
  "/category/update/:categoryId/:id",
  authController.isSignedIn,
  authController.isAuthenticated,
  authController.isAdmin,
  categoryController.updateCategory
);

router.delete(
  "/category/delete/:categoryId/:id",
  authController.isSignedIn,
  authController.isAuthenticated,
  authController.isAdmin,
  categoryController.deleteCategory
);

module.exports = router;
