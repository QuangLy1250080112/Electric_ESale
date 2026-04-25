from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base
import datetime

# --- NHÓM 1: NGƯỜI DÙNG & HỆ THỐNG ---

class TaiKhoan(Base):
    __tablename__ = "taikhoan"
    uID = Column(Integer, primary_key=True, index=True)
    tenTK = Column(String(50), unique=True, nullable=False)
    matkhau = Column(String(255), nullable=False)
    email = Column(String(100), unique=True)
    is_staff = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    
    logs = relationship("Logs", back_populates="user")
    donhangs = relationship("DonHang", back_populates="user")

class Logs(Base):
    __tablename__ = "logs"
    id_log = Column(Integer, primary_key=True, index=True)
    uID = Column(Integer, ForeignKey("taikhoan.uID"))
    action = Column(String(255))
    create_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("TaiKhoan", back_populates="logs")

# --- NHÓM 2: SẢN PHẨM & KHO HÀNG ---

class DanhMuc(Base):
    __tablename__ = "danhmuc"
    ID_danhmuc = Column(Integer, primary_key=True, index=True)
    tenDanhMuc = Column(String(100), nullable=False)
    mota = Column(Text)

class NhaCungCap(Base):
    __tablename__ = "nhacungcap"
    ID_NhaCungCap = Column(Integer, primary_key=True, index=True)
    tenNhaCungCap = Column(String(200), nullable=False)
    ID_danhmuc = Column(Integer, ForeignKey("danhmuc.ID_danhmuc"))
    sdt = Column(String(20))
    email = Column(String(100))

class SanPham(Base):
    __tablename__ = "sanpham"
    ID_sanpham = Column(Integer, primary_key=True, index=True)
    tenSP = Column(String(200), nullable=False)
    mota = Column(Text)
    gia = Column(Float, nullable=False)
    ID_danhmuc = Column(Integer, ForeignKey("danhmuc.ID_danhmuc"))
    supplier_ID = Column(Integer, ForeignKey("nhacungcap.ID_NhaCungCap"))
    
    # Quan hệ
    danhmuc = relationship("DanhMuc")
    tonkho = relationship("TonKho", back_populates="product", uselist=False)
    thongso = relationship("ThongsoSP", back_populates="product", uselist=False)
    hinhanh = relationship("AnhSP", back_populates="product")

class TonKho(Base):
    __tablename__ = "tonkho"
    ID_tonkho = Column(Integer, primary_key=True, index=True)
    ten = Column(String(100))
    ID_sanpham = Column(Integer, ForeignKey("sanpham.ID_sanpham"))
    soluong = Column(Integer, default=0)
    ngaycapnhat = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    product = relationship("SanPham", back_populates="tonkho")

class ThongsoSP(Base):
    __tablename__ = "thongsosp"
    ID_sp_ts = Column(Integer, primary_key=True, index=True)
    ID_sanpham = Column(Integer, ForeignKey("sanpham.ID_sanpham"))
    Dienap = Column(String(50))
    HieuSuat = Column(String(50))
    
    product = relationship("SanPham", back_populates="thongso")

class AnhSP(Base):
    __tablename__ = "anhsp"
    ID_HinhAnh = Column(Integer, primary_key=True, index=True)
    ID_sanpham = Column(Integer, ForeignKey("sanpham.ID_sanpham"))
    HinhAnh_url = Column(String(500))
    
    product = relationship("SanPham", back_populates="hinhanh")

# --- NHÓM 3: BÁN HÀNG & THANH TOÁN ---

class GioHang(Base):
    __tablename__ = "giohang"
    ID_giohang = Column(Integer, primary_key=True, index=True)
    uID = Column(Integer, ForeignKey("taikhoan.uID"))
    ID_sanpham = Column(Integer, ForeignKey("sanpham.ID_sanpham"))
    soluong = Column(Integer, default=1)
    gia = Column(Float)

class DonHang(Base):
    __tablename__ = "donhang"
    ID_donhang = Column(Integer, primary_key=True, index=True)
    uID = Column(Integer, ForeignKey("taikhoan.uID"))
    trangthai = Column(String(50), default="Chờ xử lý")
    soluong = Column(Integer)
    thoigiantao = Column(DateTime, default=datetime.datetime.utcnow)
    ID_sanpham = Column(Integer, ForeignKey("sanpham.ID_sanpham"))
    gia = Column(Float)
    
    user = relationship("TaiKhoan", back_populates="donhangs")

class PTThanhToan(Base):
    __tablename__ = "ptthanhtoan"
    ID_ThanhToan = Column(Integer, primary_key=True, index=True)
    ID_giohang = Column(Integer, ForeignKey("giohang.ID_giohang"))
    ID_donhang = Column(Integer, ForeignKey("donhang.ID_donhang"))
    PhuongThucTT = Column(String(100))
    trangthai = Column(String(50))
    tonggia = Column(Float)
    thoigiantao = Column(DateTime, default=datetime.datetime.utcnow)

class Reviews(Base):
    __tablename__ = "reviews"
    ID_review = Column(Integer, primary_key=True, index=True)
    uID = Column(Integer, ForeignKey("taikhoan.uID"))
    ID_sanpham = Column(Integer, ForeignKey("sanpham.ID_sanpham"))
    rating = Column(Integer)
    comment = Column(Text)
    thoigiantao = Column(DateTime, default=datetime.datetime.utcnow)