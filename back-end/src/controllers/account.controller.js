const { readDB, writeDB, newId } = require("../config/db");

exports.getAll = (req, res) => {
  const accounts = readDB("accounts").filter(a => a.userId === req.user._id);
  res.json({ success: true, data: accounts });
};

exports.create = (req, res) => {
  const accounts = readDB("accounts");
  const account  = { _id: newId(), userId: req.user._id, ...req.body, createdAt: new Date().toISOString() };
  accounts.push(account);
  writeDB("accounts", accounts);
  res.status(201).json({ success: true, data: account });
};

exports.update = (req, res) => {
  const accounts = readDB("accounts");
  const idx      = accounts.findIndex(a => a._id === req.params.id && a.userId === req.user._id);
  if (idx === -1) return res.status(404).json({ success: false, message: "Account not found." });
  accounts[idx] = { ...accounts[idx], ...req.body };
  writeDB("accounts", accounts);
  res.json({ success: true, data: accounts[idx] });
};

exports.remove = (req, res) => {
  const accounts = readDB("accounts");
  const idx      = accounts.findIndex(a => a._id === req.params.id && a.userId === req.user._id);
  if (idx === -1) return res.status(404).json({ success: false, message: "Account not found." });
  accounts.splice(idx, 1);
  writeDB("accounts", accounts);
  res.json({ success: true, message: "Account deleted." });
};