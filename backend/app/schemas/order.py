from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class DonhangCreate(BaseModel):
    ID_sanpham: int
    soluong: int
    gia: float


class DonhangResponse(BaseModel):
    ID_donhang: int
    uID: int
    ID_sanpham: int
    soluong: int
    gia: float
    trangthai: str
    thoigiantao: datetime
    updated_at: datetime
    # Joined fields
    tenSP: Optional[str] = None
    HinhAnh_url: Optional[str] = None

    class Config:
        from_attributes = True


class CheckoutRequest(BaseModel):
    items: List[DonhangCreate]


class ReviewCreate(BaseModel):
    ID_sanpham: int
    rating: int
    comment: Optional[str] = None


class ReviewResponse(BaseModel):
    ID_review: int
    uID: int
    ID_sanpham: int
    rating: int
    comment: Optional[str] = None
    image_url: Optional[str] = None
    thoigiantao: datetime
    updated_at: datetime
    # Joined fields
    tenTK: Optional[str] = None

    class Config:
        from_attributes = True
