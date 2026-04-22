"""
Products endpoints (SanPham)
- CRUD operations for products
- Search and filter products
- Supplier management
"""

from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List

router = APIRouter()


@router.get("", tags=["Products"])
async def get_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    ID_danhmuc: Optional[int] = None,
    search: Optional[str] = None,
):
    """
    Get all products (SanPham) with pagination and filtering
    
    Parameters:
    - skip: Number of items to skip
    - limit: Number of items to return
    - ID_danhmuc: Filter by category ID
    - search: Search by product name
    """
    return {"message": "Get products - to be implemented"}


@router.get("/{ID_sanpham}", tags=["Products"])
async def get_product(ID_sanpham: int):
    """
    Get product by ID (SanPham)
    """
    return {"message": f"Get product {ID_sanpham} - to be implemented"}


@router.post("", tags=["Products"])
async def create_product():
    """
    Create new product (SanPham) - admin only
    """
    return {"message": "Create product - to be implemented"}


@router.put("/{ID_sanpham}", tags=["Products"])
async def update_product(ID_sanpham: int):
    """
    Update product (SanPham) - admin only
    """
    return {"message": f"Update product {ID_sanpham} - to be implemented"}


@router.delete("/{ID_sanpham}", tags=["Products"])
async def delete_product(ID_sanpham: int):
    """
    Delete product (SanPham) - admin only
    """
    return {"message": f"Delete product {ID_sanpham} - to be implemented"}


# Product Specifications (ThongsoSP)
@router.post("/{ID_sanpham}/specs", tags=["Products"])
async def add_product_specs(ID_sanpham: int):
    """
    Add specifications for product (ThongsoSP) - admin only
    """
    return {"message": f"Add specs for product {ID_sanpham} - to be implemented"}


# Product Images (AnhSP)
@router.post("/{ID_sanpham}/images", tags=["Products"])
async def add_product_image(ID_sanpham: int):
    """
    Add image for product (AnhSP) - admin only
    """
    return {"message": f"Add image for product {ID_sanpham} - to be implemented"}


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
