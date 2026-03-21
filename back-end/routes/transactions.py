from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
from database import get_conn
from auth_utils import get_current_user

router = APIRouter()

class TxnBody(BaseModel):
    date:     str
    payee:    str
    category: str = "other"
    amount:   float
    type:     str   # "credit" | "debit"
    note:     str = ""

@router.get("")
def get_transactions(
    category: Optional[str] = None,
    type:     Optional[str] = None,
    month:    Optional[str] = None,
    limit:    int = 100,
    offset:   int = 0,
    current_user=Depends(get_current_user)
):
    conn = get_conn()
    query  = "SELECT * FROM transactions WHERE user_id=?"
    params = [current_user["id"]]

    if category and category != "all":
        query += " AND category=?"; params.append(category)
    if type:
        query += " AND type=?"; params.append(type)
    if month:
        query += " AND date LIKE ?"; params.append(f"{month}%")

    query += " ORDER BY date DESC, id DESC LIMIT ? OFFSET ?"
    params += [limit, offset]

    rows = conn.execute(query, params).fetchall()
    conn.close()
    return {"success": True, "data": [dict(r) for r in rows]}

@router.get("/summary")
def get_summary(
    month: Optional[str] = None,
    current_user=Depends(get_current_user)
):
    conn   = get_conn()
    params = [current_user["id"]]
    where  = "WHERE user_id=?"
    if month:
        where += " AND date LIKE ?"; params.append(f"{month}%")

    income  = conn.execute(f"SELECT COALESCE(SUM(amount),0) FROM transactions {where} AND type='credit'", params).fetchone()[0]
    expense = conn.execute(f"SELECT COALESCE(SUM(amount),0) FROM transactions {where} AND type='debit'",  params).fetchone()[0]
    conn.close()
    return {"success": True, "data": {"income": income, "expense": expense, "savings": income - expense}}

@router.post("", status_code=201)
def create_transaction(body: TxnBody, current_user=Depends(get_current_user)):
    if body.type not in ("credit", "debit"):
        raise HTTPException(400, "type must be credit or debit")
    conn = get_conn()
    cur  = conn.execute(
        "INSERT INTO transactions (user_id,date,payee,category,amount,type,note) VALUES (?,?,?,?,?,?,?)",
        (current_user["id"], body.date, body.payee, body.category, body.amount, body.type, body.note)
    )
    conn.commit()
    row = conn.execute("SELECT * FROM transactions WHERE id=?", (cur.lastrowid,)).fetchone()
    conn.close()
    return {"success": True, "data": dict(row)}

@router.get("/{txn_id}")
def get_transaction(txn_id: int, current_user=Depends(get_current_user)):
    conn = get_conn()
    row  = conn.execute("SELECT * FROM transactions WHERE id=? AND user_id=?", (txn_id, current_user["id"])).fetchone()
    conn.close()
    if not row: raise HTTPException(404, "Transaction not found")
    return {"success": True, "data": dict(row)}

@router.put("/{txn_id}")
def update_transaction(txn_id: int, body: TxnBody, current_user=Depends(get_current_user)):
    conn = get_conn()
    row  = conn.execute("SELECT id FROM transactions WHERE id=? AND user_id=?", (txn_id, current_user["id"])).fetchone()
    if not row: conn.close(); raise HTTPException(404, "Not found")
    conn.execute(
        "UPDATE transactions SET date=?,payee=?,category=?,amount=?,type=?,note=? WHERE id=?",
        (body.date, body.payee, body.category, body.amount, body.type, body.note, txn_id)
    )
    conn.commit()
    row = conn.execute("SELECT * FROM transactions WHERE id=?", (txn_id,)).fetchone()
    conn.close()
    return {"success": True, "data": dict(row)}

@router.delete("/{txn_id}")
def delete_transaction(txn_id: int, current_user=Depends(get_current_user)):
    conn = get_conn()
    row  = conn.execute("SELECT id FROM transactions WHERE id=? AND user_id=?", (txn_id, current_user["id"])).fetchone()
    if not row: conn.close(); raise HTTPException(404, "Not found")
    conn.execute("DELETE FROM transactions WHERE id=?", (txn_id,))
    conn.commit()
    conn.close()
    return {"success": True, "message": "Transaction deleted"}
