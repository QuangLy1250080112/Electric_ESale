# ESale Frontend

Giao diện người dùng cho dự án ESale, xây dựng bằng React và Vite.

## Cấu trúc thư mục Frontend

```text
frontend/
├── src/
│   ├── components/         # Các thành phần giao diện nhỏ
│   │   ├── auth/           # Form đăng nhập (LoginForm.jsx)
│   │   ├── products/       # Danh sách và thẻ sản phẩm (ProductList.jsx)
│   │   └── common/         # Các component dùng chung (Header, Footer)
│   ├── pages/              # Các trang giao diện lớn
│   │   ├── Home.jsx        # Trang chủ đẹp mắt với thanh tìm kiếm nổi bật
│   │   ├── Products.jsx    # Trang sản phẩm với chức năng thêm sản phẩm (Admin)
│   │   └── Login.jsx       # Trang đăng nhập
│   ├── services/           # Xử lý kết nối API
│   │   ├── authService.js  # API đăng nhập/đăng ký
│   │   └── productService.js # API lấy và thêm sản phẩm
│   ├── store/              # Quản lý trạng thái toàn cục (Zustand)
│   │   └── authStore.js    # Lưu trữ thông tin đăng nhập và Token
│   ├── styles/             # Định dạng CSS
│   │   └── globals.css     # CSS dùng chung cho toàn dự án
│   ├── App.jsx             # File định nghĩa Routing và layout chính
│   └── main.jsx            # File render ứng dụng vào HTML
├── public/                 # Các tài nguyên tĩnh (logo, favicon)
├── package.json            # Cấu hình dự án và thư viện NPM
└── README.md               # File hướng dẫn này
```

## Các cập nhật mới
- **Trang chủ**: Giao diện Hero mới, tích hợp thanh tìm kiếm sản phẩm.
- **Trang sản phẩm**: Layout cân đối hơn, tích hợp nút "Thêm sản phẩm" dành riêng cho Admin.
- **Đăng nhập**: Chuyển sang sử dụng `Tên tài khoản` thay vì `Email`.
- **Giao diện**: Nâng cấp CSS giúp trang web trông hiện đại và chuyên nghiệp hơn.
