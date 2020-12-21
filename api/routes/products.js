const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check_auth");
const ProductController = require("../controllers/products");
const upload = require("../controllers/multer");

// Handle incoming GET requests to /products
router.get("/", ProductController.products_get_all);

// Handle incoming POST requests to /products
router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  ProductController.products_create_product
);

// Handle incoming GET requests to /products/productId
router.get("/:productId", ProductController.products_get_product);

// Handle incoming PATCH requests to /products/productId
router.patch(
  "/:productId",
  checkAuth,
  ProductController.products_update_product
);

// Handle incoming DELETE requests to /products/productId
router.delete(
  "/:productId",
  checkAuth,
  ProductController.products_delete_product
);

module.exports = router;
