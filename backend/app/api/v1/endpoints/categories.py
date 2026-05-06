from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.product import DanhMuc
from app.schemas.product import DanhMucResponse

router = APIRouter()


@router.get("", response_model=List[DanhMucResponse], tags=["Categories"])
async def get_categories(db: Session = Depends(get_db)):
    """
    Get all categories (DanhMuc)
    """
    categories = db.query(DanhMuc).all()
    return categories


@router.get("/{ID_danhmuc}", tags=["Categories"])
async def get_category(ID_danhmuc: int):
    """
    Get category by ID (DanhMuc)
    """
    return {"message": f"Get category {ID_danhmuc} - to be implemented"}


@router.post("", tags=["Categories"])
async def create_category():
    """
    Create new category (DanhMuc) - admin only
    """
    return {"message": "Create category - to be implemented"}


@router.put("/{ID_danhmuc}", tags=["Categories"])
async def update_category(ID_danhmuc: int):
    """
    Update category (DanhMuc) - admin only
    """
    return {"message": f"Update category {ID_danhmuc} - to be implemented"}


@router.delete("/{ID_danhmuc}", tags=["Categories"])
async def delete_category(ID_danhmuc: int):
    """
    Delete category (DanhMuc) - admin only
    """
    return {"message": f"Delete category {ID_danhmuc} - to be implemented"}
