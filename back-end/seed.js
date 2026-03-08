// src/utils/seed.js
// Run: node src/utils/seed.js
require("dotenv").config();
const mongoose    = require("mongoose");
const User        = require("../models/User.model");
const Account     = require("../models/Account.model");
const Transaction = require("../models/Transaction.model");
const Budget      = require("../models/Budget.model");
const Goal        = require("../models/Goal.model");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("🌱  Seeding database…");

  // Clean up
  await Promise.all([
    User.deleteMany({}), Account.deleteMany({}),
    Transaction.deleteMany({}), Budget.deleteMany({}), Goal.deleteMany({}),
  ]);

  // Create demo user
  const user = await User.create({
    name: "Arjun Kumar",
    email: "arjun@example.com",
    password: "password123",
    phone: "+91 9876543210",
    plan: "premium",
  });
  console.log(`✅  User created: ${user.email}`);

  // Accounts
  await Account.insertMany([
    { user: user._id, name: "HDFC Savings Account",  type: "Savings",     balance: 142350,  last4: "4821", color: "#2563eb", icon: "building2" },
    { user: user._id, name: "SBI Salary Account",    type: "Salary",      balance: 68200,   last4: "3309", color: "#16a34a", icon: "wallet"    },
    { user: user._id, name: "ICICI Credit Card",     type: "Credit Card", balance: -23450,  last4: "9977", color: "#dc2626", icon: "credit-card"},
    { user: user._id, name: "Zerodha Portfolio",     type: "Investment",  balance: 315000,  last4: "—",    color: "#7c3aed", icon: "line-chart" },
  ]);
  console.log("✅  Accounts seeded");

  // Transactions (last 30 days sample)
  const payeesByCat = {
    food:      ["Zomato","Swiggy","McDonald's","Pizza Hut","Café Coffee Day"],
    transport: ["Uber","Ola","IndiGo","Indian Railways","Indian Oil"],
    shopping:  ["Amazon India","Flipkart","Myntra","DMart","Croma"],
    utilities: ["TSSPDCL","Airtel","Jio Recharge","Hyderabad Water Board"],
    health:    ["Apollo Pharmacy","Practo","Cult.fit","MedPlus"],
    entertain: ["Netflix","Spotify","BookMyShow","Disney+ Hotstar"],
    savings:   ["SIP – Mirae Asset","PPF – Post Office","RD – SBI"],
    income:    ["Salary – TCS","Freelance Payment","Dividend – HDFC"],
  };
  const cats = Object.keys(payeesByCat);
  const txns = [];
  for (let i = 0; i < 60; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const isIncome = Math.random() < 0.07;
    const cat  = isIncome ? "income" : cats.filter(c => c !== "income")[Math.floor(Math.random() * 7)];
    const list = payeesByCat[cat];
    txns.push({
      user:     user._id,
      payee:    list[Math.floor(Math.random() * list.length)],
      amount:   isIncome ? Math.round(Math.random() * 40000 + 5000) : Math.round(Math.random() * 3000 + 50),
      type:     isIncome ? "credit" : "debit",
      category: cat,
      date:     d,
    });
  }
  // Add monthly salary
  txns.push({ user: user._id, payee: "Salary – TCS", amount: 85000, type: "credit", category: "income", date: new Date() });
  await Transaction.insertMany(txns);
  console.log(`✅  ${txns.length} transactions seeded`);

  // Budgets
  const month = new Date().toISOString().slice(0, 7);
  await Budget.insertMany([
    { user: user._id, category: "food",      limit: 8000,  month },
    { user: user._id, category: "transport", limit: 3000,  month },
    { user: user._id, category: "shopping",  limit: 5000,  month },
    { user: user._id, category: "entertain", limit: 2000,  month },
    { user: user._id, category: "utilities", limit: 4000,  month },
    { user: user._id, category: "health",    limit: 3000,  month },
  ]);
  console.log("✅  Budgets seeded");

  // Goals
  await Goal.insertMany([
    { user: user._id, name: "Emergency Fund",    target: 300000,  saved: 142000, icon: "shield",    color: "#2563eb", deadline: new Date("2025-12-31") },
    { user: user._id, name: "Europe Vacation",   target: 150000,  saved: 42000,  icon: "award",     color: "#16a34a", deadline: new Date("2026-06-30") },
    { user: user._id, name: "MacBook Pro",        target: 180000,  saved: 90000,  icon: "laptop",    color: "#7c3aed", deadline: new Date("2025-09-30") },
    { user: user._id, name: "Home Down Payment",  target: 1000000, saved: 310000, icon: "home",      color: "#d97706", deadline: new Date("2028-01-01") },
  ]);
  console.log("✅  Goals seeded");

  console.log("\n🎉  Seed complete!");
  console.log(`   Login: arjun@example.com / password123`);
  mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
