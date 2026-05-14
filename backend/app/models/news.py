from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class TinTuc(Base):
    __tablename__ = "tintuc"
    
    id = Column(Integer, primary_key=True, index=True)
    anh_dai_dien = Column(String)
    tieu_de = Column(String)
    mo_ta_ngan = Column(String)
    noi_dung = Column(Text)
    nguoi_viet_id = Column(Integer, ForeignKey("taikhoan.uID"))
    ngay_dang = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # relationship
    nguoi_viet = relationship("TaiKhoan")
    binh_luan = relationship("BinhLuanTinTuc", back_populates="tin_tuc", cascade="all, delete-orphan")


class BinhLuanTinTuc(Base):
    __tablename__ = "binhluan_tintuc"
    
    id = Column(Integer, primary_key=True, index=True)
    tin_tuc_id = Column(Integer, ForeignKey("tintuc.id", ondelete="CASCADE"))
    nguoi_dung_id = Column(Integer, ForeignKey("taikhoan.uID"))
    noi_dung = Column(Text)
    ngay_binh_luan = Column(DateTime, server_default=func.now())

    # relationships
    tin_tuc = relationship("TinTuc", back_populates="binh_luan")
    nguoi_dung = relationship("TaiKhoan")
