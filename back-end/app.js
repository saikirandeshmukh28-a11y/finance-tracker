// ─────────────────────────────────────────────
//  FinVault Backend — Express App
//  src/app.js
// ─────────────────────────────────────────────
const express     = require("express");
const cors        = require("cors");
const helmet      = require("helmet");
const morgan      = require("morgan");
const rateLimit   = require("express-rate-limit");

// Route files
const authRoutes        = require("./routes/auth.routes");
const userRoutes        = require("./routes/user.routes");
const transactionRoutes = require("./routes/transaction.routes");
const budgetRoutes      = require("./routes/budget.routes");
const goalRoutes        = require("./routes/goal.routes");
const accountRoutes     = require("./routes/account.routes");
const analyticsRoutes   = require("./routes/analytics.routes");

const app = express();

// ── Security middlewares ──────────────────────
app.use(helmet());                          // Sets secure HTTP headers
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

// ── Rate limiting ─────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,               // 15 minutes
  max: 100,                                // Max 100 requests per window
  message: { success: false, message: "Too many requests. Please try again later." },
});
app.use("/api", limiter);

// ── Auth rate limit (stricter) ─────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many login attempts. Try again in 15 minutes." },
});

// ── Body parser ───────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// ── Logger (dev only) ─────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ── Health check ──────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "FinVault API is running", timestamp: new Date() });
});

// ── Routes ────────────────────────────────────
app.use("/api/auth",         authLimiter, authRoutes);
app.use("/api/users",        userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets",      budgetRoutes);
app.use("/api/goals",        goalRoutes);
app.use("/api/accounts",     accountRoutes);
app.use("/api/analytics",    analyticsRoutes);

// ── 404 handler ───────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global error handler ──────────────────────
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

module.exports = app;
