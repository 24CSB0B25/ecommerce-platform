const User = require("../models/User");

const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    ).populate("wishlist");

    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    );

    const alreadyExists =
      user.wishlist.some(
        (item) =>
          item.toString() ===
          req.params.productId
      );

    if (alreadyExists) {
      return res.status(400).json({
        message:
          "Already in wishlist",
      });
    }

    user.wishlist.push(
      req.params.productId
    );

    await user.save();

    res.json({
      message:
        "Added to wishlist",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const removeFromWishlist = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.user._id
    );

    user.wishlist =
      user.wishlist.filter(
        (item) =>
          item.toString() !==
          req.params.productId
      );

    await user.save();

    res.json({
      message:
        "Removed from wishlist",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};