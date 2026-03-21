from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from database import get_conn
from auth_utils import get_current_user

router = APIRouter()

class BudgetBody(BaseModel):
    category: str
    limit:    float
    month:    Optional[str] = None   # defaults to current YYYY-MM

@router.get("")
def get_budgets(
    month: Optional[str] = None,
    current_user=Depends(get_current_user)
):
    if not month:
        month = datetime.now().strftime("%Y-%m")

    conn = get_conn()

    # Get budgets for this month
    budgets = conn.execute(
        "SELECT * FROM budgets WHERE user_id=? AND month=?",
        (current_user["id"], month)
    ).fetchall()

    result = []
    for b in budgets:
        # Calculate live spent from transactions
        spent = conn.execute(
            "SELECT COALESCE(SUM(amount),0) FROM transactions WHERE user_id=? AND category=? AND date LIKE ? AND type='debit'",
            (current_user["id"], b["category"], f"{month}%")
        ).fetchone()[0]
        d = dict(b)
        d["spent"] = spent
        d["limit"] = b["lim"]
        del d["lim"]
        result.append(d)

    conn.close()
    return {"success": True, "data": result}

@router.post("", status_code=201)
def create_budget(body: BudgetBody, current_user=Depends(get_current_user)):
    month = body.month or datetime.now().strftime("%Y-%m")
    conn  = get_conn()

    # Upsert
    conn.execute(
        """INSERT INTO budgets (user_id, category, month, lim)
           VALUES (?,?,?,?)
           ON CONFLICT(user_id, category, month) DO UPDATE SET lim=excluded.lim""",
        (current_user["id"], body.category, month, body.limit)
    )
    conn.commit()
    row = conn.execute(
        "SELECT * FROM budgets WHERE user_id=? AND category=? AND month=?",
        (current_user["id"], body.category, month)
    ).fetchone()
    spent = conn.execute(
        "SELECT COALESCE(SUM(amount),0) FROM transactions WHERE user_id=? AND category=? AND date LIKE ? AND type='debit'",
        (current_user["id"], body.category, f"{month}%")
    ).fetchone()[0]
    conn.close()
    d = dict(row); d["spent"] = spent; d["limit"] = d.pop("lim")
    return {"success": True, "data": d}

@router.put("/{budget_id}")
def update_budget(budget_id: int, body: BudgetBody, current_user=Depends(get_current_user)):
    conn = get_conn()
    row  = conn.execute("SELECT id FROM budgets WHERE id=? AND user_id=?", (budget_id, current_user["id"])).fetchone()
    if not row: conn.close(); raise HTTPException(404, "Not found")
    conn.execute("UPDATE budgets SET lim=? WHERE id=?", (body.limit, budget_id))
    conn.commit()
    row = conn.execute("SELECT * FROM budgets WHERE id=?", (budget_id,)).fetchone()
    conn.close()
    d = dict(row); d["limit"] = d.pop("lim")
    return {"success": True, "data": d}

@router.delete("/{budget_id}")
def delete_budget(budget_id: int, current_user=Depends(get_current_user)):
    conn = get_conn()
    row  = conn.execute("SELECT id FROM budgets WHERE id=? AND user_id=?", (budget_id, current_user["id"])).fetchone()
    if not row: conn.close(); raise HTTPException(404, "Not found")
    conn.execute("DELETE FROM budgets WHERE id=?", (budget_id,))
    conn.commit(); conn.close()
    return {"success": True, "message": "Budget deleted"}
