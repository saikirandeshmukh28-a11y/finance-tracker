const bcrypt         = require("bcryptjs");
const jwt            = require("jsonwebtoken");
const { readDB, writeDB, newId } = require("../config/db");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    const users = readDB("users");

    if (users.find(u => u.email === email.toLowerCase())) {
      return res.status(409).json({ success: false, message: "Email already registered." });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = {
      _id:       newId(),
      name,
      email:     email.toLowerCase(),
      phone:     phone || "",
      password:  hashed,
      plan:      "free",
      isActive:  true,
      createdAt: new Date().toISOString(),
    };

    users.push(user);
    writeDB("users", users);

    const token = signToken(user._id);
    const { password: _, ...safeUser } = user;

    res.status(201).json({ success: true, token, user: safeUser });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const users = readDB("users");
    const user  = users.find(u => u.email === email.toLowerCase());

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const token = signToken(user._id);
    const { password: _, ...safeUser } = user;

    res.json({ success: true, token, user: safeUser });
  } catch (err) { next(err); }
};

exports.getMe = (req, res) => {
  res.json({ success: true, user: req.user });
};