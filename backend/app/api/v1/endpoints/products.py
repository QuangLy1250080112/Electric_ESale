"""
Products endpoints (SanPham)
- CRUD operations for products
- Search and filter products
- Supplier management
"""

from fastapi import APIRouter, Query, HTTPException, Depends, status, File, UploadFile
from sqlalchemy.orm import Session
from sqlalchemy import func as sqlfunc, desc
from typing import Optional, List
import os
import shutil
import uuid
from app.core.database import get_db
from app.models.product import SanPham, DanhMuc, NhaCungCap, AnhSP
from app.models.order import Donhang
from app.schemas.product import SanPhamCreate, SanPhamResponse, DanhMucResponse

router = APIRouter()


@router.get("/newest", response_model=List[SanPhamResponse], tags=["Products"])
async def get_newest_products(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """
    Get newest products sorted by created_at descending
    """
    products = db.query(SanPham).order_by(desc(SanPham.created_at)).limit(limit).all()
    return products


@router.get("/hottest", response_model=List[SanPhamResponse], tags=["Products"])
async def get_hottest_products(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """
    Get best-selling products by summing order quantities from Donhang
    Falls back to newest if no orders exist
    """
    # Subquery: sum soluong per product from orders
    sold_subq = (
        db.query(
            Donhang.ID_sanpham,
            sqlfunc.coalesce(sqlfunc.sum(Donhang.soluong), 0).label("total_sold")
        )
        .group_by(Donhang.ID_sanpham)
        .subquery()
    )

    products = (
        db.query(SanPham)
        .outerjoin(sold_subq, SanPham.ID_sanpham == sold_subq.c.ID_sanpham)
        .order_by(desc(sqlfunc.coalesce(sold_subq.c.total_sold, 0)), desc(SanPham.created_at))
        .limit(limit)
        .all()
    )
    return products


@router.get("", response_model=List[SanPhamResponse], tags=["Products"])
async def get_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    ID_danhmuc: Optional[int] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get all products (SanPham) with pagination and filtering
    """
    query = db.query(SanPham)
    if ID_danhmuc:
        query = query.filter(SanPham.ID_danhmuc == ID_danhmuc)
    if search:
        query = query.filter(SanPham.tenSP.ilike(f"%{search}%"))
    
    products = query.offset(skip).limit(limit).all()
    return products


@router.get("/{ID_sanpham}", response_model=SanPhamResponse, tags=["Products"])
async def get_product(ID_sanpham: int, db: Session = Depends(get_db)):
    """
    Get product by ID (SanPham)
    """
    product = db.query(SanPham).filter(SanPham.ID_sanpham == ID_sanpham).first()
    if not product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    return product


from sqlalchemy.exc import IntegrityError

@router.post("", response_model=SanPhamResponse, tags=["Products"])
async def create_product(product_in: SanPhamCreate, db: Session = Depends(get_db)):
    """
    Create new product (SanPham)
    """
    try:
        db_product = SanPham(**product_in.dict())
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        return db_product
    except IntegrityError as e:
        db.rollback()
        if "unique" in str(e.orig).lower():
            raise HTTPException(
                status_code=400, 
                detail="Tên sản phẩm đã tồn tại. Vui lòng chọn tên khác."
            )
        if "foreign key" in str(e.orig).lower():
            raise HTTPException(
                status_code=400, 
                detail="Lỗi liên kết dữ liệu (Danh mục hoặc Nhà cung cấp không tồn tại)."
            )
        raise HTTPException(status_code=400, detail="Lỗi khi thêm sản phẩm vào cơ sở dữ liệu.")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Lỗi hệ thống: {str(e)}")


@router.put("/{ID_sanpham}", response_model=SanPhamResponse, tags=["Products"])
async def update_product(ID_sanpham: int, product_in: SanPhamCreate, db: Session = Depends(get_db)):
    """
    Update product (SanPham)
    """
    db_product = db.query(SanPham).filter(SanPham.ID_sanpham == ID_sanpham).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    
    for field, value in product_in.dict().items():
        setattr(db_product, field, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product


@router.delete("/{ID_sanpham}", tags=["Products"])
async def delete_product(ID_sanpham: int, db: Session = Depends(get_db)):
    """
    Delete product (SanPham) and its associated images
    """
    try:
        db_product = db.query(SanPham).filter(SanPham.ID_sanpham == ID_sanpham).first()
        if not db_product:
            raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
        
        # Get all images associated with this product before deleting from DB
        images = db_product.images
        
        # Set ID_HinhAnh to None first to break the circular reference if any
        db_product.ID_HinhAnh = None
        db.commit()
        
        # Collect paths to delete
        paths_to_delete = []
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))))
        
        for img in images:
            if img.HinhAnh_url and img.HinhAnh_url.startswith("/images/"):
                # URL is like /images/products/filename.jpg
                # File is at frontend/public/images/products/filename.jpg
                relative_path = img.HinhAnh_url.lstrip("/")
                full_path = os.path.join(base_dir, "frontend", "public", relative_path)
                paths_to_delete.append(full_path)
        
        # Delete product (this will also delete AnhSP records due to cascade="all, delete-orphan")
        db.delete(db_product)
        db.commit()
        
        # Delete files from filesystem
        deleted_count = 0
        for path in paths_to_delete:
            if os.path.exists(path):
                try:
                    os.remove(path)
                    deleted_count += 1
                except Exception as e:
                    print(f"Lỗi khi xóa file {path}: {str(e)}")
        
        return {
            "message": f"Đã xóa sản phẩm và {deleted_count} hình ảnh liên quan thành công"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Lỗi khi xóa sản phẩm: {str(e)}")


@router.get("/suppliers/all", tags=["Products"])
async def get_suppliers(db: Session = Depends(get_db)):
    """
    Get all suppliers (NhaCungCap)
    """
    suppliers = db.query(NhaCungCap).all()
    return suppliers


# Product Specifications (ThongsoSP)
@router.post("/{ID_sanpham}/specs", tags=["Products"])
async def add_product_specs(ID_sanpham: int):
    """
    Add specifications for product (ThongsoSP) - admin only
    """
    return {"message": f"Add specs for product {ID_sanpham} - to be implemented"}


# Product Images (AnhSP)
@router.post("/{ID_sanpham}/images", tags=["Products"])
async def add_product_image(
    ID_sanpham: int, 
    file: UploadFile = File(...), 
    db: Session = Depends(get_db)
):
    """
    Add image for product (AnhSP) - admin only
    """
    # Verify product exists
    product = db.query(SanPham).filter(SanPham.ID_sanpham == ID_sanpham).first()
    if not product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
        
    # Save file to frontend public directory
    # This allows images to be pushed to git and available when database is restored
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))))
    upload_dir = os.path.join(base_dir, "frontend", "public", "images", "products")
    
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir, exist_ok=True)
        
    file_extension = os.path.splitext(file.filename)[1]
    file_name = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(upload_dir, file_name)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Create image record with relative path from frontend public root
    image_url = f"/images/products/{file_name}"
    db_image = AnhSP(ID_sanpham=ID_sanpham, HinhAnh_url=image_url)
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    
    # Update product's ID_HinhAnh if not set (as primary image)
    if not product.ID_HinhAnh:
        product.ID_HinhAnh = db_image.ID_HinhAnh
        db.commit()
        
    return db_image


@router.get("/{ID_sanpham}/images", tags=["Products"])
async def get_product_images(ID_sanpham: int):
    """
    Get all images for product (AnhSP)
    """
    return {"message": f"Get images for product {ID_sanpham} - to be implemented"}


# Inventory (TonKho)
@router.get("/{ID_sanpham}/stock", tags=["Products"])
async def get_product_stock(ID_sanpham: int):
    """
    Get inventory/stock info for product (TonKho)
    """
    return {"message": f"Get stock for product {ID_sanpham} - to be implemented"}


@router.put("/{ID_sanpham}/stock", tags=["Products"])
async def update_product_stock(ID_sanpham: int, soluong: int):
    """
    Update inventory/stock for product (TonKho) - admin only
    """
    return {"message": f"Update stock for product {ID_sanpham} - to be implemented"}
