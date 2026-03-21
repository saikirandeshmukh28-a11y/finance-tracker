from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from database import get_conn
from auth_utils import hash_password, verify_password, create_token, get_current_user

router = APIRouter()

class RegisterBody(BaseModel):
    name:     str
    email:    str
    password: str
    phone:    str = ""

class LoginBody(BaseModel):
    email:    str
    password: str

@router.post("/register", status_code=201)
def register(body: RegisterBody):
    conn = get_conn()
    existing = conn.execute("SELECT id FROM users WHERE email=?", (body.email,)).fetchone()
    if existing:
        conn.close()
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = hash_password(body.password)
    cur = conn.execute(
        "INSERT INTO users (name, email, phone, password) VALUES (?,?,?,?)",
        (body.name, body.email, body.phone, hashed)
    )
    conn.commit()
    user_id = cur.lastrowid
    conn.close()
    return {"success": True, "message": "Account created successfully", "data": {"id": user_id}}

@router.post("/login")
def login(body: LoginBody):
    conn = get_conn()
    user = conn.execute("SELECT * FROM users WHERE email=?", (body.email,)).fetchone()
    conn.close()
    if not user or not verify_password(body.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_token(user["id"])
    return {
        "success": True,
        "token": token,
        "user": {
            "id":    user["id"],
            "name":  user["name"],
            "email": user["email"],
            "phone": user["phone"],
            "plan":  user["plan"],
        }
    }

@router.get("/me")
def me(current_user=Depends(get_current_user)):
    return {
        "success": True,
        "user": {
            "id":    current_user["id"],
            "name":  current_user["name"],
            "email": current_user["email"],
            "phone": current_user["phone"],
            "plan":  current_user["plan"],
        }
    }
