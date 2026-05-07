"""
Application configuration settings
Loaded from environment variables
"""

from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings"""
    
    # Database
    DATABASE_URL: str = "sqlite:///./test.db"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Server
    SERVER_NAME: str = "localhost"
    SERVER_PORT: int = 8000
    DEBUG: bool = False
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    
    # API
    API_VERSION: str = "v1"
    API_V1_STR: str = "/api/v1"

    # Uploads
    # Saving to frontend/public/images ensures images are in the repo
    UPLOAD_DIR: str = "../frontend/public/images"
    
    class Config:
        """Pydantic config"""
        env_file = ".env"
        case_sensitive = True


settings = Settings()
