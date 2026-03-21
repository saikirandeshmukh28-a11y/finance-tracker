from fastapi import APIRouter, Depends, Query
from typing import Optional
from datetime import datetime, timedelta
from database import get_conn
from auth_utils import get_current_user

router = APIRouter()

@router.get("/overview")
def overview(current_user=Depends(get_current_user)):
    conn   = get_conn()
    uid    = current_user["id"]
    months = []
    for i in range(3):
        d = datetime.now().replace(day=1)
        if i > 0:
            d = (d - timedelta(days=i*28)).replace(day=1)
        mo = d.strftime("%Y-%m")
        income  = conn.execute("SELECT COALESCE(SUM(amount),0) FROM transactions WHERE user_id=? AND date LIKE ? AND type='credit'", (uid, f"{mo}%")).fetchone()[0]
        expense = conn.execute("SELECT COALESCE(SUM(amount),0) FROM transactions WHERE user_id=? AND date LIKE ? AND type='debit'",  (uid, f"{mo}%")).fetchone()[0]
        months.append({"month": mo, "income": income, "expense": expense, "savings": income - expense})
    conn.close()
    return {"success": True, "data": months}

@router.get("/categories")
def categories(
    month: Optional[str] = None,
    current_user=Depends(get_current_user)
):
    if not month:
        month = datetime.now().strftime("%Y-%m")
    conn = get_conn()
    rows = conn.execute(
        """SELECT category, SUM(amount) as total
           FROM transactions
           WHERE user_id=? AND date LIKE ? AND type='debit'
           GROUP BY category ORDER BY total DESC""",
        (current_user["id"], f"{month}%")
    ).fetchall()
    conn.close()
    return {"success": True, "data": [dict(r) for r in rows]}

@router.get("/top-merchants")
def top_merchants(
    limit: int = 8,
    current_user=Depends(get_current_user)
):
    conn = get_conn()
    rows = conn.execute(
        """SELECT payee, SUM(amount) as total, COUNT(*) as count
           FROM transactions
           WHERE user_id=? AND type='debit'
           GROUP BY payee ORDER BY total DESC LIMIT ?""",
        (current_user["id"], limit)
    ).fetchall()
    conn.close()
    return {"success": True, "data": [dict(r) for r in rows]}

@router.get("/weekly")
def weekly(current_user=Depends(get_current_user)):
    conn   = get_conn()
    uid    = current_user["id"]
    result = []
    for i in range(4):
        end   = datetime.now() - timedelta(weeks=i)
        start = end - timedelta(days=6)
        total = conn.execute(
            """SELECT COALESCE(SUM(amount),0) FROM transactions
               WHERE user_id=? AND type='debit' AND date BETWEEN ? AND ?""",
            (uid, start.strftime("%Y-%m-%d"), end.strftime("%Y-%m-%d"))
        ).fetchone()[0]
        result.append({"label": f"Wk {4-i}", "start": start.strftime("%Y-%m-%d"), "total": total})
    conn.close()
    return {"success": True, "data": list(reversed(result))}
