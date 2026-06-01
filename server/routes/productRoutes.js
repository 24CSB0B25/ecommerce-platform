const express = require("express");
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getAllProducts,
  getSuggestions,
} = require("../controllers/productController");

const router = express.Router();

router.get("/", getProducts);

router.post(
  "/",
  protect,
  admin,
  createProduct
);

router.get(
  "/admin/all",
  protect,
  admin,
  getAllProducts
);

router.get(
  "/suggestions",
  getSuggestions
);

router.get("/:id", getProductById);

router.put(
  "/:id",
  protect,
  admin,
  updateProduct
);

router.delete(
  "/:id",
  protect,
  admin,
  deleteProduct
);

router.post(
  "/:id/reviews",
  protect,
  createProductReview
);

module.exports = router;