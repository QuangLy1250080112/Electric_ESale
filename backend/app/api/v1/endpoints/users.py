from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from app.core.database import get_db
from app.core.config import settings
from app.models.user import TaiKhoan
from app.schemas.user import TaiKhoanResponse

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

async def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> TaiKhoan:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(TaiKhoan).filter(TaiKhoan.tenTK == username).first()
    if user is None:
        raise credentials_exception
    return user

@router.get("/me", response_model=TaiKhoanResponse, tags=["Users"])
async def read_current_user(current_user: TaiKhoan = Depends(get_current_user)):
    """
    Get current user profile (TaiKhoan)
    """
    return current_user

@router.put("/me", response_model=TaiKhoanResponse, tags=["Users"])
async def update_current_user(
    taikhoan_in: TaiKhoanResponse,
    current_user: TaiKhoan = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update current user profile (TaiKhoan)
    """
    for field, value in taikhoan_in.dict(exclude_unset=True).items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user
