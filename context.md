# ESale Project Context

## Current Status

- Backend is running at `http://localhost:8000`
- Frontend is running at `http://localhost:5173`
- Authentication is working with `admin` / `123`

## Recent Changes

- [x] Fix API prefix mismatch between frontend and backend
- [x] Clean up and optimize initial_data.py script
- [x] Implemented Product Image management with `AnhSP` table and associated relationships
- [x] Fixed Product creation by seeding default Supplier and Category records
- [x] Added cascade delete for Products and fixed circular FK reference (ID_HinhAnh) during deletion
- [x] Implemented automatic image file deletion from filesystem when a product is deleted
- [x] Merged Products page into Home page — removed standalone Products page
- [x] Enhanced Home page with: Hero section, About section, Why Choose Us, Owner Introduction
- [x] Created Categories page with category boxes and CategoryProducts page
- [x] **Added `soluong` (quantity) column to `sanpham` table to track stock.**
- [x] **Redesigned Admin Dashboard (`Admin.jsx`) to include 4 functional tabs:**
  - **Thêm sản phẩm**: Added `soluong` field and Autocomplete/Search dropdown for Supplier (`Nhà cung cấp`).
  - **Quản lý sản phẩm**: Display products in a table format with Search/Filter. Click row to view details, click Edit to update info (name, price, quantity) via Modal, or Delete.
  - **Quản lý nhà cung cấp**: Replaced old "Danh mục" tab. Allows viewing and adding suppliers to the `nhacungcap` table.
  - **Quản lý tài khoản**: Replaced old "Người dùng" tab. Allows viewing, creating (with Admin role toggle), and deleting user accounts in the `taikhoan` table.
- [x] **Added new Backend CRUD endpoints:** `/suppliers`, `/accounts` for admin management.
- [x] **Updated API routes and Product schemas** to support partial updates (`SanPhamUpdate` with `exclude_unset=True`).
- [x] **Advanced Cart Logic & Product Editing:**
  - Refactored `components/products/` out to `pages/products/`.
  - Added Advanced filters to Admin -> Manage Products (filter by Name, Supplier, Price range, Date range).
  - Admin product editing now happens inline in `ProductDetails.jsx` (name, price, stock, description, multi-image upload/delete).
  - Added remaining stock display to ProductDetails.
  - Cart modifications (Add/Remove) now trigger real-time stock deduction/refund API calls to keep database `soluong` accurate.
  - Redesigned `Cart.jsx` as a detailed table view.
  - Added `email` to Supplier and Account admin forms, added role select (User, Staff, Admin) to Account creation.
  - Added "Thêm danh mục" form to Categories page.
  - Implemented advanced Product Search and Filtering (by Name, Category, dual-slider Price, and autocomplete Supplier) directly in `Categories.jsx` and `CategoryProducts.jsx`.
  - Added infinite-style Pagination for products in category pages (30 products per page).
- [x] **Product Reviews System (Full Implementation):**
  - **Database**: `reviews` table with columns: `ID_review`, `uID`, `ID_sanpham`, `rating`, `comment`, `image_url` (comma-separated for multiple images), `thoigiantao`, `updated_at`.
  - **Backend**: Review CRUD endpoints under `/orders/reviews/*`, including:
    - `GET /reviews/{ID_sanpham}` — public, list product reviews
    - `GET /reviews/can-review/{ID_sanpham}` — auth, check review eligibility
    - `POST /reviews` — auth, create review with multi-image upload
    - `DELETE /reviews/{ID_review}` — auth, owner/admin delete
  - **OrderHistory page**: Shows purchased products with "Đánh giá của bạn" column. Displays star rating if reviewed, or "Bạn chưa đánh giá" link navigating to `/products/{id}#reviews`.
  - **ProductDetails page**: Displays reviews section below product box (date above username, stars, comment, multi-image with lightbox). Shows inline review form for eligible users (purchased + not yet reviewed) with star rating, comment textarea, and multi-image upload.
  - **Review images** stored in `frontend/public/images/reviews/`.
