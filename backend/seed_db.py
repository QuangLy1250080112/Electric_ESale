from app.core.database import SessionLocal
from app.models.product import DanhMuc, NhaCungCap, SanPham

db = SessionLocal()

# Check and seed categories if empty
if db.query(DanhMuc).count() == 0:
    print("Seeding categories...")
    categories = [
        DanhMuc(tenDanhMuc="Laptops", mota="Portable computers"),
        DanhMuc(tenDanhMuc="Phones", mota="Mobile devices"),
        DanhMuc(tenDanhMuc="Tablets", mota="Tablet devices"),
        DanhMuc(tenDanhMuc="Accessories", mota="Computer accessories")
    ]
    db.add_all(categories)
    db.commit()

# Check and seed suppliers if empty
if db.query(NhaCungCap).count() == 0:
    print("Seeding suppliers...")
    # We need a category for the supplier
    cat = db.query(DanhMuc).first()
    supplier = NhaCungCap(
        tenNhaCungCap="Default Supplier",
        ID_danhmuc=cat.ID_danhmuc,
        sdt="0123456789",
        email="supplier@example.com"
    )
    db.add(supplier)
    db.commit()
    print(f"Added supplier with ID: {supplier.ID_NhaCungCap}")

print("\nCategories:")
for c in db.query(DanhMuc).all():
    print(f"  ID: {c.ID_danhmuc}, Name: {c.tenDanhMuc}")

print("\nSuppliers:")
for s in db.query(NhaCungCap).all():
    print(f"  ID: {s.ID_NhaCungCap}, Name: {s.tenNhaCungCap}")

db.close()
