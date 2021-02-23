const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");
const authController = require("../controllers/auth");

router.param("productId", productController.getProductById);

router.post(
  "/product/create/:id",
  authController.isSignedIn,
  authController.isAuthenticated,
  authController.isAdmin,
  productController.createProduct
);

// read routes
router.get("/product/:productId", productController.getProduct);
router.get("/product/photo/:productId", productController.getPhoto);

// delete product
router.delete(
  "/product/:productId/:id",
  authController.isSignedIn,
  authController.isAuthenticated,
  authController.isAdmin,
  productController.deleteProduct
);

//update route
router.put(
  "/product/:productId/:id",
  authController.isSignedIn,
  authController.isAuthenticated,
  authController.isAdmin,
  productController.updateProduct
);

//listing route
router.get("/products", productController.getAllProducts);

router.get("/products/categories", productController.getAllUniqueCategories);

module.exports = router;
