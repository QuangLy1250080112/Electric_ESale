# ESale - Electronics E-commerce Platform

Dự án website thương mại điện tử chuyên nghiệp chuyên về đồ điện tử, sử dụng **FastAPI** (Backend) và **React** (Frontend). Hệ thống được tích hợp đầy đủ các tính năng từ quản lý sản phẩm, giỏ hàng, đặt hàng, thanh toán, hệ thống tin tức đến các tính năng cao cấp như bản đồ vận chuyển thời gian thực, đánh giá sản phẩm có kèm ảnh, phân tích doanh thu bằng biểu đồ trực quan và xuất Excel cho Admin.

---

## Các Tính Năng Đã Thực Hiện

### 1. Phân Hệ Người Dùng (Customer)

- **Xác thực & Bảo mật**: Đăng nhập, đăng ký tài khoản mới qua hệ thống xác thực email gửi mã JWT (sử dụng Mailtrap). Có tính năng quên mật khẩu và đặt lại mật khẩu bảo mật.
- **Khám phá sản phẩm**: Tìm kiếm, lọc sản phẩm thông minh theo Tên, Danh mục, Khoảng giá (Dual-slider) và Nhà cung cấp với cơ chế phân trang tối ưu.
- **Giỏ hàng & Đơn hàng**: Quản lý giỏ hàng theo từng user (lưu trực tiếp ở database backend). Tự động cộng/trừ số lượng tồn kho theo thời gian thực khi thêm/bớt hàng.
- **Bản đồ & Vận chuyển (Leaflet Map)**: Tự động định vị vị trí người dùng để tính khoảng cách và phí vận chuyển dựa trên vị trí của Shop. Trang thái đơn hàng hiển thị trực quan qua trình mô phỏng giao hàng chuyển động trên bản đồ Leaflet.
- **Đánh giá sản phẩm (Reviews)**: Viết đánh giá sản phẩm đã mua kèm thang điểm star rating và upload tối đa nhiều hình ảnh (lưu trữ và hiển thị lightbox).

### 2. Phân Hệ Admin / Nhân Viên (Staff)

- **Dashboard Tổng quan**: Quản lý sản phẩm, tài khoản người dùng và nhà cung cấp thông qua giao diện trực quan phân tab.
- **Nhập sản phẩm từ Excel**: Hỗ trợ import dữ liệu sản phẩm số lượng lớn từ file Excel với cơ chế kiểm tra lỗi dữ liệu (danh mục, nhà cung cấp) và cho phép sửa trực tiếp trong bảng hiển thị lỗi.
- **Phân tích Doanh thu & Báo cáo**:
  - Biểu đồ kết hợp cột và đường (Mixed Chart) biểu diễn xu hướng doanh thu theo thời gian.
  - Biểu đồ tròn (Pie Chart) hiển thị tỷ trọng doanh thu theo từng danh mục.
  - Hỗ trợ xuất dữ liệu doanh thu chi tiết ra file Excel theo khoảng thời gian tùy chỉnh.

### 3. Phân Hệ Tin Tức (News)

- Tích hợp trang tin tức công nghệ hỗ trợ soạn thảo bằng trình biên tập Rich Text Editor (CKEditor 5), tải ảnh đại diện, viết bình luận bài viết và quản lý bình luận bài viết của người dùng.

---

## Cấu Trúc Toàn Bộ Project

