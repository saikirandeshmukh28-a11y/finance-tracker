require("dotenv").config();
const bcrypt = require("bcryptjs");
const { initDB, writeDB, newId } = require("../config/db");

async function seed() {
  initDB();
  console.log("🌱  Seeding JSON database…");

  const userId = newId();
  const hashed = await bcrypt.hash("password123", 12);

  writeDB("users", [{
    _id: userId, name: "Arjun Kumar", email: "arjun@example.com",
    phone: "+91 9876543210", password: hashed, plan: "premium", isActive: true,
    createdAt: new Date().toISOString(),
  }]);
  console.log("✅  User created: arjun@example.com");

  writeDB("accounts", [
    { _id: newId(), userId, name: "HDFC Savings Account", type: "Savings",     balance: 142350,  last4: "4821", color: "#2563eb", icon: "building2"   },
    { _id: newId(), userId, name: "SBI Salary Account",   type: "Salary",      balance: 68200,   last4: "3309", color: "#16a34a", icon: "wallet"      },
    { _id: newId(), userId, name: "ICICI Credit Card",    type: "Credit Card", balance: -23450,  last4: "9977", color: "#dc2626", icon: "credit-card" },
    { _id: newId(), userId, name: "Zerodha Portfolio",    type: "Investment",  balance: 315000,  last4: "—",    color: "#7c3aed", icon: "line-chart"  },
  ]);
  console.log("✅  Accounts seeded");

  const payeesByCat = {
    food:      ["Zomato","Swiggy","McDonald's","Pizza Hut","Café Coffee Day"],
    transport: ["Uber","Ola","IndiGo","Indian Railways","Indian Oil"],
    shopping:  ["Amazon India","Flipkart","Myntra","DMart","Croma"],
    utilities: ["TSSPDCL","Airtel","Jio Recharge","Hyderabad Water Board"],
    health:    ["Apollo Pharmacy","Practo","Cult.fit","MedPlus"],
    entertain: ["Netflix","Spotify","BookMyShow","Disney+ Hotstar"],
    income:    ["Salary – TCS","Freelance Payment","Dividend – HDFC"],
  };
  const cats = Object.keys(payeesByCat);
  const txns = [];

  for (let i = 0; i < 60; i++) {
    const d        = new Date(); d.setDate(d.getDate() - i);
    const isIncome = Math.random() < 0.07;
    const cat      = isIncome ? "income" : cats.filter(c => c !== "income")[Math.floor(Math.random() * 6)];
    const list     = payeesByCat[cat];
    txns.push({
      _id: newId(), userId,
      payee:    list[Math.floor(Math.random() * list.length)],
      amount:   isIncome ? Math.round(Math.random()*40000+5000) : Math.round(Math.random()*3000+50),
      type:     isIncome ? "credit" : "debit",
      category: cat,
      date:     d.toISOString(),
      note:     "",
      createdAt: new Date().toISOString(),
    });
  }
  txns.push({ _id: newId(), userId, payee: "Salary – TCS", amount: 85000, type: "credit", category: "income", date: new Date().toISOString(), note: "", createdAt: new Date().toISOString() });
  writeDB("transactions", txns);
  console.log(`✅  ${txns.length} transactions seeded`);

  const month = new Date().toISOString().slice(0, 7);
  writeDB("budgets", [
    { _id: newId(), userId, category: "food",      limit: 8000, month, spent: 0 },
    { _id: newId(), userId, category: "transport", limit: 3000, month, spent: 0 },
    { _id: newId(), userId, category: "shopping",  limit: 5000, month, spent: 0 },
    { _id: newId(), userId, category: "entertain", limit: 2000, month, spent: 0 },
    { _id: newId(), userId, category: "utilities", limit: 4000, month, spent: 0 },
    { _id: newId(), userId, category: "health",    limit: 3000, month, spent: 0 },
  ]);
  console.log("✅  Budgets seeded");

  writeDB("goals", [
    { _id: newId(), userId, name: "Emergency Fund",    target: 300000,  saved: 142000, icon: "shield", color: "#2563eb", deadline: "2025-12-31", isCompleted: false, createdAt: new Date().toISOString() },
    { _id: newId(), userId, name: "Europe Vacation",   target: 150000,  saved: 42000,  icon: "award",  color: "#16a34a", deadline: "2026-06-30", isCompleted: false, createdAt: new Date().toISOString() },
    { _id: newId(), userId, name: "MacBook Pro",        target: 180000,  saved: 90000,  icon: "laptop", color: "#7c3aed", deadline: "2025-09-30", isCompleted: false, createdAt: new Date().toISOString() },
    { _id: newId(), userId, name: "Home Down Payment",  target: 1000000, saved: 310000, icon: "home",   color: "#d97706", deadline: "2028-01-01", isCompleted: false, createdAt: new Date().toISOString() },
  ]);
  console.log("✅  Goals seeded");

  console.log("\n🎉  Seed complete!");
  console.log("   Login: arjun@example.com / password123");
}

seed().catch(err => { console.error(err); process.exit(1); });