"""
User and Account models
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base


class TaiKhoan(Base):
    """Account model (TaiKhoan)"""
    __tablename__ = "taikhoan"
    
    uID = Column(Integer, primary_key=True, index=True)
    tenTK = Column(String, unique=True, index=True)  # Username
    matkhau = Column(String)  # Password
    email = Column(String, unique=True, index=True)
    is_staff = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class Logs(Base):
    """Activity logs model (Logs)"""
    __tablename__ = "logs"
    
    id_log = Column(Integer, primary_key=True, index=True)
    uID = Column(Integer, ForeignKey("taikhoan.uID"))
    action = Column(String)
    create_at = Column(DateTime, server_default=func.now())
