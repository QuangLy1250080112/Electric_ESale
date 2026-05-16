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

## Technical Details

- **Backend**: FastAPI, SQLAlchemy, Pydantic, jose (JWT), smtplib
- **Frontend**: React, Vite, Axios, Zustand (authStore), React Router, Lucide-React
- **Database**: PostgreSQL (Active)
- **Image Storage**: `frontend/public/images/products`, `frontend/public/images/categories`, `frontend/public/images/reviews`
- **API Base URL**: `http://localhost:8000/api/v1`

## Architecture Notes

- **Admin page** utilizes state-based tabs to avoid routing complexities.
- **Supplier Autocomplete** implemented using a custom dropdown synced with text input filter.
- **Database Migrations** run directly via SQL scripts (e.g., adding columns) due to lack of Alembic in current setup.
- **Partial updates** on PUT endpoints use `.dict(exclude_unset=True)` to avoid overwriting fields with nulls.
- **SanPham.HinhAnh_url** is a Python `@property`, not a database column — cannot be used in SQL query projections. Always load via ORM object.
- **Review eligibility** checked server-side: user must have a completed order for the product and no existing review.

## Guidelines

- Follow TDD approach (validate with tests).
- Keep code minimal and clean (SOLID, DRY, KISS).
- Update this file after each major modification.
