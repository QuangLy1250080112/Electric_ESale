"""
Shop Settings endpoints
- GET /shop — Get shop location and config
- PUT /shop — Update shop settings (admin only)
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.settings import ShopSettings
from app.models.user import TaiKhoan
from app.schemas.settings import ShopSettingsResponse, ShopSettingsUpdate

router = APIRouter()


def get_or_create_settings(db: Session) -> ShopSettings:
    """Get existing settings or create default"""
    settings = db.query(ShopSettings).first()
    if not settings:
        settings = ShopSettings(
            latitude=10.8231,
            longitude=106.6297,
            address="Hồ Chí Minh, Việt Nam",
            shipping_fee_per_km=5000,
            delivery_seconds_per_km=5,
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


@router.get("/shop", tags=["Settings"])
async def get_shop_settings(db: Session = Depends(get_db)):
    """Get shop location and configuration (public)"""
    settings = get_or_create_settings(db)
    return {
        "id": settings.id,
        "latitude": settings.latitude,
        "longitude": settings.longitude,
        "address": settings.address,
        "shipping_fee_per_km": settings.shipping_fee_per_km,
        "delivery_seconds_per_km": settings.delivery_seconds_per_km,
    }


@router.put("/shop", tags=["Settings"])
async def update_shop_settings(
    data: ShopSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(get_current_user),
):
    """Update shop settings (admin only)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Không có quyền truy cập")

    settings = get_or_create_settings(db)

    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(settings, key, value)

    db.commit()
    db.refresh(settings)

    return {
        "id": settings.id,
        "latitude": settings.latitude,
        "longitude": settings.longitude,
        "address": settings.address,
        "shipping_fee_per_km": settings.shipping_fee_per_km,
        "delivery_seconds_per_km": settings.delivery_seconds_per_km,
        "message": "Cập nhật thành công",
    }
