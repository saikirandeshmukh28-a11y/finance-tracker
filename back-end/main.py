from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from routes import auth, transactions, budgets, goals, analytics

app = FastAPI(title="FinVault API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()

app.include_router(auth.router,         prefix="/api/auth",         tags=["Auth"])
app.include_router(transactions.router, prefix="/api/transactions", tags=["Transactions"])
app.include_router(budgets.router,      prefix="/api/budgets",      tags=["Budgets"])
app.include_router(goals.router,        prefix="/api/goals",        tags=["Goals"])
app.include_router(analytics.router,    prefix="/api/analytics",    tags=["Analytics"])

@app.get("/api/health")
def health():
    return {"status": "ok", "message": "FinVault API is running"}
