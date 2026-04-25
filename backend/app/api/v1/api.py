"""
API router configuration
Includes all endpoint routes
"""

from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    users,
    products,
    categories,
    cart,
    orders,
)

api_router = APIRouter()

# Include routers
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(products.router, prefix="/products", tags=["Products"])
api_router.include_router(categories.router, prefix="/categories", tags=["Categories"])
api_router.include_router(cart.router, prefix="/cart", tags=["Shopping Cart"])
api_router.include_router(orders.router, prefix="/orders", tags=["Orders"])
