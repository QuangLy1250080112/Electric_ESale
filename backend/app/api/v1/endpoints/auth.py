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
from app.schemas.user import TaiKhoanCreate, TaiKhoanResponse, Token, LoginRequest, EmailRequest, ResetPasswordRequest, TaiKhoanRegister
from app.utils.email import send_verification_email

router = APIRouter()

@router.post("/request-register", tags=["Authentication"])
async def request_register(req: EmailRequest, db: Session = Depends(get_db)):
    """
    Request registration email verification
    """
    # Check if email exists
    if db.query(TaiKhoan).filter(TaiKhoan.email == req.email).first():
        raise HTTPException(status_code=400, detail="Email đã được sử dụng")
    
    token = create_access_token(data={"sub": req.email, "type": "register"})
    send_verification_email(req.email, token, "register")
    return {"message": "Đã gửi email xác thực"}

@router.post("/register", response_model=Token, tags=["Authentication"])
async def register(req: TaiKhoanRegister, db: Session = Depends(get_db)):
    """
    Complete registration with token
    """
    from app.core.security import verify_token
    payload = verify_token(req.token)
    if not payload or payload.get("type") != "register":
        raise HTTPException(status_code=400, detail="Token không hợp lệ hoặc đã hết hạn")
    
    email = payload.get("sub")
    if db.query(TaiKhoan).filter(TaiKhoan.tenTK == req.tenTK).first():
        raise HTTPException(status_code=400, detail="Tên tài khoản đã tồn tại")
    
    if db.query(TaiKhoan).filter(TaiKhoan.email == email).first():
        raise HTTPException(status_code=400, detail="Email đã được sử dụng")

    # Create new user
    db_user = TaiKhoan(
        tenTK=req.tenTK,
        email=email,
        matkhau=req.matkhau,
        is_staff=False,
        is_admin=False
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Auto login
    access_token = create_access_token(data={"sub": db_user.tenTK})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": db_user
    }

@router.post("/forgot-password", tags=["Authentication"])
async def forgot_password(req: EmailRequest, db: Session = Depends(get_db)):
    user = db.query(TaiKhoan).filter(TaiKhoan.email == req.email).first()
    if not user:
        # Don't reveal if user exists or not
        return {"message": "Nếu email hợp lệ, hướng dẫn khôi phục sẽ được gửi."}
    
    token = create_access_token(data={"sub": req.email, "type": "reset"})
    send_verification_email(req.email, token, "reset_password")
    return {"message": "Nếu email hợp lệ, hướng dẫn khôi phục sẽ được gửi."}

@router.post("/reset-password", tags=["Authentication"])
async def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    from app.core.security import verify_token
    payload = verify_token(req.token)
    if not payload or payload.get("type") != "reset":
        raise HTTPException(status_code=400, detail="Token không hợp lệ hoặc đã hết hạn")
    
    user = db.query(TaiKhoan).filter(TaiKhoan.email == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")
    
    user.matkhau = req.new_password
    db.commit()
    return {"message": "Đặt lại mật khẩu thành công"}



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
