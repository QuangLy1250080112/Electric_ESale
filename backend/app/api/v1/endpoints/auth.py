"""
Authentication endpoints
- User registration (TaiKhoan)
- User login
- Token refresh
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.user import TaiKhoanCreate, TaiKhoanResponse

router = APIRouter()


@router.post("/register", response_model=TaiKhoanResponse, tags=["Authentication"])
async def register(taikhoan: TaiKhoanCreate, db: Session = Depends()):
    """
    Register a new user account (TaiKhoan)
    
    Parameters:
    - email: User email
    - tenTK: Username
    - matkhau: Password
    """
    return {"message": "Register endpoint - to be implemented"}


@router.post("/login", tags=["Authentication"])
async def login(email: str, matkhau: str):
    """
    Login user and get access token
    
    Parameters:
    - email: User email
    - matkhau: Password
    """
    return {"message": "Login endpoint - to be implemented"}


@router.post("/refresh-token", tags=["Authentication"])
async def refresh_token():
    """
    Refresh access token
    """
    return {"message": "Refresh token endpoint - to be implemented"}


@router.post("/logout", tags=["Authentication"])
async def logout():
    """
    Logout user
    """
    return {"message": "Logout endpoint - to be implemented"}
