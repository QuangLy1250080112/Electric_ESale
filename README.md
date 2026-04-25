ESale - Hệ Thống Bán Linh Kiện Điện Tử
Dự án xây dựng website bán linh kiện điện tử với kiến trúc tách biệt Backend (FastAPI) và Frontend (React).

Kiến trúc hệ thống:
Backend: FastAPI (Python 3.9+)
Frontend: React.js (Vite)
Database: PostgreSQL (pgAdmin 4)
ORM & Migration: SQLAlchemy & Alembic
API Client: Axios

## Cấu trúc dự án
```
ESale/
├── backend/
│   ├── app/
│   ├── tests/
│   ├── migrations/
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
│
└── frontend/
    ├── src/
    ├── public/
    ├── package.json
    ├── vite.config.js
    ├── .env.example
    └── README.md
```

Hướng dẫn thiết lập:
# 1. Chuẩn bị (Prerequisites)
Đã cài đặt Python (3.9 trở lên).
Đã cài đặt Node.js (LTS version).
Đã tạo Database tên ESale trong pgAdmin 4.

# 2. Thiết lập Backend
Mở terminal tại thư mục gốc của dự án:

## 2.1. Tạo môi trường ảo
python -m venv venv
## 2.2 Kích hoạt môi trường ảo
Windows:
.\venv\Scripts\activate
Mac/Linux:
source venv/bin/activate
## 2.3. Di chuyển vào backend và cài đặt thư viện
cd backend
pip install fastapi uvicorn sqlalchemy psycopg2 python-dotenv alembic
Cấu hình biến môi trường Backend:
Tạo file .env bên trong thư mục backend/ và copy nội dung sau (thay đổi thông tin theo máy):
DATABASE_URL=postgresql://postgres:123@localhost:5432/ESale

# 3. Đồng bộ Database (Migration)
Để tạo toàn bộ các bảng vào PostgreSQL dựa trên models.py, chạy lệnh sau (vẫn đang ở thư mục backend và venv đang bật):
alembic revision --autogenerate -m "Mô tả thay đổi"
alembic upgrade head

# 4. Thiết lập Frontend
Mở một terminal mới (không cần bật venv) tại thư mục gốc dự án:
cd frontend
npm install
Cấu hình biến môi trường Frontend:
Tạo file .env bên trong thư mục frontend/ và copy nội dung:
VITE_API_URL=http://localhost:8000


# Cách vận hành dự án
Để dự án chạy được, cần khởi động đồng thời cả 2 server:

## Khởi động Backend:
Mở terminal tại backend/.
Kích hoạt venv.
Chạy lệnh:

uvicorn app.main:app --reload
API Documentation (Swagger UI): http://localhost:8000/docs

## Khởi động Frontend
Mở terminal tại frontend/.
Chạy lệnh:
npm run dev
Giao diện người dùng: http://localhost:5173

# 5. Quy trình làm việc nhóm (Workflow)
Khi có thay đổi về Cấu trúc Database:
Người sửa: Cập nhật backend/app/models.py.
Người sửa: Chạy lệnh tạo file migration:
alembic revision --autogenerate -m "Mô tả thay đổi bảng"
Người sửa: Commit và Push file mới trong migrations/versions/ lên GitHub.
Cả nhóm: Pull code về và chạy lệnh để cập nhật DB cá nhân:
alembic upgrade head
Lưu ý quan trọng:
KHÔNG push thư mục venv/, node_modules/ và các file .env lên GitHub.

Mọi thông tin nhạy cảm phải được giữ trong file .env cá nhân.