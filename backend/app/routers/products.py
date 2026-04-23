from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import crud, schemas

router = APIRouter(
    prefix="/products",
    tags=["Products & Inventory"] # Nhóm các API này lại trong trang Swagger
)

# 1. API Lấy danh sách sản phẩm
@router.get("/", response_model=List[schemas.SanPhamResponse])
def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    products = crud.get_products(db, skip=skip, limit=limit)
    return products

# 2. API Lấy chi tiết một sản phẩm
@router.get("/{product_id}", response_model=schemas.SanPhamResponse)
def read_product(product_id: int, db: Session = Depends(get_db)):
    db_product = crud.get_product_by_id(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm này")
    return db_product

# 3. API Tạo sản phẩm mới (Dành cho Admin/Staff)
@router.post("/", response_model=schemas.SanPhamResponse)
def create_product(product: schemas.SanPhamCreate, db: Session = Depends(get_db)):
    return crud.create_product(db=db, product=product)

# 4. API Lấy danh mục sản phẩm
@router.get("/categories/", response_model=List[schemas.DanhMucResponse])
def read_categories(db: Session = Depends(get_db)):
    return crud.get_categories(db)

# 5. API Cập nhật kho hàng
@router.put("/{product_id}/stock", response_model=schemas.TonKhoResponse)
def update_stock(product_id: int, quantity: int, db: Session = Depends(get_db)):
    db_inventory = crud.update_inventory_stock(db, product_id=product_id, new_quantity=quantity)
    if not db_inventory:
        raise HTTPException(status_code=404, detail="Sản phẩm không tồn tại trong kho")
    return db_inventory