"""
Users endpoints (TaiKhoan)
- Get user profile
- Update user profile
- Get user list (admin)
- Activity logs
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/me", tags=["Users"])
async def get_current_user():
    """
    Get current user profile (TaiKhoan)
    """
    return {"message": "Get current user - to be implemented"}


@router.put("/me", tags=["Users"])
async def update_current_user():
    """
    Update current user profile (TaiKhoan)
    """
    return {"message": "Update user profile - to be implemented"}


@router.get("/{uID}", tags=["Users"])
async def get_user(uID: int):
    """
    Get user by ID (TaiKhoan) - admin only
    """
    return {"message": f"Get user {uID} - to be implemented"}


@router.get("", tags=["Users"])
async def get_users():
    """
    Get all users (TaiKhoan) - admin only
    """
    return {"message": "Get all users - to be implemented"}


@router.get("/{uID}/logs", tags=["Users"])
async def get_user_logs(uID: int):
    """
    Get user activity logs - admin only
    """
    return {"message": f"Get logs for user {uID} - to be implemented"}