```text
ESale/
├── backend/                # THƯ MỤC BACKEND (FastAPI)
│   ├── app/                # Mã nguồn ứng dụng chính
│   │   ├── api/            # Router và endpoints xử lý API v1
│   │   ├── core/           # Cấu hình chính (database, security, config)
│   │   ├── models/         # Khai báo cấu trúc bảng cơ sở dữ liệu SQLAlchemy
│   │   ├── schemas/        # Định nghĩa kiểu dữ liệu truyền nhận Pydantic
│   │   ├── services/       # Xử lý business logic phụ trợ
│   │   ├── utils/          # Các hàm tiện ích
│   │   ├── initial_data.py # Script khởi tạo tài khoản hệ thống (admin, guest)
│   │   └── main.py         # File chạy chính của server FastAPI (Tự động khởi tạo bảng)
│   ├── migrations/         # Thư mục quản lý phiên bản database (Alembic)
│   ├── requirements.txt    # Danh sách thư viện Python của backend
│   └── test.db             # Cơ sở dữ liệu SQLite (chứa sẵn đầy đủ dữ liệu mẫu)
├── frontend/               # THƯ MỤC FRONTEND (React + Vite)
│   ├── src/                # Mã nguồn ứng dụng chính
│   │   ├── components/     # Các UI Components tái sử dụng (Header, Footer, Excel Modal,...)
│   │   ├── pages/          # Các trang chính (Home, Categories, Checkout, News, Admin,...)
│   │   ├── services/       # Các module gọi API qua Axios
│   │   ├── store/          # Quản lý state tập trung với Zustand (authStore, cartStore)
│   │   └── styles/         # Cấu hình phong cách CSS
│   ├── public/             # Tài nguyên tĩnh (hình ảnh sản phẩm, bài viết, reviews,...)
│   └── package.json        # Định nghĩa các thư viện Node.js và NPM Scripts
├── context.md              # File lưu ngữ cảnh hoạt động của dự án
├── package.json            # NPM Scripts chạy nhanh đồng thời Frontend & Backend tại thư mục gốc
└── README.md               # File này (Hướng dẫn tổng quan duy nhất)
```

---

## Tài Khoản Đăng Nhập Hệ Thống

Dự án đã được nạp sẵn dữ liệu mẫu với các tài khoản sau:

1. **Tài khoản Admin**: `Tên tài khoản: admin` | `Mật khẩu: 123` (Có toàn quyền quản trị, thêm/sửa/xóa sản phẩm, xem biểu đồ, xuất Excel).
2. **Tài khoản Khách hàng**: `Tên tài khoản: guest` | `Mật khẩu: 123` (Người mua hàng, đặt đơn hàng, review sản phẩm).

---

## Hướng Dẫn Cài Đặt & Khởi Động Nhanh

Hệ thống đã được tích hợp cơ chế **chạy bằng SQLite tự động** có sẵn dữ liệu đầy đủ. Bạn không cần phải cài đặt PostgreSQL hay PGAdmin để kiểm tra/chạy thử dự án.

### Các bước khởi chạy dự án:

1. **Mở Terminal tại thư mục Gốc của dự án** (`ESale/`).
2. **Cài đặt thư viện cho Backend**:
   ```bash
   cd backend
   pip install -r requirements.txt
   cd ..
   ```
3. **Cài đặt thư viện cho thư mục tổng**:
   ```bash
   npm install
   ```
4. **Cài đặt thư viện cho Frontend**:
   ```bash
   cd frontend
   npm install
   cd..
   ```
5. **Khởi chạy đồng thời cả Frontend và Backend**:
   ```bash
   npm run dev:all
   ```
6. **Khởi chạy chỉ Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
7. **Khởi chạy chỉ Backend**:
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```
   _Sau khi chạy lệnh trên:_

- **Frontend React** chạy tại: [http://localhost:5173](http://localhost:5173)
- **Backend API (Swagger Docs)** chạy tại: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Cấu Hình Nâng Cao Cho Lập Trình Viên (Local PostgreSQL)

Nếu muốn cấu hình chạy dự án này trên môi trường phát triển local kết nối với cơ sở dữ liệu PostgreSQL (hoặc pgadmin4) riêng:

1. Tạo một file `.env` nằm trong thư mục `backend/` (`backend/.env`).
2. Điền thông tin kết nối PostgreSQL của bạn vào biến `DATABASE_URL`:
   ```env
   DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<database_name>
   ```
3. Khi khởi chạy backend, hệ thống sẽ ưu tiên đọc file `.env` này để kết nối tới PostgreSQL trên máy bạn.
   _(File `backend/.env` này đã được liệt kê trong `.gitignore` để không đè lên cấu hình cơ sở dữ liệu SQLite mặc định của giáo viên khi đẩy lên GitHub)._
