import sqlite3
import os

DB_PATH = os.getenv("DB_PATH", "finvault.db")

def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def init_db():
    conn = get_conn()
    c = conn.cursor()

    c.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            name      TEXT    NOT NULL,
            email     TEXT    NOT NULL UNIQUE,
            phone     TEXT,
            password  TEXT    NOT NULL,
            plan      TEXT    DEFAULT 'free',
            created_at TEXT   DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS transactions (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            date       TEXT    NOT NULL,
            payee      TEXT    NOT NULL,
            category   TEXT    NOT NULL DEFAULT 'other',
            amount     REAL    NOT NULL,
            type       TEXT    NOT NULL CHECK(type IN ('credit','debit')),
            note       TEXT    DEFAULT '',
            created_at TEXT    DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS budgets (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            category   TEXT    NOT NULL,
            month      TEXT    NOT NULL,
            lim        REAL    NOT NULL DEFAULT 0,
            UNIQUE(user_id, category, month)
        );

        CREATE TABLE IF NOT EXISTS goals (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            name       TEXT    NOT NULL,
            target     REAL    NOT NULL,
            saved      REAL    NOT NULL DEFAULT 0,
            deadline   TEXT,
            color      TEXT    DEFAULT '#2563eb',
            created_at TEXT    DEFAULT (datetime('now'))
        );
    """)

    conn.commit()
    conn.close()
    print("✅ Database initialized")