- [x] **Authentication Flow Enhancements:**
  - **Mailtrap Integration**: Set up email sending via `smtplib` for account verification and password reset.
  - **Registration Redesign**: Modernized `Register.jsx` to match `Login.jsx` aesthetic. Implemented a 2-step process: Request email verification -> Receive JWT link -> Complete registration.
  - **Forgot Password**: Added "Quên mật khẩu" flow to `Login.jsx` (enter email -> receive link -> reset password).
  - **Backend Support**: Added new endpoints (`/auth/request-register`, `/auth/forgot-password`, `/auth/reset-password`) using JWT tokens with `type` claims to verify email links securely.
- [x] **Cart Backend Integration & Per-User Isolation:**
  - Implemented `/api/v1/cart` endpoints to fully utilize the `giohang` database table, linking carts directly to the user's `uID`.
  - Refactored `cartStore.js` to drop `zustand/middleware` `persist` and instead fetch the cart from the backend on login/app load.
  - Cart state is now completely isolated per user account. When logging out, the local cart is cleared, ensuring a new user logging in does not see the previous user's cart.
- [x] **News System (Tin tức) Implementation:**
  - **Database**: `tintuc` and `binhluan_tintuc` tables added.
  - **Backend**: Created CRUD endpoints for `/news` and `/news/{id}/comments` with support for image upload.
  - **Frontend**: 
    - Replaced "About" with "Tin tức" in Header.
    - Added a News section in Home page showing latest 12 articles with pagination (4 per view).
    - Created `News.jsx` listing all news with pagination and Admin/Staff management actions.
    - Added `NewsForm.jsx` modal to create/update news with `ckeditor5` for rich text content.
    - Created `NewsDetail.jsx` displaying the full article and allowing logged-in users to comment.
    - Admin can delete any comments in `NewsDetail.jsx`.
    - Fixed image display issues for filenames with accents and spaces by properly encoding URLs.
    - Fixed News Form to allow saving articles with empty text fields.
    - Maintained original image filenames on upload and fixed image deletion logic upon article deletion to prevent orphaned files in `frontend/public/images/news`.
- [x] **Product Management UI Updates:**
  - Removed "Thêm sản phẩm" button from `Home.jsx` to clean up the UI.
  - Added "Thêm sản phẩm" button inside `Categories.jsx` (under "Tất cả sản phẩm" section) for Admin users, utilizing the `ProductModal`.
  - Added "Nhập từ Excel" feature in `Admin.jsx` (Add Product tab):
    - Implemented Excel parsing using `xlsx` library.
    - Created an interactive popup (`ExcelImportModal`) displaying the imported data in a table format with editable cells.
    - Included real-time validation with warning icons for non-existent categories or suppliers.
    - Added Autocomplete dropdowns for Category and Supplier editing directly within the table cells.
    - Added manual image upload with preview for each row before final submission.
- [x] **Shop Map & Delivery System:**
  - **Database**: `shop_settings` table with `latitude`, `longitude`, `address`, `shipping_fee_per_km`, `delivery_seconds_per_km`.
  - **Backend**: New `/v1/settings/shop` endpoints (GET public, PUT admin-only) for shop location and shipping config.
  - **Backend**: Checkout now creates orders with `trangthai="pending"` and returns `order_ids`. New `PUT /v1/orders/{id}/status` endpoint to update order status.
  - **Admin "Bản đồ" Tab**: Leaflet map with click-to-pin (red marker), Nominatim address search with autocomplete dropdown, editable fields for shipping fee/km and delivery seconds/km.
  - **Cart Checkout Modal**: Now uses browser geolocation to calculate distance (Haversine formula) from user to shop, displays shipping fee, and shows grand total (products + shipping).
  - **Checkout Page** (`Checkout.jsx`): 4-step animated delivery tracking:
    1. "Đang tiếp nhận đơn" (5s with pulse animation)
    2. "Đã xác nhận đơn hàng" (2s)
    3. "Đang giao hàng" (Leaflet map with animated green marker moving from shop → user, duration = distance × seconds_per_km)
    4. "Giao hàng thành công" — orders updated to `trangthai="completed"`, user can now review products.
