"""
Categories endpoints (DanhMuc)
- Get categories
- Manage categories (admin)
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("", tags=["Categories"])
async def get_categories():
    """
    Get all categories (DanhMuc)
    """
    return {"message": "Get categories - to be implemented"}


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
