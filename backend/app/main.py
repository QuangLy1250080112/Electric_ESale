from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine  # Sửa lại đường dẫn import database
from . import models           # Import để khởi tạo bảng
from .routers import products  # Import router sản phẩm của bạn

# Khởi tạo bảng trong Database (Chạy dòng này để tự tạo file .db hoặc bảng SQL)
models.Base.metadata.create_all(bind=engine)

# Khởi tạo instance FastAPI
app = FastAPI(
    title="ESale Backend API",
    description="Electronics E-commerce Platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Cấu hình CORS (Cho phép Frontend gọi API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Tạm thời để "*" để test, sau này đổi thành URL của React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Kết nối các Router
# Vì file main.py nằm trong thư mục app, khi include ta gọi trực tiếp
app.include_router(products.router, prefix="/api/v1")

@app.get("/", tags=["Health"])
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to ESale API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    # Chú ý: nếu bạn chạy lệnh này từ thư mục 'backend', thì path là 'app.main:app'
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )