# ESale - Electronics E-commerce Platform

Dự án website thương mại điện tử chuyên về đồ điện tử, sử dụng FastAPI (Backend) và React (Frontend).

## Cấu trúc Project

```text
ESale/
├── backend/                # Thư mục chứa mã nguồn Backend (FastAPI)
│   ├── app/                # Mã nguồn ứng dụng chính
│   │   ├── api/            # Các route API
│   │   │   └── v1/         # Phiên bản 1 của API
│   │   │       ├── endpoints/ # Các logic xử lý endpoint (auth, products, etc.)
│   │   │       └── api.py  # Router tổng hợp
│   │   ├── core/           # Cấu hình hệ thống (database, security, config)
│   │   ├── models/         # Các model SQLAlchemy (Database models)
│   │   ├── schemas/        # Các model Pydantic (Request/Response schemas)
│   │   ├── services/       # Business logic phức tạp (nếu có)
│   │   ├── utils/          # Các hàm tiện ích bổ trợ
│   │   ├── initial_data.py # Script khởi tạo dữ liệu mẫu (admin, guest)
│   │   └── main.py         # Điểm khởi đầu của ứng dụng Backend
│   ├── migrations/         # Thư mục quản lý database migrations (Alembic)
│   ├── requirements.txt    # Danh sách thư viện Python cần thiết
│   └── README.md           # Hướng dẫn chi tiết cho Backend
├── frontend/               # Thư mục chứa mã nguồn Frontend (React + Vite)
│   ├── src/                # Mã nguồn ứng dụng React
│   │   ├── components/     # Các UI components tái sử dụng (Header, Footer, Auth, Product)
│   │   ├── pages/          # Các trang chính của website (Home, Products, Login, etc.)
│   │   ├── services/       # Các hàm gọi API (api.js, authService, productService)
│   │   ├── store/          # Quản lý trạng thái ứng dụng (Zustand)
│   │   ├── styles/         # CSS và các định dạng giao diện
│   │   ├── App.jsx         # Component gốc của ứng dụng
│   │   └── main.jsx        # Điểm khởi đầu của ứng dụng React
│   ├── package.json        # Danh sách thư viện và script Frontend
│   └── README.md           # Hướng dẫn chi tiết cho Frontend
└── README.md               # File này (Tổng quan dự án)
```

## Tài khoản truy cập

Dự án đã được khởi tạo với 2 tài khoản mẫu:
- **Admin**: `tenTK: admin`, `matkhau: 123` (Có quyền thêm sản phẩm)
- **Guest**: `tenTK: guest`, `matkhau: 123` (Quyền người dùng cơ bản)

## Hướng dẫn chạy nhanh

### Backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. `python app/initial_data.py` (Để tạo tài khoản mẫu)
4. `python app/main.py`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`