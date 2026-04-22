"""
Product, Category, Supplier and Inventory schemas
"""

from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


# Category (DanhMuc) Schemas
class DanhMucBase(BaseModel):
    """Base category schema"""
    tenDanhMuc: str
    mota: Optional[str] = None


class DanhMucCreate(DanhMucBase):
    """Category creation schema"""
    pass


class DanhMucResponse(DanhMucBase):
    """Category response schema"""
    ID_danhmuc: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# Supplier (NhaCungCap) Schemas
class NhaCungCapBase(BaseModel):
    """Base supplier schema"""
    tenNhaCungCap: str
    ID_danhmuc: int
    sdt: str
    email: str


class NhaCungCapCreate(NhaCungCapBase):
    """Supplier creation schema"""
    pass


class NhaCungCapResponse(NhaCungCapBase):
    """Supplier response schema"""
    ID_NhaCungCap: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# Product Image (AnhSP) Schemas
class AnhSPBase(BaseModel):
    """Base product image schema"""
    HinhAnh_url: str


class AnhSPCreate(AnhSPBase):
    """Product image creation schema"""
    ID_sanpham: Optional[int] = None


class AnhSPResponse(AnhSPBase):
    """Product image response schema"""
    ID_HinhAnh: int
    ID_sanpham: Optional[int]
    created_at: datetime
    
    class Config:
        from_attributes = True


# Product Specs (ThongsoSP) Schemas
class ThongsoSPBase(BaseModel):
    """Base product specifications schema"""
    Dienap: str
    HieuSuat: str


class ThongsoSPCreate(ThongsoSPBase):
    """Product specifications creation schema"""
    ID_sanpham: int


class ThongsoSPResponse(ThongsoSPBase):
    """Product specifications response schema"""
    ID_sp_ts: int
    ID_sanpham: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# Inventory (TonKho) Schemas
class TonKhoBase(BaseModel):
    """Base inventory schema"""
    ten: str
    ID_sanpham: int
    soluong: int


class TonKhoCreate(TonKhoBase):
    """Inventory creation schema"""
    pass


class TonKhoResponse(TonKhoBase):
    """Inventory response schema"""
    ID_tonkho: int
    ngaycapnhat: datetime
    
    class Config:
        from_attributes = True


# Product (SanPham) Schemas
class SanPhamBase(BaseModel):
    """Base product schema"""
    tenSP: str
    mota: str
    gia: float
    ID_danhmuc: int
    supplier_ID: int
    ID_HinhAnh: Optional[int] = None


class SanPhamCreate(SanPhamBase):
    """Product creation schema"""
    pass


class SanPhamUpdate(BaseModel):
    """Product update schema"""
    tenSP: Optional[str] = None
    mota: Optional[str] = None
    gia: Optional[float] = None
    ID_danhmuc: Optional[int] = None
    supplier_ID: Optional[int] = None
    ID_HinhAnh: Optional[int] = None


class SanPhamResponse(SanPhamBase):
    """Product response schema"""
    ID_sanpham: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class SanPhamDetailResponse(SanPhamResponse):
    """Product detail response with related data"""
    category: Optional[DanhMucResponse] = None
    supplier: Optional[NhaCungCapResponse] = None
    image: Optional[AnhSPResponse] = None
    specs: Optional[ThongsoSPResponse] = None
    stock: Optional[TonKhoResponse] = None


class SanPhamListResponse(BaseModel):
    """Product list response"""
    total: int
    items: List[SanPhamResponse]
