from app.core.database import SessionLocal
from app.models.product import DanhMuc, NhaCungCap, SanPham

db = SessionLocal()

print("Categories:")
categories = db.query(DanhMuc).all()
for c in categories:
    print(f"  ID: {c.ID_danhmuc}, Name: {c.tenDanhMuc}")

print("\nSuppliers:")
suppliers = db.query(NhaCungCap).all()
for s in suppliers:
    print(f"  ID: {s.ID_NhaCungCap}, Name: {s.tenNhaCungCap}")

print("\nProducts:")
products = db.query(SanPham).all()
for p in products:
    print(f"  ID: {p.ID_sanpham}, Name: {p.tenSP}")

db.close()
