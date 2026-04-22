"""
Shopping Cart endpoints (Giohang)
- Get cart items
- Add to cart
- Update cart item
- Remove from cart
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("", tags=["Shopping Cart"])
async def get_cart():
    """
    Get current user's shopping cart (Giohang)
    """
    return {"message": "Get cart - to be implemented"}


@router.post("/items", tags=["Shopping Cart"])
async def add_to_cart():
    """
    Add item to cart (Giohang)
    
    Parameters:
    - ID_sanpham: Product ID
    - soluong: Quantity
    - gia: Price
    """
    return {"message": "Add to cart - to be implemented"}


@router.put("/items/{ID_giohang}", tags=["Shopping Cart"])
async def update_cart_item(ID_giohang: int):
    """
    Update cart item quantity (Giohang)
    """
    return {"message": f"Update cart item {ID_giohang} - to be implemented"}


@router.delete("/items/{ID_giohang}", tags=["Shopping Cart"])
async def remove_from_cart(ID_giohang: int):
    """
    Remove item from cart (Giohang)
    """
    return {"message": f"Remove from cart {ID_giohang} - to be implemented"}


@router.delete("", tags=["Shopping Cart"])
async def clear_cart():
    """
    Clear all items from cart (Giohang)
    """
    return {"message": "Clear cart - to be implemented"}
