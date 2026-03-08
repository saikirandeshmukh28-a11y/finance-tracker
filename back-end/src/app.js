const express   = require("express");
const cors      = require("cors");
const helmet    = require("helmet");
const morgan    = require("morgan");
const rateLimit = require("express-rate-limit");

// Load routes one by one and log each
let authRoutes, userRoutes, transactionRoutes, budgetRoutes, goalRoutes, accountRoutes, analyticsRoutes;

try { authRoutes        = require("./routes/auth.routes");        console.log("✅ auth routes OK"); }        catch(e) { console.log("❌ auth routes FAILED:", e.message); }
try { userRoutes        = require("./routes/user.routes");        console.log("✅ user routes OK"); }        catch(e) { console.log("❌ user routes FAILED:", e.message); }
try { transactionRoutes = require("./routes/transaction.routes"); console.log("✅ transaction routes OK"); } catch(e) { console.log("❌ transaction routes FAILED:", e.message); }
try { budgetRoutes      = require("./routes/budget.routes");      console.log("✅ budget routes OK"); }      catch(e) { console.log("❌ budget routes FAILED:", e.message); }
try { goalRoutes        = require("./routes/goal.routes");        console.log("✅ goal routes OK"); }        catch(e) { console.log("❌ goal routes FAILED:", e.message); }
try { accountRoutes     = require("./routes/account.routes");     console.log("✅ account routes OK"); }     catch(e) { console.log("❌ account routes FAILED:", e.message); }
try { analyticsRoutes   = require("./routes/analytics.routes");   console.log("✅ analytics routes OK"); }   catch(e) { console.log("❌ analytics routes FAILED:", e.message); }

console.log("\nTypes:");
console.log("auth:",        typeof authRoutes);
console.log("user:",        typeof userRoutes);
console.log("transaction:", typeof transactionRoutes);
console.log("budget:",      typeof budgetRoutes);
console.log("goal:",        typeof goalRoutes);
console.log("account:",     typeof accountRoutes);
console.log("analytics:",   typeof analyticsRoutes);

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "FinVault API is running" });
});

const limiter     = rateLimit({ windowMs: 15*60*1000, max: 100 });
const authLimiter = rateLimit({ windowMs: 15*60*1000, max: 10  });

if (authRoutes)        app.use("/api/auth",         authLimiter, authRoutes);
if (userRoutes)        app.use("/api/users",         userRoutes);
if (transactionRoutes) app.use("/api/transactions",  transactionRoutes);
if (budgetRoutes)      app.use("/api/budgets",        budgetRoutes);
if (goalRoutes)        app.use("/api/goals",          goalRoutes);
if (accountRoutes)     app.use("/api/accounts",       accountRoutes);
if (analyticsRoutes)   app.use("/api/analytics",      analyticsRoutes);

app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({ success: false, message: err.message || "Server Error" });
});

module.exports = app;