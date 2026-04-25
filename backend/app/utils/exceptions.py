"""
Custom exceptions
"""

from fastapi import HTTPException, status


class UserNotFoundError(HTTPException):
    """User not found exception"""
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )


class InvalidCredentialsError(HTTPException):
    """Invalid credentials exception"""
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )


class ProductNotFoundError(HTTPException):
    """Product not found exception"""
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )


class InsufficientStockError(HTTPException):
    """Insufficient stock exception"""
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient stock"
        )


class UnauthorizedError(HTTPException):
    """Unauthorized exception"""
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized"
        )


class ForbiddenError(HTTPException):
    """Forbidden exception"""
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden"
        )
