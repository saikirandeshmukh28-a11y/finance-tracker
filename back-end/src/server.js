require("dotenv").config();
const app = require("./app");
const { initDB } = require("./config/db");

const PORT = process.env.PORT || 5000;

initDB();

app.listen(PORT, () => {
  console.log(`\n🚀  FinVault API running on http://localhost:${PORT}`);
  console.log(`📦  Environment : ${process.env.NODE_ENV}`);
  console.log(`🗄️   Storage     : JSON file database\n`);
});