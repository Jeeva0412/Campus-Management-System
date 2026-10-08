from app.database import engine
from sqlalchemy import text
from app.core.security import get_password_hash

def fix():
    hash_val = get_password_hash('password123')
    with engine.begin() as conn:
        conn.execute(text("UPDATE users SET password_hash = :hash"), {"hash": hash_val})
    print("Passwords successfully fixed with raw SQL!")

if __name__ == "__main__":
    fix()
