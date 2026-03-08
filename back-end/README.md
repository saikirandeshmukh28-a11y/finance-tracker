# FinVault Backend — Complete Setup Guide

## Project Structure

```
finvault-backend/
├── src/
│   ├── server.js                  ← Entry point
│   ├── app.js                     ← Express app setup
│   ├── config/
│   │   └── db.js                  ← MongoDB connection
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Transaction.model.js
│   │   ├── Budget.model.js
│   │   ├── Goal.model.js
│   │   └── Account.model.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── transaction.controller.js
│   │   ├── budget.controller.js
│   │   ├── goal.controller.js
│   │   ├── account.controller.js
│   │   └── analytics.controller.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── transaction.routes.js
│   │   ├── budget.routes.js
│   │   ├── goal.routes.js
│   │   ├── account.routes.js
│   │   └── analytics.routes.js
│   ├── middleware/
│   │   ├── auth.middleware.js      ← JWT verification
│   │   └── validate.middleware.js  ← Input validation
│   └── utils/
│       └── seed.js                 ← Demo data seeder
├── .env
├── .gitignore
└── package.json
```

---

## STEP 1 — Install Node.js

1. Go to https://nodejs.org
2. Download the **LTS version** (v20 or higher)
3. Run the installer — keep all defaults
4. Verify in terminal:
   ```
   node -v     → should show v20.x.x
   npm -v      → should show 10.x.x
   ```

---

## STEP 2 — Install MongoDB

### Option A: Local MongoDB (easiest for development)
1. Go to https://www.mongodb.com/try/download/community
2. Download **MongoDB Community Server** for Windows
3. Install with default settings (it installs as a service — starts automatically)
4. Your connection string is: `mongodb://localhost:27017/finvault`

### Option B: MongoDB Atlas (free cloud database)
1. Go to https://www.mongodb.com/atlas
2. Click "Try Free" → create account
3. Create a free M0 cluster (choose any region)
4. Under "Database Access" → Add user → set username + password
5. Under "Network Access" → Add IP → Allow 0.0.0.0/0 (all IPs)
6. Click "Connect" → "Connect your application" → copy the URI
7. Replace `<password>` in the URI with your actual password
8. Paste that URI into your .env file as MONGO_URI

---

## STEP 3 — Set Up the Project

