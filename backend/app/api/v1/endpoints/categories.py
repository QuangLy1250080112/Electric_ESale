"""
Categories endpoints (DanhMuc)
- CRUD operations for categories
- Category image upload
- Get products by category
"""

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from typing import List
import os
import uuid
import shutil
from app.core.database import get_db
from app.models.product import DanhMuc, SanPham
from app.schemas.product import DanhMucResponse, SanPhamResponse

router = APIRouter()


@router.get("", response_model=List[DanhMucResponse], tags=["Categories"])
async def get_categories(db: Session = Depends(get_db)):
    """
    Get all categories (DanhMuc)
    """
    categories = db.query(DanhMuc).all()
    return categories


@router.get("/{ID_danhmuc}", response_model=DanhMucResponse, tags=["Categories"])
async def get_category(ID_danhmuc: int, db: Session = Depends(get_db)):
    """
    Get category by ID (DanhMuc)
    """
    category = db.query(DanhMuc).filter(DanhMuc.ID_danhmuc == ID_danhmuc).first()
    if not category:
        raise HTTPException(status_code=404, detail="Không tìm thấy danh mục")
    return category


@router.get("/{ID_danhmuc}/products", response_model=List[SanPhamResponse], tags=["Categories"])
async def get_category_products(ID_danhmuc: int, db: Session = Depends(get_db)):
    """
    Get all products in a specific category
    """
    category = db.query(DanhMuc).filter(DanhMuc.ID_danhmuc == ID_danhmuc).first()
    if not category:
        raise HTTPException(status_code=404, detail="Không tìm thấy danh mục")

    products = db.query(SanPham).filter(SanPham.ID_danhmuc == ID_danhmuc).all()
    return products


@router.post("/{ID_danhmuc}/image", tags=["Categories"])
async def upload_category_image(
    ID_danhmuc: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload image for a category - stores in frontend/public and saves URL in database
    """
    category = db.query(DanhMuc).filter(DanhMuc.ID_danhmuc == ID_danhmuc).first()
    if not category:
        raise HTTPException(status_code=404, detail="Không tìm thấy danh mục")

    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))))
    upload_dir = os.path.join(base_dir, "frontend", "public", "images", "categories")
    os.makedirs(upload_dir, exist_ok=True)

    # Delete old image if exists
    if category.anh_url and category.anh_url.startswith("/images/categories/"):
        old_path = os.path.join(base_dir, "frontend", "public", category.anh_url.lstrip("/"))
        if os.path.exists(old_path):
            try:
                os.remove(old_path)
            except Exception:
                pass

    file_extension = os.path.splitext(file.filename)[1]
    file_name = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(upload_dir, file_name)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    image_url = f"/images/categories/{file_name}"
    category.anh_url = image_url
    db.commit()
    db.refresh(category)

    return {"anh_url": image_url, "message": "Tải ảnh danh mục thành công"}


from pydantic import BaseModel
class DanhMucCreate(BaseModel):
    tenDanhMuc: str
    mota: str = None
    anh_url: str = None

@router.post("", response_model=DanhMucResponse, tags=["Categories"])
async def create_category(category_in: DanhMucCreate, db: Session = Depends(get_db)):
    """
    Create new category (DanhMuc) - admin only
    """
    db_category = DanhMuc(**category_in.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


@router.put("/{ID_danhmuc}", tags=["Categories"])
async def update_category(ID_danhmuc: int, db: Session = Depends(get_db)):
    """
    Update category (DanhMuc) - admin only
    """
    return {"message": f"Update category {ID_danhmuc} - to be implemented"}


@router.delete("/{ID_danhmuc}", tags=["Categories"])
async def delete_category(ID_danhmuc: int, db: Session = Depends(get_db)):
    """
    Delete category (DanhMuc) - admin only
    """
    return {"message": f"Delete category {ID_danhmuc} - to be implemented"}
