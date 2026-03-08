const { readDB, writeDB, newId } = require("../config/db");

exports.getAll = (req, res) => {
  const { category, type, search, page = 1, limit = 100, sort = "date" } = req.query;
  let txns = readDB("transactions").filter(t => t.userId === req.user._id);

  if (category) txns = txns.filter(t => t.category === category);
  if (type)     txns = txns.filter(t => t.type === type);
  if (search)   txns = txns.filter(t => t.payee.toLowerCase().includes(search.toLowerCase()));

  txns.sort((a, b) => new Date(b.date) - new Date(a.date));

  const total = txns.length;
  const start = (Number(page) - 1) * Number(limit);
  const paged = txns.slice(start, start + Number(limit));

  res.json({ success: true, count: paged.length, total, data: paged });
};

exports.create = (req, res) => {
  const { payee, amount, type, category, date, note } = req.body;
  const txns = readDB("transactions");

  const txn = {
    _id:       newId(),
    userId:    req.user._id,
    payee,
    amount:    parseFloat(amount),
    type,
    category:  category || "other",
    date:      date || new Date().toISOString(),
    note:      note || "",
    createdAt: new Date().toISOString(),
  };

  txns.push(txn);
  writeDB("transactions", txns);

  // Update budget spent
  if (type === "debit" && category) {
    const month   = (date ? new Date(date) : new Date()).toISOString().slice(0, 7);
    const budgets = readDB("budgets");
    const idx     = budgets.findIndex(b => b.userId === req.user._id && b.category === category && b.month === month);
    if (idx !== -1) {
      budgets[idx].spent = (budgets[idx].spent || 0) + parseFloat(amount);
      writeDB("budgets", budgets);
    }
  }

  res.status(201).json({ success: true, data: txn });
};

exports.remove = (req, res) => {
  const txns    = readDB("transactions");
  const idx     = txns.findIndex(t => t._id === req.params.id && t.userId === req.user._id);
  if (idx === -1) return res.status(404).json({ success: false, message: "Transaction not found." });
  txns.splice(idx, 1);
  writeDB("transactions", txns);
  res.json({ success: true, message: "Transaction deleted." });
};

exports.summary = (req, res) => {
  const { month } = req.query;
  const mo  = month || new Date().toISOString().slice(0, 7);
  const txns = readDB("transactions")
    .filter(t => t.userId === req.user._id && t.date.startsWith(mo));

  const income  = txns.filter(t => t.type === "credit").reduce((s, t) => s + t.amount, 0);
  const expense = txns.filter(t => t.type === "debit" ).reduce((s, t) => s + t.amount, 0);

  res.json({ success: true, data: { income, expense, savings: income - expense, month: mo } });
};