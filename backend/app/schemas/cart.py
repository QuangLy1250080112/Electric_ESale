from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = 1

class CartItemUpdate(BaseModel):
    quantity: int

class CartItemResponse(BaseModel):
    ID_giohang: int
    uID: int
    ID_sanpham: int
    soluong: int
    gia: float
    created_at: datetime
    updated_at: datetime
    # Joined fields
    tenSP: Optional[str] = None
    HinhAnh_url: Optional[str] = None
    
    class Config:
        from_attributes = True

class CartResponse(BaseModel):
    items: List[CartItemResponse]
    total: float
