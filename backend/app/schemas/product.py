from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class SanPhamBase(BaseModel):
    tenSP: str
    mota: Optional[str] = None
    gia: float
    ID_danhmuc: int
    supplier_ID: int
    ID_HinhAnh: Optional[int] = None

class SanPhamCreate(SanPhamBase):
    pass

class SanPhamUpdate(BaseModel):
    tenSP: Optional[str] = None
    mota: Optional[str] = None
    gia: Optional[float] = None
    ID_danhmuc: Optional[int] = None
    supplier_ID: Optional[int] = None
    ID_HinhAnh: Optional[int] = None

class SanPhamResponse(SanPhamBase):
    ID_sanpham: int
    HinhAnh_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DanhMucBase(BaseModel):
    tenDanhMuc: str
    mota: Optional[str] = None
    anh_url: Optional[str] = None

class DanhMucResponse(DanhMucBase):
    ID_danhmuc: int
    created_at: datetime

    class Config:
        from_attributes = True
