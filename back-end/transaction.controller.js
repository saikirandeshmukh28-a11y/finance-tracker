// src/controllers/transaction.controller.js
const Transaction = require("../models/Transaction.model");
const Budget      = require("../models/Budget.model");

// ── GET /api/transactions ─────────────────────
// Query params: category, type, startDate, endDate, search, page, limit, sort
exports.getAll = async (req, res, next) => {
  try {
    const {
      category, type, startDate, endDate,
      search, page = 1, limit = 50, sort = "-date",
    } = req.query;

    const filter = { user: req.user._id };
    if (category) filter.category = category;
    if (type)     filter.type     = type;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate)   filter.date.$lte = new Date(endDate);
    }
    if (search) {
      filter.payee = { $regex: search, $options: "i" };
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Transaction.countDocuments(filter);
    const txns  = await Transaction.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate("account", "name type");

    res.json({
      success: true,
      count: txns.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: txns,
    });
  } catch (err) { next(err); }
};

// ── POST /api/transactions ────────────────────
exports.create = async (req, res, next) => {
  try {
    const { payee, amount, type, category, date, note, account } = req.body;

    const txn = await Transaction.create({
      user: req.user._id,
      payee, amount, type, category,
      date: date || new Date(),
      note, account,
    });

    // If it's a debit, update the spent amount on the matching budget (current month)
    if (type === "debit" && category) {
      const month = (date ? new Date(date) : new Date()).toISOString().slice(0, 7);
      await Budget.findOneAndUpdate(
        { user: req.user._id, category, month },
        { $inc: { spent: amount } },
        { new: true }
      );
    }

    res.status(201).json({ success: true, data: txn });
  } catch (err) { next(err); }
};

// ── GET /api/transactions/:id ─────────────────
exports.getOne = async (req, res, next) => {
  try {
    const txn = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
    if (!txn) return res.status(404).json({ success: false, message: "Transaction not found." });
    res.json({ success: true, data: txn });
  } catch (err) { next(err); }
};

// ── PUT /api/transactions/:id ─────────────────
exports.update = async (req, res, next) => {
  try {
    const txn = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!txn) return res.status(404).json({ success: false, message: "Transaction not found." });
    res.json({ success: true, data: txn });
  } catch (err) { next(err); }
};

// ── DELETE /api/transactions/:id ──────────────
exports.remove = async (req, res, next) => {
  try {
    const txn = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!txn) return res.status(404).json({ success: false, message: "Transaction not found." });
    res.json({ success: true, message: "Transaction deleted." });
  } catch (err) { next(err); }
};

// ── GET /api/transactions/summary ────────────
// Returns monthly income, expense, savings totals
exports.summary = async (req, res, next) => {
  try {
    const { month } = req.query;                        // e.g. "2025-06"
    const start = month ? new Date(`${month}-01`) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end   = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59);

    const result = await Transaction.aggregate([
      { $match: { user: req.user._id, date: { $gte: start, $lte: end } } },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]);

    const income  = result.find(r => r._id === "credit")?.total || 0;
    const expense = result.find(r => r._id === "debit")?.total  || 0;

    res.json({
      success: true,
      data: { income, expense, savings: income - expense, month: start.toISOString().slice(0, 7) },
    });
  } catch (err) { next(err); }
};
