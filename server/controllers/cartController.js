const Cart = require("../models/Cart");
const Product = require("../models/Product");

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    let cartItem = await Cart.findOne({
      user: req.user._id,
      product: productId,
    });

    if (cartItem) {
      const newQuantity =
        cartItem.quantity +
        (quantity || 1);

      if (
        newQuantity > product.stock
      ) {
        return res.status(400).json({
          message:
            `Only ${product.stock} items available`,
        });
      }

      cartItem.quantity =
        newQuantity;

      await cartItem.save();

      return res.json(cartItem);
    }

    if (
      (quantity || 1) >
      product.stock
    ) {
      return res.status(400).json({
        message:
          `Only ${product.stock} items available`,
      });
    }
    cartItem = await Cart.create({
      user: req.user._id,
      product: productId,
      quantity: quantity || 1,
    });

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await Cart.find({
      user: req.user._id,
    }).populate(
      "product",
      "name price image category"
    );

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    if (
      cartItem.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const product =
      await Product.findById(
        cartItem.product
      );

    if (
      req.body.quantity >
      product.stock
    ) {
      return res.status(400).json({
        message:
          `Only ${product.stock} items available`,
      });
    }

    cartItem.quantity =
      req.body.quantity;

    const updatedItem = await cartItem.save();

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    if (
      cartItem.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    await cartItem.deleteOne();

    res.json({
      message: "Item removed from cart",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
};