"""
Product, Category, Supplier and Inventory models
Matches database schema:
- DanhMuc (Category table)
- SanPham (Product table)
- NhaCungCap (Supplier table)
- AnhSP (Product Image table)
- ThongsoSP (Product Specifications table)
- TonKho (Inventory/Stock table)
"""

from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base


class DanhMuc(Base):
    """Category model (DanhMuc)"""
    __tablename__ = "danhmuc"
    
    ID_danhmuc = Column(Integer, primary_key=True, index=True)
    tenDanhMuc = Column(String, unique=True, index=True)
    mota = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class NhaCungCap(Base):
    """Supplier model (NhaCungCap)"""
    __tablename__ = "nhacungcap"
    
    ID_NhaCungCap = Column(Integer, primary_key=True, index=True)
    tenNhaCungCap = Column(String, index=True)
    ID_danhmuc = Column(Integer, ForeignKey("danhmuc.ID_danhmuc"))
    sdt = Column(String)
    email = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class AnhSP(Base):
    """Product Image model (AnhSP)"""
    __tablename__ = "anhsp"
    
    ID_HinhAnh = Column(Integer, primary_key=True, index=True)
    ID_sanpham = Column(Integer, ForeignKey("sanpham.ID_sanpham"), nullable=True)
    HinhAnh_url = Column(String)
    created_at = Column(DateTime, server_default=func.now())


class SanPham(Base):
    """Product model (SanPham)"""
    __tablename__ = "sanpham"
    
    ID_sanpham = Column(Integer, primary_key=True, index=True)
    tenSP = Column(String, unique=True, index=True)
    mota = Column(Text)
    gia = Column(Float)
    ID_danhmuc = Column(Integer, ForeignKey("danhmuc.ID_danhmuc"))
    supplier_ID = Column(Integer, ForeignKey("nhacungcap.ID_NhaCungCap"))
    ID_HinhAnh = Column(Integer, ForeignKey("anhsp.ID_HinhAnh"), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class ThongsoSP(Base):
    """Product Specifications model (ThongsoSP)"""
    __tablename__ = "thongsospthongso"
    
    ID_sp_ts = Column(Integer, primary_key=True, index=True)
    ID_sanpham = Column(Integer, ForeignKey("sanpham.ID_sanpham"))
    Dienap = Column(String)  # Power rating
    HieuSuat = Column(String)  # Efficiency
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class TonKho(Base):
    """Inventory/Stock model (TonKho)"""
    __tablename__ = "tonkho"
    
    ID_tonkho = Column(Integer, primary_key=True, index=True)
    ten = Column(String)
    ID_sanpham = Column(Integer, ForeignKey("sanpham.ID_sanpham"))
    soluong = Column(Integer, default=0)
    ngaycapnhat = Column(DateTime, server_default=func.now(), onupdate=func.now())
