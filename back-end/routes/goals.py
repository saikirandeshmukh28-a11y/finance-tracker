from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from database import get_conn
from auth_utils import get_current_user

router = APIRouter()

class GoalBody(BaseModel):
    name:     str
    target:   float
    saved:    float = 0
    deadline: Optional[str] = None
    color:    str = "#2563eb"

class DepositBody(BaseModel):
    amount: float

@router.get("")
def get_goals(current_user=Depends(get_current_user)):
    conn = get_conn()
    rows = conn.execute(
        "SELECT * FROM goals WHERE user_id=? ORDER BY created_at DESC",
        (current_user["id"],)
    ).fetchall()
    conn.close()
    return {"success": True, "data": [dict(r) for r in rows]}

@router.post("", status_code=201)
def create_goal(body: GoalBody, current_user=Depends(get_current_user)):
    conn = get_conn()
    cur  = conn.execute(
        "INSERT INTO goals (user_id, name, target, saved, deadline, color) VALUES (?,?,?,?,?,?)",
        (current_user["id"], body.name, body.target, body.saved, body.deadline, body.color)
    )
    conn.commit()
    row = conn.execute("SELECT * FROM goals WHERE id=?", (cur.lastrowid,)).fetchone()
    conn.close()
    return {"success": True, "data": dict(row)}

@router.put("/{goal_id}")
def update_goal(goal_id: int, body: GoalBody, current_user=Depends(get_current_user)):
    conn = get_conn()
    row  = conn.execute("SELECT id FROM goals WHERE id=? AND user_id=?", (goal_id, current_user["id"])).fetchone()
    if not row: conn.close(); raise HTTPException(404, "Not found")
    conn.execute(
        "UPDATE goals SET name=?,target=?,saved=?,deadline=?,color=? WHERE id=?",
        (body.name, body.target, body.saved, body.deadline, body.color, goal_id)
    )
    conn.commit()
    row = conn.execute("SELECT * FROM goals WHERE id=?", (goal_id,)).fetchone()
    conn.close()
    return {"success": True, "data": dict(row)}

@router.patch("/{goal_id}/deposit")
def deposit_goal(goal_id: int, body: DepositBody, current_user=Depends(get_current_user)):
    conn = get_conn()
    row  = conn.execute("SELECT * FROM goals WHERE id=? AND user_id=?", (goal_id, current_user["id"])).fetchone()
    if not row: conn.close(); raise HTTPException(404, "Not found")
    new_saved = min(row["saved"] + body.amount, row["target"])
    conn.execute("UPDATE goals SET saved=? WHERE id=?", (new_saved, goal_id))
    conn.commit()
    row = conn.execute("SELECT * FROM goals WHERE id=?", (goal_id,)).fetchone()
    conn.close()
    return {"success": True, "data": dict(row)}

@router.delete("/{goal_id}")
def delete_goal(goal_id: int, current_user=Depends(get_current_user)):
    conn = get_conn()
    row  = conn.execute("SELECT id FROM goals WHERE id=? AND user_id=?", (goal_id, current_user["id"])).fetchone()
    if not row: conn.close(); raise HTTPException(404, "Not found")
    conn.execute("DELETE FROM goals WHERE id=?", (goal_id,))
    conn.commit(); conn.close()
    return {"success": True, "message": "Goal deleted"}
