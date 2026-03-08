const { readDB, writeDB, newId } = require("../config/db");

exports.getAll = (req, res) => {
  const month   = req.query.month || new Date().toISOString().slice(0, 7);
  const budgets = readDB("budgets").filter(b => b.userId === req.user._id && b.month === month);

  // Recalculate spent live from transactions
  const txns    = readDB("transactions")
    .filter(t => t.userId === req.user._id && t.type === "debit" && t.date.startsWith(month));

  const spendMap = {};
  txns.forEach(t => { spendMap[t.category] = (spendMap[t.category] || 0) + t.amount; });

  const enriched = budgets.map(b => ({ ...b, spent: spendMap[b.category] || 0 }));
  res.json({ success: true, data: enriched });
};

exports.create = (req, res) => {
  const { category, limit, month } = req.body;
  const targetMonth = month || new Date().toISOString().slice(0, 7);
  const budgets     = readDB("budgets");

  const existing = budgets.findIndex(
    b => b.userId === req.user._id && b.category === category && b.month === targetMonth
  );

  if (existing !== -1) {
    budgets[existing].limit = parseFloat(limit);
    writeDB("budgets", budgets);
    return res.json({ success: true, data: budgets[existing] });
  }

  const budget = {
    _id:      newId(),
    userId:   req.user._id,
    category,
    limit:    parseFloat(limit),
    month:    targetMonth,
    spent:    0,
  };
  budgets.push(budget);
  writeDB("budgets", budgets);
  res.status(201).json({ success: true, data: budget });
};

exports.update = (req, res) => {
  const budgets = readDB("budgets");
  const idx     = budgets.findIndex(b => b._id === req.params.id && b.userId === req.user._id);
  if (idx === -1) return res.status(404).json({ success: false, message: "Budget not found." });
  budgets[idx] = { ...budgets[idx], ...req.body };
  writeDB("budgets", budgets);
  res.json({ success: true, data: budgets[idx] });
};

exports.remove = (req, res) => {
  const budgets = readDB("budgets");
  const idx     = budgets.findIndex(b => b._id === req.params.id && b.userId === req.user._id);
  if (idx === -1) return res.status(404).json({ success: false, message: "Budget not found." });
  budgets.splice(idx, 1);
  writeDB("budgets", budgets);
  res.json({ success: true, message: "Budget deleted." });
};