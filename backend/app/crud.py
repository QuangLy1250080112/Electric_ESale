from sqlalchemy.orm import Session
from . import models, schemas

# --- CHỨC NĂNG CHO DANH MỤC (CATEGORY) ---
def get_categories(db: Session):
    return db.query(models.DanhMuc).all()

def create_category(db: Session, category: schemas.DanhMucCreate):
    db_category = models.DanhMuc(**category.model_dump())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

# --- CHỨC NĂNG CHO SẢN PHẨM (PRODUCT) ---
def get_products(db: Session, skip: int = 0, limit: int = 100, category_id: int = None):
    query = db.query(models.SanPham)
    if category_id:
        query = query.filter(models.SanPham.ID_danhmuc == category_id)
    return query.offset(skip).limit(limit).all()

def get_product_by_id(db: Session, product_id: int):
    return db.query(models.SanPham).filter(models.SanPham.ID_sanpham == product_id).first()

def create_product(db: Session, product: schemas.SanPhamCreate):
    # .model_dump() là cách viết của Pydantic v2 thay cho .dict()
    db_product = models.SanPham(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

# --- CHỨC NĂNG CHO KHO HÀNG (INVENTORY) ---
def get_inventory_by_product(db: Session, product_id: int):
    return db.query(models.TonKho).filter(models.TonKho.ID_sanpham == product_id).first()

def update_inventory_stock(db: Session, product_id: int, new_quantity: int):
    db_inventory = db.query(models.TonKho).filter(models.TonKho.ID_sanpham == product_id).first()
    if db_inventory:
        db_inventory.soluong = new_quantity
        db.commit()
        db.refresh(db_inventory)
    return db_inventory