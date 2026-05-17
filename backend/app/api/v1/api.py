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
    suppliers,
    accounts,
    cart,
    orders,
    news,
    settings,
)

api_router = APIRouter()

# Include routers
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(products.router, prefix="/products", tags=["Products"])
api_router.include_router(categories.router, prefix="/categories", tags=["Categories"])
api_router.include_router(suppliers.router, prefix="/suppliers", tags=["Suppliers"])
api_router.include_router(accounts.router, prefix="/accounts", tags=["Accounts"])
api_router.include_router(cart.router, prefix="/cart", tags=["Shopping Cart"])
api_router.include_router(orders.router, prefix="/orders", tags=["Orders"])
api_router.include_router(news.router, prefix="/news", tags=["News"])
api_router.include_router(settings.router, prefix="/settings", tags=["Settings"])
