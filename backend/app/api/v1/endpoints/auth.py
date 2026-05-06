"""
Authentication endpoints
- User registration (TaiKhoan)
- User login
- Token refresh
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.user import TaiKhoan
from app.schemas.user import TaiKhoanCreate, TaiKhoanResponse, Token, LoginRequest

router = APIRouter()


@router.post("/register", response_model=TaiKhoanResponse, tags=["Authentication"])
async def register(taikhoan_in: TaiKhoanCreate, db: Session = Depends(get_db)):
    """
    Register a new user account (TaiKhoan)
    """
    # Check if user already exists
    user = db.query(TaiKhoan).filter(TaiKhoan.tenTK == taikhoan_in.tenTK).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tên tài khoản đã tồn tại"
        )
    
    # Create new user
    db_user = TaiKhoan(
        tenTK=taikhoan_in.tenTK,
        email=taikhoan_in.email,
        matkhau=taikhoan_in.matkhau,
        is_staff=taikhoan_in.is_staff,
        is_admin=taikhoan_in.is_admin
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.post("/login", response_model=Token, tags=["Authentication"])
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    Login user and get access token using tenTK and matkhau
    """
    user = db.query(TaiKhoan).filter(TaiKhoan.tenTK == login_data.tenTK).first()
    if not user or login_data.matkhau != user.matkhau:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tên tài khoản hoặc mật khẩu không chính xác",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.tenTK})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


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
    return {"message": "Logout successful"}