Open VS Code terminal (Ctrl + `) and run:

```bash
# 1. Go into the backend folder
cd finvault-backend

# 2. Install all dependencies
npm install

# 3. Open .env and set your MongoDB URI
# Edit the MONGO_URI line — use localhost or Atlas URI from Step 2
```

---

## STEP 4 — Configure .env File

Open `.env` and update:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/finvault
JWT_SECRET=pick_any_long_random_string_here_min_32_chars
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

> For JWT_SECRET use anything random like: `finvault_super_secret_key_2025_xyz`

---

## STEP 5 — Seed Demo Data (optional)

Populate the database with sample transactions, budgets, goals:

```bash
npm run seed
```

Output:
```
✅  User created: arjun@example.com
✅  Accounts seeded
✅  61 transactions seeded
✅  Budgets seeded
✅  Goals seeded
🎉  Seed complete!
   Login: arjun@example.com / password123
```

---

## STEP 6 — Start the Backend

```bash
# Development mode (auto-restarts on file change)
npm run dev

# Production mode
npm start
```

You should see:
```
🚀  FinVault API running on http://localhost:5000
📦  Environment : development
🗄️   Database    : Connected to MongoDB
```

---

## STEP 7 — Test the API

Open your browser or use a tool like Postman / Thunder Client (VS Code extension).

### Test health check:
```
GET http://localhost:5000/api/health
```
Returns: `{ "success": true, "message": "FinVault API is running" }`

### Register a user:
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Arjun Kumar",
  "email": "arjun@example.com",
  "password": "password123"
}
```

### Login:
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "arjun@example.com",
  "password": "password123"
}
```
Returns a JWT token. Copy it.

### Get transactions (paste token):
```
GET http://localhost:5000/api/transactions
Authorization: Bearer <your_token_here>
```

---

## Full API Reference

### Auth
| Method | Route                  | Description          | Auth? |
|--------|------------------------|----------------------|-------|
| POST   | /api/auth/register     | Create account       | No    |
| POST   | /api/auth/login        | Login, get JWT       | No    |
| GET    | /api/auth/me           | Get current user     | Yes   |

### Users
| Method | Route                       | Description           | Auth? |
|--------|-----------------------------|-----------------------|-------|
| GET    | /api/users/profile          | Get profile           | Yes   |
| PUT    | /api/users/profile          | Update name/phone     | Yes   |
| PUT    | /api/users/change-password  | Change password       | Yes   |

### Transactions
| Method | Route                           | Description                   | Auth? |
|--------|---------------------------------|-------------------------------|-------|
| GET    | /api/transactions               | List (filter, sort, paginate) | Yes   |
| GET    | /api/transactions/summary       | Monthly income/expense totals | Yes   |
| GET    | /api/transactions/:id           | Single transaction            | Yes   |
| POST   | /api/transactions               | Add new transaction           | Yes   |
| PUT    | /api/transactions/:id           | Update transaction            | Yes   |
| DELETE | /api/transactions/:id           | Delete transaction            | Yes   |

Query params for GET /api/transactions:
- `category=food` — filter by category
- `type=debit` — filter by type
- `startDate=2025-06-01&endDate=2025-06-30` — date range
- `search=zomato` — search payee name
- `page=1&limit=20` — pagination
- `sort=-amount` — sort (prefix - for descending)

### Budgets
| Method | Route             | Description              | Auth? |
|--------|-------------------|--------------------------|-------|
| GET    | /api/budgets      | Get budgets (?month=)    | Yes   |
| POST   | /api/budgets      | Create/update budget     | Yes   |
| PUT    | /api/budgets/:id  | Edit budget limit        | Yes   |
| DELETE | /api/budgets/:id  | Delete budget            | Yes   |

### Goals
| Method | Route                      | Description         | Auth? |
|--------|----------------------------|---------------------|-------|
| GET    | /api/goals                 | List all goals      | Yes   |
| POST   | /api/goals                 | Create goal         | Yes   |
| PUT    | /api/goals/:id             | Update goal         | Yes   |
| PATCH  | /api/goals/:id/deposit     | Add savings amount  | Yes   |
| DELETE | /api/goals/:id             | Delete goal         | Yes   |

### Accounts
| Method | Route               | Description    | Auth? |
|--------|---------------------|----------------|-------|
| GET    | /api/accounts       | List accounts  | Yes   |
| POST   | /api/accounts       | Add account    | Yes   |
| PUT    | /api/accounts/:id   | Update account | Yes   |
| DELETE | /api/accounts/:id   | Remove account | Yes   |

### Analytics
| Method | Route                          | Description             | Auth? |
|--------|--------------------------------|-------------------------|-------|
| GET    | /api/analytics/overview        | 3-month summary         | Yes   |
| GET    | /api/analytics/categories      | Category breakdown      | Yes   |
| GET    | /api/analytics/top-merchants   | Top 8 merchants         | Yes   |
| GET    | /api/analytics/weekly          | Last 4 weeks spend      | Yes   |

---

## Connect Frontend to Backend

In your React frontend, replace the hardcoded data with API calls.
Example using fetch:

```js
// Login
const res  = await fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
const data = await res.json();
localStorage.setItem("token", data.token);   // save token

// Authenticated request
const token = localStorage.getItem("token");
const txns  = await fetch("http://localhost:5000/api/transactions", {
  headers: { Authorization: `Bearer ${token}` },
}).then(r => r.json());
```

---

## Common Errors & Fixes

| Error                              | Fix                                              |
|------------------------------------|--------------------------------------------------|
| `ECONNREFUSED 127.0.0.1:27017`    | MongoDB not running — start MongoDB service      |
| `Invalid token`                    | Token expired — log in again                     |
| `Cannot find module 'express'`     | Run `npm install` first                          |
| `Port 5000 already in use`         | Change PORT in .env to 5001                      |
| `MongoServerError: E11000`         | Duplicate email — user already registered        |

---

## Running Both Frontend + Backend Together

Open **two terminals** in VS Code:

Terminal 1 (backend):
```bash
cd finvault-backend
npm run dev
```

Terminal 2 (frontend):
```bash
cd finance-tracker   (your Vite project)
npm run dev
```

Backend → http://localhost:5000
Frontend → http://localhost:5173
