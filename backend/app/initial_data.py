from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.user import TaiKhoan
from app.core.security import get_password_hash

def init_db():
    db: Session = SessionLocal()
    # Danh sách user cần thêm
    users = [
        {"tenTK": "admin", "matkhau": "123", "is_admin": True, "is_staff": True, "email": "admin@example.com"},
        {"tenTK": "guest", "matkhau": "123", "is_admin": False, "is_staff": False, "email": "guest@example.com"}
    ]
    
    for u in users:
        user = db.query(TaiKhoan).filter(TaiKhoan.tenTK == u["tenTK"]).first()
        if not user:
            new_user = TaiKhoan(
                tenTK=u["tenTK"],
                matkhau=u["matkhau"],
                is_admin=u["is_admin"],
                is_staff=u["is_staff"],
                email=u["email"]
            )
            db.add(new_user)
            print(f"Created user: {u['tenTK']}")
        else:
            user.matkhau = u["matkhau"]
            print(f"Updated user: {u['tenTK']} with plain text password.")
    db.commit()
    db.close()
    print("Database initialized!")

if __name__ == "__main__":
    init_db()