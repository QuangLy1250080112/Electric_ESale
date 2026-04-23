"""
Combined Schemas for ESale Project (Pydantic v2)
"""

from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

# --- COMMON CONFIG ---
# Khai báo model_config dùng chung cho các Response class
shared_model_config = {"from_attributes": True}

# --- SHOPPING CART (Giohang) SCHEMAS ---
class GiohangBase(BaseModel):
    uID: int
    ID_sanpham: int
    soluong: int
    gia: float

class GiohangCreate(GiohangBase):
    pass

class GiohangUpdate(BaseModel):
    soluong: Optional[int] = None
    gia: Optional[float] = None

class GiohangResponse(GiohangBase):
    ID_giohang: int
    created_at: datetime
    model_config = shared_model_config

# --- ORDER (Donhang) SCHEMAS ---
class DonhangBase(BaseModel):
    uID: int
    trangthai: str
    soluong: int
    ID_sanpham: int
    gia: float

class DonhangCreate(BaseModel):
    uID: int
    items: List[dict]

class DonhangUpdate(BaseModel):
    trangthai: Optional[str] = None

class DonhangResponse(DonhangBase):
    ID_donhang: int
    thoigiantao: datetime
    model_config = shared_model_config

# --- PAYMENT (PTThanhToan) SCHEMAS ---
class PTThanhToanBase(BaseModel):
    PhuongThucTT: str
    trangthai: str
    tonggia: float

class PTThanhToanCreate(BaseModel):
    ID_giohang: Optional[int] = None
    ID_donhang: Optional[int] = None
    PhuongThucTT: str
    tonggia: float

class PTThanhToanUpdate(BaseModel):
    trangthai: Optional[str] = None

class PTThanhToanResponse(PTThanhToanBase):
    ID_ThanhToan: int
    ID_giohang: Optional[int]
    ID_donhang: Optional[int]
    thoigiantao: datetime
    model_config = shared_model_config

# --- REVIEW (Reviews) SCHEMAS ---
class ReviewsBase(BaseModel):
    uID: int
    ID_sanpham: int
    rating: int
    comment: str

class ReviewsCreate(ReviewsBase):
    pass

class ReviewsUpdate(BaseModel):
    rating: Optional[int] = None
    comment: Optional[str] = None

class ReviewsResponse(ReviewsBase):
    ID_review: int
    thoigiantao: datetime
    model_config = shared_model_config

# --- CATEGORY (DanhMuc) SCHEMAS ---
class DanhMucBase(BaseModel):
    tenDanhMuc: str
    mota: Optional[str] = None

class DanhMucCreate(DanhMucBase):
    pass

class DanhMucResponse(DanhMucBase):
    ID_danhmuc: int
    created_at: datetime
    model_config = shared_model_config

# --- SUPPLIER (NhaCungCap) SCHEMAS ---
class NhaCungCapBase(BaseModel):
    tenNhaCungCap: str
    ID_danhmuc: int
    sdt: str
    email: str

class NhaCungCapCreate(NhaCungCapBase):
    pass

class NhaCungCapResponse(NhaCungCapBase):
    ID_NhaCungCap: int
    created_at: datetime
    model_config = shared_model_config

# --- PRODUCT IMAGE (AnhSP) SCHEMAS ---
class AnhSPBase(BaseModel):
    HinhAnh_url: str

class AnhSPCreate(AnhSPBase):
    ID_sanpham: Optional[int] = None

class AnhSPResponse(AnhSPBase):
    ID_HinhAnh: int
    ID_sanpham: Optional[int]
    created_at: datetime
    model_config = shared_model_config

# --- PRODUCT SPECS (ThongsoSP) SCHEMAS ---
class ThongsoSPBase(BaseModel):
    Dienap: str
    HieuSuat: str

class ThongsoSPCreate(ThongsoSPBase):
    ID_sanpham: int

class ThongsoSPResponse(ThongsoSPBase):
    ID_sp_ts: int
    ID_sanpham: int
    created_at: datetime
    model_config = shared_model_config

# --- INVENTORY (TonKho) SCHEMAS ---
class TonKhoBase(BaseModel):
    ten: str
    ID_sanpham: int
    soluong: int

class TonKhoCreate(TonKhoBase):
    pass

class TonKhoResponse(TonKhoBase):
    ID_tonkho: int
    ngaycapnhat: datetime
    model_config = shared_model_config

# --- PRODUCT (SanPham) SCHEMAS ---
class SanPhamBase(BaseModel):
    tenSP: str
    mota: str
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
    created_at: datetime
    model_config = shared_model_config

# --- USER/ACCOUNT SCHEMAS ---
class TaiKhoanBase(BaseModel):
    email: EmailStr
    tenTK: str

class TaiKhoanCreate(TaiKhoanBase):
    matkhau: str

class TaiKhoanUpdate(BaseModel):
    email: Optional[EmailStr] = None
    tenTK: Optional[str] = None

class TaiKhoanResponse(TaiKhoanBase):
    uID: int
    is_staff: bool
    is_admin: bool
    created_at: datetime
    model_config = shared_model_config

class LogsResponse(BaseModel):
    id_log: int
    uID: int
    action: str
    create_at: datetime
    model_config = shared_model_config

# --- COMBINED RESPONSES ---
class GiohangDetailResponse(BaseModel):
    ID_giohang: int
    uID: int
    items: List[GiohangResponse]
    total_price: float
    model_config = shared_model_config

class SanPhamDetailResponse(SanPhamResponse):
    category: Optional[DanhMucResponse] = None
    supplier: Optional[NhaCungCapResponse] = None
    image: Optional[AnhSPResponse] = None
    specs: Optional[ThongsoSPResponse] = None
    stock: Optional[TonKhoResponse] = None
    model_config = shared_model_config