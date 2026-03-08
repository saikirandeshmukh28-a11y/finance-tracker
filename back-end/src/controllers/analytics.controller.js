const { readDB } = require("../config/db");

exports.overview = (req, res) => {
  const txns   = readDB("transactions").filter(t => t.userId === req.user._id);
  const months = [];
  for (let i = 2; i >= 0; i--) {
    const d  = new Date(); d.setMonth(d.getMonth() - i);
    const mo = d.toISOString().slice(0, 7);
    const mt = txns.filter(t => t.date.startsWith(mo));
    const income  = mt.filter(t => t.type === "credit").reduce((s, t) => s + t.amount, 0);
    const expense = mt.filter(t => t.type === "debit" ).reduce((s, t) => s + t.amount, 0);
    months.push({ month: mo, income, expense, savings: income - expense });
  }
  res.json({ success: true, data: months });
};

exports.categories = (req, res) => {
  const month = req.query.month || new Date().toISOString().slice(0, 7);
  const txns  = readDB("transactions")
    .filter(t => t.userId === req.user._id && t.type === "debit" && t.date.startsWith(month));

  const map = {};
  txns.forEach(t => { map[t.category] = (map[t.category] || 0) + t.amount; });
  const data = Object.entries(map).map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  res.json({ success: true, data });
};

exports.topMerchants = (req, res) => {
  const txns = readDB("transactions")
    .filter(t => t.userId === req.user._id && t.type === "debit");
  const map  = {};
  txns.forEach(t => { map[t.payee] = (map[t.payee] || 0) + t.amount; });
  const data = Object.entries(map).map(([payee, total]) => ({ payee, total }))
    .sort((a, b) => b.total - a.total).slice(0, 8);
  res.json({ success: true, data });
};

exports.weekly = (req, res) => {
  const txns  = readDB("transactions").filter(t => t.userId === req.user._id && t.type === "debit");
  const weeks = [];
  for (let i = 3; i >= 0; i--) {
    const end   = new Date(); end.setDate(end.getDate() - i * 7);
    const start = new Date(end); start.setDate(start.getDate() - 6);
    const total = txns
      .filter(t => { const d = new Date(t.date); return d >= start && d <= end; })
      .reduce((s, t) => s + t.amount, 0);
    weeks.push({ label: `Wk ${4 - i}`, total });
  }
  res.json({ success: true, data: weeks });
};