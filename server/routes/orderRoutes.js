const express = require("express");

const {
  createOrder,
  createBuyNowOrder,
  getMyOrders,
  getOrderById,
  markOrderPaid,
  getOrders,
  markOrderDelivered,
  createRazorpayOrder,
  verifyRazorpayPayment,
  downloadInvoice,
  updateOrderStatus,
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");

const admin = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/", protect, createOrder);
router.post("/buynow", protect, createBuyNowOrder);

router.get(
  "/myorders",
  protect,
  getMyOrders
);

router.get(
  "/:id",
  protect,
  getOrderById
);

router.put(
  "/:id/pay",
  protect,
  markOrderPaid
);

router.post(
  "/:id/razorpay-order",
  protect,
  createRazorpayOrder
);

router.post(
  "/:id/verify-payment",
  protect,
  verifyRazorpayPayment
);

router.get(
  "/",
  protect,
  admin,
  getOrders
);

router.put(
  "/:id/deliver",
  protect,
  admin,
  markOrderDelivered
);

router.get(
  "/:id/invoice",
  protect,
  downloadInvoice
);

router.put(
  "/:id/status",
  protect,
  admin,
  updateOrderStatus
);

module.exports = router;