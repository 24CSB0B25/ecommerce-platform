const express =
  require("express");

const {
  applyCoupon,
  createCoupon,
  getCoupons,
  deleteCoupon,
  toggleCouponStatus,
} = require(
  "../controllers/couponController"
);

const protect =
  require("../middleware/authMiddleware");

const admin =
  require("../middleware/adminMiddleware");

const router =
  express.Router();

router.post(
  "/apply",
  applyCoupon
);

router.post(
  "/",
  protect,
  admin,
  createCoupon
);

router.get(
  "/",
  protect,
  admin,
  getCoupons
);

router.delete(
  "/:id",
  protect,
  admin,
  deleteCoupon
);

router.put(
  "/:id/toggle",
  protect,
  admin,
  toggleCouponStatus
);

module.exports = router;