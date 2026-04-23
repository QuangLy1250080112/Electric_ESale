from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .database import Base  # Đã sửa lại đường dẫn đúng cấu trúc mới

# --- USER MODELS ---
class TaiKhoan(Base):
    __tablename__ = "taikhoan"
    uID = Column(Integer, primary_key=True, index=True)
    tenTK = Column(String, unique=True, index=True)
    matkhau = Column(String)
    email = Column(String, unique=True, index=True)
    is_staff = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class Logs(Base):
    __tablename__ = "logs"
    id_log = Column(Integer, primary_key=True, index=True)
    uID = Column(Integer, ForeignKey("taikhoan.uID"))
    action = Column(String)
    create_at = Column(DateTime, server_default=func.now())

# --- PRODUCT MODELS (Nhiệm vụ của bạn) ---
class DanhMuc(Base):
    __tablename__ = "danhmuc"
    ID_danhmuc = Column(Integer, primary_key=True, index=True)
    tenDanhMuc = Column(String, unique=True, index=True)
    mota = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class NhaCungCap(Base):
    __tablename__ = "nhacungcap"
    ID_NhaCungCap = Column(Integer, primary_key=True, index=True)
    tenNhaCungCap = Column(String, index=True)
    ID_danhmuc = Column(Integer, ForeignKey("danhmuc.ID_danhmuc"))
    sdt = Column(String)
    email = Column(String)
    created_at = Column(DateTime, server_default=func.now())

class AnhSP(Base):
    __tablename__ = "anhsp"
    ID_HinhAnh = Column(Integer, primary_key=True, index=True)
    ID_sanpham = Column(Integer, ForeignKey("sanpham.ID_sanpham"), nullable=True)
    HinhAnh_url = Column(String)
    created_at = Column(DateTime, server_default=func.now())

class SanPham(Base):
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
    __tablename__ = "thongsosp" # Đã sửa lại tên bảng cho gọn
    ID_sp_ts = Column(Integer, primary_key=True, index=True)
    ID_sanpham = Column(Integer, ForeignKey("sanpham.ID_sanpham"))
    Dienap = Column(String)
    HieuSuat = Column(String)
    created_at = Column(DateTime, server_default=func.now())

class TonKho(Base):
    __tablename__ = "tonkho"
    ID_tonkho = Column(Integer, primary_key=True, index=True)
    ten = Column(String)
    ID_sanpham = Column(Integer, ForeignKey("sanpham.ID_sanpham"))
    soluong = Column(Integer, default=0)
    ngaycapnhat = Column(DateTime, server_default=func.now(), onupdate=func.now())

# --- ORDER & REVIEW MODELS ---
class Giohang(Base):
    __tablename__ = "giohang"
    ID_giohang = Column(Integer, primary_key=True, index=True)
    uID = Column(Integer, ForeignKey("taikhoan.uID"))
    ID_sanpham = Column(Integer, ForeignKey("sanpham.ID_sanpham"))
    soluong = Column(Integer, default=1)
    gia = Column(Float)
    created_at = Column(DateTime, server_default=func.now())

class Donhang(Base):
    __tablename__ = "donhang"
    ID_donhang = Column(Integer, primary_key=True, index=True)
    uID = Column(Integer, ForeignKey("taikhoan.uID"))
    trangthai = Column(String, default="pending")
    soluong = Column(Integer)
    ID_sanpham = Column(Integer, ForeignKey("sanpham.ID_sanpham"))
    gia = Column(Float)
    thoigiantao = Column(DateTime, server_default=func.now())

class PTThanhToan(Base):
    __tablename__ = "ptthanhToan"
    ID_ThanhToan = Column(Integer, primary_key=True, index=True)
    ID_giohang = Column(Integer, ForeignKey("giohang.ID_giohang"), nullable=True)
    ID_donhang = Column(Integer, ForeignKey("donhang.ID_donhang"), nullable=True)
    PhuongThucTT = Column(String)
    trangthai = Column(String, default="pending")
    tonggia = Column(Float)
    thoigiantao = Column(DateTime, server_default=func.now())

class Reviews(Base):
    __tablename__ = "reviews"
    ID_review = Column(Integer, primary_key=True, index=True)
    uID = Column(Integer, ForeignKey("taikhoan.uID"))
    ID_sanpham = Column(Integer, ForeignKey("sanpham.ID_sanpham"))
    rating = Column(Integer)
    comment = Column(Text)
    thoigiantao = Column(DateTime, server_default=func.now())