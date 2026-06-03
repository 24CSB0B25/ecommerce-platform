const Order = require("../models/Order");
const Cart = require("../models/Cart");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const PDFDocument =require("pdfkit");
const Coupon = require("../models/Coupon");

const createOrder = async (req, res) => {
  try {
    const { couponCode } =req.body;
    const cartItems = await Cart.find({
      user: req.user._id,
    }).populate("product");

    if (cartItems.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const orderItems = cartItems.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
    }));

    const originalTotal =
      cartItems.reduce(
        (acc, item) =>
          acc +
          item.product.price *
            item.quantity,
        0
      );

    let discount = 0;

    if (couponCode) {
      const coupon =
        await Coupon.findOne({
          code:
            couponCode.toUpperCase(),
          isActive: true,
        });

      if (
        coupon &&
        new Date() <
          coupon.expiryDate
      ) {
        if (
          coupon.discountType ===
          "percentage"
        ) {
          discount =
            (originalTotal *
              coupon.discountValue) /
            100;
        } else {
          discount =
            coupon.discountValue;
        }
      }
    }

    const totalPrice =
      originalTotal - discount;

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      totalPrice,
      discount,
      couponCode,
    });


    const user = await User.findById(
      req.user._id
    );

    await sendEmail(
      user.email,
      "Order Confirmation 📦",
      `
        <h1>Order Confirmed</h1>

        <p>
          Hi ${user.name},
        </p>

        <p>
          Your order has been placed successfully.
        </p>

        <p>
          Order Total:
          ₹${totalPrice}
        </p>

        <p>
          Thank you for shopping with Nexus Store.
        </p>
      `
    );

    await Cart.deleteMany({
      user: req.user._id,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).populate(
      "orderItems.product",
      "name price"
    );

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    ).populate(
      "orderItems.product",
      "name price"
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const markOrderPaid = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = "Paid";

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email");

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const markOrderDelivered = async (
  req,
  res
) => {
  try {
    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = "Delivered";

    const updatedOrder =
      await order.save();

    const user =
      await User.findById(
        order.user
      );

    await sendEmail(
      user.email,
      "Order Delivered 🎉",
      `
        <h1>
          Your Order Has Been Delivered
        </h1>

        <p>
          Hi ${user.name},
        </p>

        <p>
          Your order has been
          successfully delivered.
        </p>

        <p>
          We hope you enjoy
          your purchase.
        </p>

        <p>
          Thank you for shopping
          with Nexus Store.
        </p>
      `
    );

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createRazorpayOrder = async (
  req,
  res
) => {
  try {
    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const options = {
      amount:
        order.totalPrice * 100,
      currency: "INR",
      receipt: order._id.toString(),
    };

    const razorpayOrder =
      await razorpay.orders.create(
        options
      );

    res.json(razorpayOrder);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const verifyRazorpayPayment =
  async (req, res) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = req.body;

      const generatedSignature =
        crypto
          .createHmac(
            "sha256",
            process.env
              .RAZORPAY_KEY_SECRET
          )
          .update(
            razorpay_order_id +
              "|" +
              razorpay_payment_id
          )
          .digest("hex");

      if (
        generatedSignature !==
        razorpay_signature
      ) {
        return res.status(400).json({
          message:
            "Payment verification failed",
        });
      }

      const order =
        await Order.findById(
          req.params.id
        );

      if (order.isPaid) {
        return res.status(400).json({
          message:
            "Order already paid",
        });
      }

      order.isPaid = true;
      order.paidAt = Date.now();
      order.status = "Paid";

      const Product = require(
        "../models/Product"
      );

      for (
        const item of order.orderItems
      ) {
        const product =
          await Product.findById(
            item.product
          );

        if (!product) continue;

        product.stock -=
          item.quantity;

        if (product.stock < 0) {
          product.stock = 0;
        }

        await product.save();
      }

      order.paymentResult = {
        razorpayOrderId:
          razorpay_order_id,

        razorpayPaymentId:
          razorpay_payment_id,

        razorpaySignature:
          razorpay_signature,
      };

      await order.save();

      res.json({
        message:
          "Payment verified successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
};

const downloadInvoice =
  async (req, res) => {
    try {
      const order =
        await Order.findById(
          req.params.id
        )
          .populate(
            "user",
            "name email"
          )
          .populate(
            "orderItems.product",
            "name price"
          );

      if (!order) {
        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      const doc =
        new PDFDocument();

      res.setHeader(
        "Content-Type",
        "application/pdf"
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=invoice-${order._id}.pdf`
      );

      doc.pipe(res);

      doc
        .fontSize(22)
        .text(
          "Nexus Store Invoice"
        );

      doc.moveDown();

      doc.text(
        `Order ID: ${order._id}`
      );

      doc.text(
        `Customer: ${order.user.name}`
      );

      doc.text(
        `Email: ${order.user.email}`
      );

      doc.text(
        `Date: ${new Date(
          order.createdAt
        ).toLocaleDateString()}`
      );

      doc.moveDown();

      doc.text(
        "Products"
      );

      doc.moveDown();

      order.orderItems.forEach(
        (item) => {
          doc.text(
            `${item.product.name}
             x ${item.quantity}
             = ₹${
               item.product.price *
               item.quantity
             }`
          );
        }
      );

      doc.moveDown();

      doc.moveDown();

      doc.text(
        `Discount: ₹${order.discount || 0}`
      );

      doc.text(
        `Coupon: ${
          order.couponCode || "None"
        }`
      );

      doc
        .fontSize(16)
        .text(
          `Final Total: ₹${order.totalPrice}`
        );

      doc.end();
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
};

const updateOrderStatus =
  async (req, res) => {
    try {
      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {
        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      order.status =
        req.body.status;

      if (
        req.body.status ===
        "Paid"
      ) {
        order.isPaid = true;

        order.paidAt =Date.now();
      }

      if (
        req.body.status ===
        "Delivered"
      ) {
        order.isDelivered =true;

        order.deliveredAt =Date.now();
      }

      const updatedOrder =
        await order.save();

      res.json(
        updatedOrder
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  markOrderPaid,
  downloadInvoice,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getOrders,
  markOrderDelivered,
  updateOrderStatus,
};