from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class TaiKhoanBase(BaseModel):
    tenTK: str
    email: Optional[EmailStr] = None
    is_staff: Optional[bool] = False
    is_admin: Optional[bool] = False

class TaiKhoanCreate(TaiKhoanBase):
    matkhau: str

class TaiKhoanUpdate(BaseModel):
    email: Optional[EmailStr] = None
    matkhau: Optional[str] = None
    is_staff: Optional[bool] = None
    is_admin: Optional[bool] = None

class TaiKhoanResponse(TaiKhoanBase):
    uID: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: TaiKhoanResponse

class LoginRequest(BaseModel):
    tenTK: str
    matkhau: str
