"""
User/Account schemas (Pydantic models for validation)
Corresponds to TaiKhoan model
"""

from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class TaiKhoanBase(BaseModel):
    """Base account schema"""
    email: EmailStr
    tenTK: str


class TaiKhoanCreate(TaiKhoanBase):
    """Account creation schema"""
    matkhau: str  # Password


class TaiKhoanUpdate(BaseModel):
    """Account update schema"""
    email: Optional[EmailStr] = None
    tenTK: Optional[str] = None


class TaiKhoanResponse(TaiKhoanBase):
    """Account response schema"""
    uID: int
    is_staff: bool
    is_admin: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class LogsResponse(BaseModel):
    """Activity logs response schema"""
    id_log: int
    uID: int
    action: str
    create_at: datetime
    
    class Config:
        from_attributes = True
