"""
Order, Cart, Payment and Review models
Matches database schema:
- Giohang (Shopping Cart table)
- Donhang (Order table)
- PTThanhToan (Payment Method table)
- Reviews (Product Reviews table)
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from app.core.database import Base


class Giohang(Base):
    """Shopping Cart model (Giohang)"""
    __tablename__ = "giohang"
    
    ID_giohang = Column(Integer, primary_key=True, index=True)
    uID = Column(Integer, ForeignKey("taikhoan.uID"))
    ID_sanpham = Column(Integer, ForeignKey("sanpham.ID_sanpham"))
    soluong = Column(Integer, default=1)
    gia = Column(Float)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class Donhang(Base):
    """Order model (Donhang)"""
    __tablename__ = "donhang"
    
    ID_donhang = Column(Integer, primary_key=True, index=True)
    uID = Column(Integer, ForeignKey("taikhoan.uID"))
    trangthai = Column(String, default="pending")  # pending, confirmed, shipped, delivered, cancelled
    soluong = Column(Integer)
    ID_sanpham = Column(Integer, ForeignKey("sanpham.ID_sanpham"))
    gia = Column(Float)
    thoigiantao = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class PTThanhToan(Base):
    """Payment Method model (PTThanhToan)"""
    __tablename__ = "ptthanhToan"
    
    ID_ThanhToan = Column(Integer, primary_key=True, index=True)
    ID_giohang = Column(Integer, ForeignKey("giohang.ID_giohang"), nullable=True)
    ID_donhang = Column(Integer, ForeignKey("donhang.ID_donhang"), nullable=True)
    PhuongThucTT = Column(String)  # Payment method (e.g., Credit Card, E-wallet, Bank Transfer)
    trangthai = Column(String, default="pending")  # pending, completed, failed, cancelled
    tonggia = Column(Float)
    thoigiantao = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class Reviews(Base):
    """Product Review model (Reviews)"""
    __tablename__ = "reviews"
    
    ID_review = Column(Integer, primary_key=True, index=True)
    uID = Column(Integer, ForeignKey("taikhoan.uID"))
    ID_sanpham = Column(Integer, ForeignKey("sanpham.ID_sanpham"))
    rating = Column(Integer)  # 1-5
    comment = Column(Text)
    thoigiantao = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