- [x] **Pagination & UI Improvements:**
  - `Home.jsx`: Products list shows 4 per row with side navigation buttons and square page numbers below.
  - `Categories.jsx`: "Tất cả sản phẩm" paginated to 25 items/page (5 rows × 5 cols), with square page numbers below.
  - `Admin.jsx`: All lists (Products, Suppliers, Accounts, Orders) paginated to 6 items per page.
  - `Header.jsx`: Automatically scroll to top (`window.scrollTo(0, 0)`) when route changes.
- [x] **Order Analytics & Export (Admin):**
  - **Backend**: Added `GET /v1/orders/analytics` endpoint to fetch aggregated completed orders by date range. Also returns `motaDanhMuc` for category descriptions.
  - **Frontend**: 
    - Added a Mixed Chart (Line + Bar) in `Admin.jsx` (ManageOrdersTab) showing revenue trends based on the `gia` column from the `donhang` table.
    - Added a Pie Chart side-by-side to display Category Revenue percentage (using `motaDanhMuc` as labels).
  - **Features**: 
    - Time filter (Today, 7 days, 30 days, Custom range). Data and charts automatically and instantly update with animations upon any date selection or changes.
    - Export to Excel groups data by Date, displaying Total Revenue and a unique list of Products (Format: "Product Name - Category Name"). Exported file name dynamically includes the date range for better tracking (e.g. `DoanhThu_YYYY-MM-DD_den_YYYY-MM-DD.xlsx`).

- [x] **Database Migration & Project Cleanup**:
  - Dumped all data from local PostgreSQL to SQLite (`test.db`) successfully so the project can be run out-of-the-box by cloning the repository.
  - Consolidated and updated all instructions into a single unified root `README.md` (`npm run dev:all`), deleting redundant sub-READMEs (`backend/README.md` and `frontend/README.md`).
  - Added `Base.metadata.create_all(bind=engine)` inside `backend/app/main.py` so missing tables are automatically generated on startup if using a fresh database.
  - Cleaned up redundant and obsolete files (`test_api_post.py`, `test_product_creation.py`, `test_reviews.py`, `check_db.py`, `seed_db.py`, `dump_pg_to_sqlite.py`) to keep the repository clean.

## Technical Details

- **Backend**: FastAPI, SQLAlchemy, Pydantic, jose (JWT), smtplib
- **Frontend**: React, Vite, Axios, Zustand (authStore), React Router, Lucide-React, Leaflet
- **Database**: PostgreSQL (Active for Dev), SQLite (`test.db` included for instant out-of-the-box evaluation)
- **Image Storage**: `frontend/public/images/products`, `frontend/public/images/categories`, `frontend/public/images/reviews`
- **API Base URL**: `http://localhost:8000/api/v1`

## Architecture Notes

- **Admin page** utilizes state-based tabs to avoid routing complexities.
- **Supplier Autocomplete** implemented using a custom dropdown synced with text input filter.
- **Database Migrations** run directly via SQL scripts (e.g., adding columns) due to lack of Alembic in current setup.
- **Partial updates** on PUT endpoints use `.dict(exclude_unset=True)` to avoid overwriting fields with nulls.
- **SanPham.HinhAnh_url** is a Python `@property`, not a database column — cannot be used in SQL query projections. Always load via ORM object.
- **Review eligibility** checked server-side: user must have a completed order for the product and no existing review.
- **Leaflet** loaded via dynamic `import("leaflet")` to avoid SSR/require issues in Vite.
- **Checkout** page receives order data via `useNavigate` state — no URL params needed.
- **Order lifecycle**: `pending` → `completed` (only after delivery simulation finishes on frontend).

## Guidelines

- Follow TDD approach (validate with tests).
- Keep code minimal and clean (SOLID, DRY, KISS).
- Update this file after each major modification.
