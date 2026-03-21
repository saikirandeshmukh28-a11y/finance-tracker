"""
Run once to populate demo data:
    python seed.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from database import init_db, get_conn
from auth_utils import hash_password
from datetime import datetime, timedelta
import random

PAYEES = {
    "food":      ["Zomato","Swiggy","Café Coffee Day","McDonald's","Dosa Corner","Pizza Hut","Barbeque Nation"],
    "transport": ["Uber","Ola","HMRL Metro","Indian Oil","Rapido","IndiGo Airlines","Indian Railways"],
    "housing":   ["Rent – Landlord","Society Maintenance","Home Loan EMI – SBI","Gas Cylinder – HP"],
    "health":    ["Apollo Pharmacy","Practo Consult","Cult.fit Membership","MedPlus","Star Health Insurance"],
    "shopping":  ["Amazon India","Flipkart","Myntra","DMart","Reliance Trends","Nykaa","Croma"],
    "entertain": ["Netflix","Spotify Premium","BookMyShow","Steam","Disney+ Hotstar","YouTube Premium"],
    "savings":   ["SIP – Mirae Asset","RD – SBI","PPF – Post Office","NPS Contribution"],
    "utilities": ["TSSPDCL Electricity","Airtel Broadband","Hyderabad Water Board","Jio Recharge"],
    "other":     ["ATM Withdrawal","Miscellaneous","Bank Charges – HDFC"],
}
CATEGORIES = list(PAYEES.keys())

def seed():
    init_db()
    conn = get_conn()

    # Check if already seeded
    existing = conn.execute("SELECT id FROM users WHERE email='arjun@example.com'").fetchone()
    if existing:
        print("⚠️  Demo data already exists. Skipping seed.")
        conn.close()
        return

    # Create demo user
    user_id = conn.execute(
        "INSERT INTO users (name, email, phone, password, plan) VALUES (?,?,?,?,?)",
        ("Arjun Kumar", "arjun@example.com", "+91 9876543210", hash_password("password123"), "premium")
    ).lastrowid
    print(f"✅ Created user: arjun@example.com / password123 (id={user_id})")

    # Generate 90 days of transactions
    now  = datetime.now()
    txns = []

    # Monthly salary for 3 months
    for m in range(3):
        d = (now.replace(day=1) - timedelta(days=m*28)).replace(day=1)
        txns.append((user_id, d.strftime("%Y-%m-%d"), "Salary – TCS", "income", 85000.0, "credit", "Monthly salary"))

    # Random transactions
    for i in range(90):
        d   = now - timedelta(days=i)
        cat = random.choice(CATEGORIES)
        pay = random.choice(PAYEES[cat])
        amt = round(random.uniform(50, 3000), 2)
        txns.append((user_id, d.strftime("%Y-%m-%d"), pay, cat, amt, "debit", ""))

    conn.executemany(
        "INSERT INTO transactions (user_id,date,payee,category,amount,type,note) VALUES (?,?,?,?,?,?,?)",
        txns
    )
    print(f"✅ Created {len(txns)} transactions")

    # Budgets for current month
    month = now.strftime("%Y-%m")
    budgets = [
        (user_id, "food",      month, 8000),
        (user_id, "transport", month, 3000),
        (user_id, "shopping",  month, 5000),
        (user_id, "entertain", month, 2000),
        (user_id, "utilities", month, 4000),
        (user_id, "health",    month, 3000),
    ]
    conn.executemany("INSERT INTO budgets (user_id,category,month,lim) VALUES (?,?,?,?)", budgets)
    print(f"✅ Created {len(budgets)} budgets")

    # Goals
    goals = [
        (user_id, "Emergency Fund",    300000, 142000, "2025-12-31", "#2563eb"),
        (user_id, "Europe Vacation",   150000, 42000,  "2026-06-30", "#16a34a"),
        (user_id, "MacBook Pro",       180000, 90000,  "2025-09-30", "#7c3aed"),
        (user_id, "Home Down Payment", 1000000, 310000,"2028-01-01", "#d97706"),
    ]
    conn.executemany("INSERT INTO goals (user_id,name,target,saved,deadline,color) VALUES (?,?,?,?,?,?)", goals)
    print(f"✅ Created {len(goals)} goals")

    conn.commit()
    conn.close()
    print("\n🎉 Seed complete! Login: arjun@example.com / password123")

if __name__ == "__main__":
    seed()
