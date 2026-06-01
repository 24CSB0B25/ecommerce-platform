const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail =require("../utils/sendEmail");
const crypto =require("crypto");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      await sendEmail(
    user.email,
    "Welcome to Nexus Store 🚀",
    `
      <div style="font-family: Arial, sans-serif;">
        <h1>
          Welcome ${user.name}!
        </h1>

        <p>
          Your account has been
          successfully created.
        </p>

        <p>
          Thank you for joining
          Nexus Store.
        </p>

        <hr>

        <p>
          Happy Shopping 🛍️
        </p>
      </div>
    `
  );

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const forgotPassword =
  async (req, res) => {
    try {
      const { email } =
        req.body;

      const user =
        await User.findOne({
          email,
        });

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      const resetToken =
        crypto
          .randomBytes(20)
          .toString("hex");

      user.resetPasswordToken =
        resetToken;

      user.resetPasswordExpire =
        Date.now() +
        15 * 60 * 1000;

      await user.save();

      const resetUrl =
        `http://localhost:5173/reset-password/${resetToken}`;

      await sendEmail(
        user.email,
        "Reset Password",
        `
        <h2>Password Reset</h2>

        <p>
          Click below to reset your password:
        </p>

        <a href="${resetUrl}">
          Reset Password
        </a>

        <p>
          Link expires in 15 minutes.
        </p>
        `
      );

      res.json({
        message:
          "Reset email sent",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
};

const resetPassword =
  async (req, res) => {
    try {
      const user =
        await User.findOne({
          resetPasswordToken:
            req.params.token,

          resetPasswordExpire:
            { $gt: Date.now() },
        });

      if (!user) {
        return res.status(400).json({
          message:
            "Invalid or expired token",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          req.body.password,
          10
        );

      user.password =
        hashedPassword;

      user.resetPasswordToken =
        undefined;

      user.resetPasswordExpire =
        undefined;

      await user.save();

      res.json({
        message:
          "Password reset successful",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
};

const getUserProfile = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.user._id
      ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateUserProfile =
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user._id
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      user.name =
        req.body.name ||
        user.name;

      user.email =
        req.body.email ||
        user.email;

      const updatedUser =
        await user.save();

      res.json({
        _id:
          updatedUser._id,
        name:
          updatedUser.name,
        email:
          updatedUser.email,
        isAdmin:
          updatedUser.isAdmin,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
};

const changePassword =
  async (req, res) => {
    try {
      const {
        currentPassword,
        newPassword,
      } = req.body;

      const user =
        await User.findById(
          req.user._id
        );

      const isMatch =
        await bcrypt.compare(
          currentPassword,
          user.password
        );

      if (!isMatch) {
        return res.status(400).json({
          message:
            "Current password is incorrect",
        });
      }

      user.password =
        await bcrypt.hash(
          newPassword,
          10
        );

      await user.save();

      res.json({
        message:
          "Password updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  forgotPassword,
  resetPassword,
};