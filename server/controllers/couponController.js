const Coupon = require("../models/Coupon");

const createCoupon = async (
  req,
  res
) => {
  try {
    const coupon =
      await Coupon.create(
        req.body
      );

    res.status(201).json(
      coupon
    );
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

const getCoupons = async (
  req,
  res
) => {
  try {
    const coupons =
      await Coupon.find({})
        .sort({
          createdAt: -1,
        });

    res.json(coupons);
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

const deleteCoupon =
  async (req, res) => {
    try {
      const coupon =
        await Coupon.findById(
          req.params.id
        );

      if (!coupon) {
        return res.status(404).json({
          message:
            "Coupon not found",
        });
      }

      await coupon.deleteOne();

      res.json({
        message:
          "Coupon deleted",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
};

const toggleCouponStatus =
  async (req, res) => {
    try {
      const coupon =
        await Coupon.findById(
          req.params.id
        );

      if (!coupon) {
        return res.status(404).json({
          message:
            "Coupon not found",
        });
      }

      coupon.isActive =
        !coupon.isActive;

      const updated =
        await coupon.save();

      res.json(updated);
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
};

const applyCoupon =
  async (req, res) => {
    try {
      const {
        code,
        cartTotal,
      } = req.body;

      const coupon =
        await Coupon.findOne({
          code:
            code.toUpperCase(),
          isActive: true,
        });

      if (!coupon) {
        return res.status(404).json({
          message:
            "Invalid or inactive coupon code",
        });
      }

      if (
        new Date() >
        coupon.expiryDate
      ) {
        return res.status(400).json({
          message:
            "Coupon expired",
        });
      }

      if (
        cartTotal <
        coupon.minimumOrderAmount
      ) {
        return res.status(400).json({
          message:
            `Minimum order amount is ₹${coupon.minimumOrderAmount}`,
        });
      }

      let discount = 0;

      if (
        coupon.discountType ===
        "percentage"
      ) {
        discount =
          (cartTotal *
            coupon.discountValue) /
          100;
      } else {
        discount =
          coupon.discountValue;
      }

      res.json({
        discount,
        couponCode:
          coupon.code,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
};

module.exports = {
  applyCoupon,
  createCoupon,
  getCoupons,
  deleteCoupon,
  toggleCouponStatus,
};