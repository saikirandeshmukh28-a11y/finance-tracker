const fs   = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../data");

const FILES = {
  users:        path.join(DATA_DIR, "users.json"),
  transactions: path.join(DATA_DIR, "transactions.json"),
  budgets:      path.join(DATA_DIR, "budgets.json"),
  goals:        path.join(DATA_DIR, "goals.json"),
  accounts:     path.join(DATA_DIR, "accounts.json"),
};

// Create data directory and empty JSON files if they don't exist
const initDB = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log("✅  Data directory created");
  }
  Object.entries(FILES).forEach(([name, filePath]) => {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
      console.log(`✅  Created ${name}.json`);
    }
  });
  console.log("✅  JSON file database ready");
};

// Read all records from a collection
const readDB = (collection) => {
  try {
    const data = fs.readFileSync(FILES[collection], "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
};

// Write all records to a collection
const writeDB = (collection, data) => {
  fs.writeFileSync(FILES[collection], JSON.stringify(data, null, 2));
};

// Generate a unique ID
const newId = () => require("crypto").randomUUID();

module.exports = { initDB, readDB, writeDB, newId };