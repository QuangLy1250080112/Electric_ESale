"""
Shopping Cart endpoints (Giohang)
- Get cart items
- Add to cart
- Update cart item
- Remove from cart
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import TaiKhoan
from app.models.order import Giohang
from app.models.product import SanPham
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartResponse, CartItemResponse

router = APIRouter()


@router.get("", response_model=CartResponse, tags=["Shopping Cart"])
async def get_cart(
    current_user: TaiKhoan = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current user's shopping cart (Giohang)
    """
    items = db.query(Giohang).filter(Giohang.uID == current_user.uID).all()
    
    # We need to compute total and append joined fields
    total = 0.0
    response_items = []
    
    for item in items:
        product = db.query(SanPham).filter(SanPham.ID_sanpham == item.ID_sanpham).first()
        if product:
            # Add fields dynamically for response
            item.tenSP = product.tenSP
            item.HinhAnh_url = product.HinhAnh_url
            response_items.append(item)
            total += (item.gia * item.soluong)
            
    return {"items": response_items, "total": total}


@router.post("/items", response_model=CartItemResponse, tags=["Shopping Cart"])
async def add_to_cart(
    cart_item: CartItemCreate,
    current_user: TaiKhoan = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Add item to cart (Giohang)
    """
    product = db.query(SanPham).filter(SanPham.ID_sanpham == cart_item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    # Check if item already exists in cart
    existing_item = db.query(Giohang).filter(
        Giohang.uID == current_user.uID,
        Giohang.ID_sanpham == cart_item.product_id
    ).first()
    
    if existing_item:
        existing_item.soluong += cart_item.quantity
        db.commit()
        db.refresh(existing_item)
        existing_item.tenSP = product.tenSP
        existing_item.HinhAnh_url = product.HinhAnh_url
        return existing_item
        
    # Create new item
    new_item = Giohang(
        uID=current_user.uID,
        ID_sanpham=cart_item.product_id,
        soluong=cart_item.quantity,
        gia=product.gia
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    
    new_item.tenSP = product.tenSP
    new_item.HinhAnh_url = product.HinhAnh_url
    return new_item


@router.put("/items/{ID_giohang}", response_model=CartItemResponse, tags=["Shopping Cart"])
async def update_cart_item(
    ID_giohang: int,
    cart_update: CartItemUpdate,
    current_user: TaiKhoan = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update cart item quantity (Giohang)
    """
    item = db.query(Giohang).filter(
        Giohang.ID_giohang == ID_giohang,
        Giohang.uID == current_user.uID
    ).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
        
    item.soluong = cart_update.quantity
    db.commit()
    db.refresh(item)
    
    product = db.query(SanPham).filter(SanPham.ID_sanpham == item.ID_sanpham).first()
    if product:
        item.tenSP = product.tenSP
        item.HinhAnh_url = product.HinhAnh_url
        
    return item


@router.delete("/items/{ID_giohang}", tags=["Shopping Cart"])
async def remove_from_cart(
    ID_giohang: int,
    current_user: TaiKhoan = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Remove item from cart (Giohang)
    """
    item = db.query(Giohang).filter(
        Giohang.ID_giohang == ID_giohang,
        Giohang.uID == current_user.uID
    ).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
        
    db.delete(item)
    db.commit()
    return {"message": "Item removed from cart"}


@router.delete("", tags=["Shopping Cart"])
async def clear_cart(
    current_user: TaiKhoan = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Clear all items from cart (Giohang)
    """
    items = db.query(Giohang).filter(Giohang.uID == current_user.uID).all()
    for item in items:
        db.delete(item)
    db.commit()
    return {"message": "Cart cleared"}
