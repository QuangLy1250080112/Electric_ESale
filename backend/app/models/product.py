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
from sqlalchemy.orm import relationship
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
    ID_sanpham = Column(Integer, ForeignKey("sanpham.ID_sanpham", ondelete="CASCADE"), nullable=True)
    HinhAnh_url = Column(String)
    created_at = Column(DateTime, server_default=func.now())

    product = relationship("SanPham", back_populates="images", foreign_keys=[ID_sanpham])


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

    # Relationships
    danhmuc = relationship("DanhMuc")
    supplier = relationship("NhaCungCap")
    images = relationship("AnhSP", back_populates="product", cascade="all, delete-orphan", foreign_keys="[AnhSP.ID_sanpham]")
    
    @property
    def HinhAnh_url(self):
        if self.ID_HinhAnh:
            # This is a bit inefficient without a direct relationship, but let's try to find it in images
            for img in self.images:
                if img.ID_HinhAnh == self.ID_HinhAnh:
                    return img.HinhAnh_url
        if self.images:
            return self.images[0].HinhAnh_url
        return None


class ThongsoSP(Base):
    """Product Specifications model (ThongsoSP)"""
    __tablename__ = "thongsospthongso"
    
    ID_sp_ts = Column(Integer, primary_key=True, index=True)
    ID_sanpham = Column(Integer, ForeignKey("sanpham.ID_sanpham", ondelete="CASCADE"))
    Dienap = Column(String)  # Power rating
    HieuSuat = Column(String)  # Efficiency
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class TonKho(Base):
    """Inventory/Stock model (TonKho)"""
    __tablename__ = "tonkho"
    
    ID_tonkho = Column(Integer, primary_key=True, index=True)
    ten = Column(String)
    ID_sanpham = Column(Integer, ForeignKey("sanpham.ID_sanpham", ondelete="CASCADE"))
    soluong = Column(Integer, default=0)
    ngaycapnhat = Column(DateTime, server_default=func.now(), onupdate=func.now())
