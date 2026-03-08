// src/controllers/auth.controller.js
const jwt  = require("jsonwebtoken");
const User = require("../models/User.model");

// ── Helper: sign JWT ──────────────────────────
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// ── Helper: send token response ───────────────
const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  // Remove password from output just in case
  user.password = undefined;
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id:   user._id,
      name:  user.name,
      email: user.email,
      phone: user.phone,
      plan:  user.plan,
    },
  });
};

// ── POST /api/auth/register ───────────────────
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check duplicate email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already registered." });
    }

    const user = await User.create({ name, email, password, phone });
    sendToken(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/login ──────────────────────
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Get user with password field
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// ── GET /api/auth/me ──────────────────────────
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};
