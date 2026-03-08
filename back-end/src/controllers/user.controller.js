const bcrypt         = require("bcryptjs");
const { readDB, writeDB } = require("../config/db");

exports.getProfile = (req, res) => {
  res.json({ success: true, data: req.user });
};

exports.updateProfile = (req, res) => {
  const users = readDB("users");
  const idx   = users.findIndex(u => u._id === req.user._id);
  if (idx === -1) return res.status(404).json({ success: false, message: "User not found." });
  const allowed = ["name", "phone", "avatar"];
  allowed.forEach(f => { if (req.body[f] !== undefined) users[idx][f] = req.body[f]; });
  writeDB("users", users);
  const { password, ...safeUser } = users[idx];
  res.json({ success: true, data: safeUser });
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: "Both passwords are required." });
  }
  const users = readDB("users");
  const idx   = users.findIndex(u => u._id === req.user._id);
  if (!(await bcrypt.compare(currentPassword, users[idx].password))) {
    return res.status(401).json({ success: false, message: "Current password incorrect." });
  }
  users[idx].password = await bcrypt.hash(newPassword, 12);
  writeDB("users", users);
  res.json({ success: true, message: "Password changed successfully." });
};