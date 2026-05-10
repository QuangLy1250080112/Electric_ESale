from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class SanPhamBase(BaseModel):
    tenSP: str
    mota: Optional[str] = None
    gia: float
    soluong: Optional[int] = 0
    ID_danhmuc: int
    supplier_ID: int
    ID_HinhAnh: Optional[int] = None

class SanPhamCreate(SanPhamBase):
    pass

class SanPhamUpdate(BaseModel):
    tenSP: Optional[str] = None
    mota: Optional[str] = None
    gia: Optional[float] = None
    soluong: Optional[int] = None
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

# Supplier schemas
class NhaCungCapBase(BaseModel):
    tenNhaCungCap: str
    ID_danhmuc: Optional[int] = None
    sdt: Optional[str] = None
    email: Optional[str] = None

class NhaCungCapCreate(NhaCungCapBase):
    pass

class NhaCungCapUpdate(BaseModel):
    tenNhaCungCap: Optional[str] = None
    ID_danhmuc: Optional[int] = None
    sdt: Optional[str] = None
    email: Optional[str] = None

class NhaCungCapResponse(NhaCungCapBase):
    ID_NhaCungCap: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
