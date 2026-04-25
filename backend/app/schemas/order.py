"""
Order, Cart, Payment and Review schemas
"""

from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


# Shopping Cart (Giohang) Schemas
class GiohangBase(BaseModel):
    """Base shopping cart schema"""
    uID: int
    ID_sanpham: int
    soluong: int
    gia: float


class GiohangCreate(GiohangBase):
    """Shopping cart creation schema"""
    pass


class GiohangUpdate(BaseModel):
    """Shopping cart update schema"""
    soluong: Optional[int] = None
    gia: Optional[float] = None


class GiohangResponse(GiohangBase):
    """Shopping cart response schema"""
    ID_giohang: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# Order (Donhang) Schemas
class DonhangBase(BaseModel):
    """Base order schema"""
    uID: int
    trangthai: str
    soluong: int
    ID_sanpham: int
    gia: float


class DonhangCreate(BaseModel):
    """Order creation schema"""
    uID: int
    items: List[dict]  # List of {ID_sanpham, soluong, gia}


class DonhangUpdate(BaseModel):
    """Order update schema"""
    trangthai: Optional[str] = None


class DonhangResponse(DonhangBase):
    """Order response schema"""
    ID_donhang: int
    thoigiantao: datetime
    
    class Config:
        from_attributes = True


# Payment (PTThanhToan) Schemas
class PTThanhToanBase(BaseModel):
    """Base payment schema"""
    PhuongThucTT: str
    trangthai: str
    tonggia: float


class PTThanhToanCreate(BaseModel):
    """Payment creation schema"""
    ID_giohang: Optional[int] = None
    ID_donhang: Optional[int] = None
    PhuongThucTT: str
    tonggia: float


class PTThanhToanUpdate(BaseModel):
    """Payment update schema"""
    trangthai: Optional[str] = None


class PTThanhToanResponse(PTThanhToanBase):
    """Payment response schema"""
    ID_ThanhToan: int
    ID_giohang: Optional[int]
    ID_donhang: Optional[int]
    thoigiantao: datetime
    
    class Config:
        from_attributes = True


# Review (Reviews) Schemas
class ReviewsBase(BaseModel):
    """Base review schema"""
    uID: int
    ID_sanpham: int
    rating: int  # 1-5
    comment: str


class ReviewsCreate(ReviewsBase):
    """Review creation schema"""
    pass


class ReviewsUpdate(BaseModel):
    """Review update schema"""
    rating: Optional[int] = None
    comment: Optional[str] = None


class ReviewsResponse(ReviewsBase):
    """Review response schema"""
    ID_review: int
    thoigiantao: datetime
    
    class Config:
        from_attributes = True


# Combined Responses
class GiohangDetailResponse(BaseModel):
    """Shopping cart with items details"""
    ID_giohang: int
    uID: int
    items: List[GiohangResponse]
    total_price: float


class DonhangDetailResponse(DonhangResponse):
    """Order with details"""
    items: List[dict] = []
    payment: Optional[PTThanhToanResponse] = None
