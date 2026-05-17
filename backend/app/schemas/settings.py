from pydantic import BaseModel
from typing import Optional


class ShopSettingsResponse(BaseModel):
    id: int
    latitude: float
    longitude: float
    address: str
    shipping_fee_per_km: float
    delivery_seconds_per_km: float

    class Config:
        from_attributes = True


class ShopSettingsUpdate(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    shipping_fee_per_km: Optional[float] = None
    delivery_seconds_per_km: Optional[float] = None
