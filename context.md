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
  - **Quản lí nhà cung cấp**: Replaced old "Danh mục" tab. Allows viewing and adding suppliers to the `nhacungcap` table.
  - **Quản lí tài khoản**: Replaced old "Người dùng" tab. Allows viewing, creating (with Admin role toggle), and deleting user accounts in the `taikhoan` table.
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

## Technical Details

- **Backend**: FastAPI, SQLAlchemy, Pydantic, jose (JWT)
- **Frontend**: React, Vite, Axios, Zustand (authStore), React Router, Lucide-React
- **Database**: PostgreSQL (Active)
- **Image Storage**: `frontend/public/images/products` and `frontend/public/images/categories`
- **API Base URL**: `http://localhost:8000/api/v1`

## Architecture Notes

- **Admin page** utilizes state-based tabs to avoid routing complexities.
- **Supplier Autocomplete** implemented using a custom dropdown synced with text input filter.
- **Database Migrations** run directly via SQL scripts (e.g., adding columns) due to lack of Alembic in current setup.
- **Partial updates** on PUT endpoints use `.dict(exclude_unset=True)` to avoid overwriting fields with nulls.

## Guidelines

- Follow TDD approach (validate with tests).
- Keep code minimal and clean (SOLID, DRY, KISS).
- Update this file after each major modification.
