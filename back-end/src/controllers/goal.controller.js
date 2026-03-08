const { readDB, writeDB, newId } = require("../config/db");

exports.getAll = (req, res) => {
  const goals = readDB("goals").filter(g => g.userId === req.user._id);
  res.json({ success: true, count: goals.length, data: goals });
};

exports.create = (req, res) => {
  const goals = readDB("goals");
  const goal  = {
    _id:         newId(),
    userId:      req.user._id,
    name:        req.body.name,
    target:      parseFloat(req.body.target),
    saved:       parseFloat(req.body.saved) || 0,
    deadline:    req.body.deadline,
    icon:        req.body.icon || "target",
    color:       req.body.color || "#2563eb",
    isCompleted: false,
    createdAt:   new Date().toISOString(),
  };
  goals.push(goal);
  writeDB("goals", goals);
  res.status(201).json({ success: true, data: goal });
};

exports.update = (req, res) => {
  const goals = readDB("goals");
  const idx   = goals.findIndex(g => g._id === req.params.id && g.userId === req.user._id);
  if (idx === -1) return res.status(404).json({ success: false, message: "Goal not found." });
  goals[idx] = { ...goals[idx], ...req.body };
  if (goals[idx].saved >= goals[idx].target) goals[idx].isCompleted = true;
  writeDB("goals", goals);
  res.json({ success: true, data: goals[idx] });
};

exports.deposit = (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ success: false, message: "Amount must be > 0." });
  const goals = readDB("goals");
  const idx   = goals.findIndex(g => g._id === req.params.id && g.userId === req.user._id);
  if (idx === -1) return res.status(404).json({ success: false, message: "Goal not found." });
  goals[idx].saved = Math.min(goals[idx].saved + parseFloat(amount), goals[idx].target);
  if (goals[idx].saved >= goals[idx].target) goals[idx].isCompleted = true;
  writeDB("goals", goals);
  res.json({ success: true, data: goals[idx] });
};

exports.remove = (req, res) => {
  const goals = readDB("goals");
  const idx   = goals.findIndex(g => g._id === req.params.id && g.userId === req.user._id);
  if (idx === -1) return res.status(404).json({ success: false, message: "Goal not found." });
  goals.splice(idx, 1);
  writeDB("goals", goals);
  res.json({ success: true, message: "Goal deleted." });
};