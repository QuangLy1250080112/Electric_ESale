# ESale Backend

Hệ thống API cho dự án ESale, xây dựng bằng FastAPI và SQLAlchemy.

## Cấu trúc thư mục Backend

```text
backend/
├── app/
│   ├── api/                # Cổng giao tiếp API
│   │   └── v1/
│   │       ├── endpoints/
│   │       │   ├── auth.py     # Đăng nhập/đăng ký sử dụng tenTK và matkhau
│   │       │   ├── products.py # Quản lý sản phẩm (Thêm/Xóa/Sửa)
│   │       │   └── users.py    # Quản lý người dùng
│   │       └── api.py          # Ghép các router endpoint lại
│   ├── core/               # Các thiết lập quan trọng
│   │   ├── config.py       # Biến môi trường và cấu hình
│   │   ├── security.py     # Xử lý mật khẩu (Bcrypt) và JWT Token
│   │   └── database.py     # Kết nối và quản lý phiên làm việc database
│   ├── models/             # Định nghĩa cấu trúc bảng Database (SQLAlchemy)
│   │   ├── user.py         # Table TaiKhoan, Logs
│   │   └── product.py      # Table SanPham, DanhMuc, NhaCungCap, TonKho
│   ├── schemas/            # Định nghĩa kiểu dữ liệu Input/Output (Pydantic)
│   │   ├── user.py         # Schema cho TaiKhoan
│   │   └── product.py      # Schema cho SanPham
│   ├── initial_data.py     # Script để khởi tạo tài khoản admin/guest vào DB
│   └── main.py             # File khởi chạy server FastAPI
├── migrations/             # Lịch sử thay đổi cấu trúc database (Alembic)
├── requirements.txt        # Các thư viện Python cần dùng
└── README.md               # File hướng dẫn này
```

## Các tính năng đã thực hiện
- Đăng nhập bằng `tenTK` và `matkhau`.
- Quản lý sản phẩm với phân quyền (Admin mới được thêm).
- Tìm kiếm sản phẩm theo tên.
- Khởi tạo dữ liệu mẫu tự động.
