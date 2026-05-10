"""
Accounts management endpoints (TaiKhoan)
- CRUD operations for user accounts (admin only)
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.user import TaiKhoan
from app.schemas.user import TaiKhoanCreate, TaiKhoanUpdate, TaiKhoanResponse

router = APIRouter()


@router.get("", response_model=List[TaiKhoanResponse], tags=["Accounts"])
async def get_accounts(db: Session = Depends(get_db)):
    """
    Get all accounts
    """
    return db.query(TaiKhoan).all()


@router.post("", response_model=TaiKhoanResponse, tags=["Accounts"])
async def create_account(account_in: TaiKhoanCreate, db: Session = Depends(get_db)):
    """
    Create new account
    """
    existing = db.query(TaiKhoan).filter(TaiKhoan.tenTK == account_in.tenTK).first()
    if existing:
        raise HTTPException(status_code=400, detail="Tên tài khoản đã tồn tại")

    db_account = TaiKhoan(
        tenTK=account_in.tenTK,
        matkhau=account_in.matkhau,
        email=account_in.email,
        is_staff=account_in.is_staff,
        is_admin=account_in.is_admin,
    )
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account


@router.put("/{uID}", response_model=TaiKhoanResponse, tags=["Accounts"])
async def update_account(uID: int, account_in: TaiKhoanUpdate, db: Session = Depends(get_db)):
    """
    Update account
    """
    account = db.query(TaiKhoan).filter(TaiKhoan.uID == uID).first()
    if not account:
        raise HTTPException(status_code=404, detail="Không tìm thấy tài khoản")

    for field, value in account_in.dict(exclude_unset=True).items():
        setattr(account, field, value)

    db.commit()
    db.refresh(account)
    return account


@router.delete("/{uID}", tags=["Accounts"])
async def delete_account(uID: int, db: Session = Depends(get_db)):
    """
    Delete account
    """
    account = db.query(TaiKhoan).filter(TaiKhoan.uID == uID).first()
    if not account:
        raise HTTPException(status_code=404, detail="Không tìm thấy tài khoản")

    db.delete(account)
    db.commit()
    return {"message": "Đã xóa tài khoản thành công"}
