"""
Database models
Import all models here to ensure they are registered with SQLAlchemy
"""

from app.core.database import Base

# User models
from app.models.user import TaiKhoan, Logs

# Product models
from app.models.product import (
    DanhMuc, 
    SanPham, 
    NhaCungCap, 
    AnhSP, 
    ThongsoSP, 
    TonKho
)

# Order models
from app.models.order import (
    Giohang, 
    Donhang, 
    PTThanhToan, 
    Reviews
)
