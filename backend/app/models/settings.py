"""
Shop Settings model
Stores shop location, shipping fee, and delivery time configuration
"""

from sqlalchemy import Column, Integer, Float, String, DateTime
from sqlalchemy.sql import func
from app.core.database import Base


class ShopSettings(Base):
    """Shop Settings model"""
    __tablename__ = "shop_settings"

    id = Column(Integer, primary_key=True, index=True)
    latitude = Column(Float, default=10.8231)  # Default: Ho Chi Minh City
    longitude = Column(Float, default=106.6297)
    address = Column(String, default="")
    shipping_fee_per_km = Column(Float, default=5000)  # VND per km
    delivery_seconds_per_km = Column(Float, default=5)  # seconds per km for simulation
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
