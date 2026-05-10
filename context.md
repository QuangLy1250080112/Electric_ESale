# ESale Project Context

## Current Status

- Backend is running at `http://localhost:8000` (Fixed dependencies and config)
- Frontend is running at `http://localhost:5173`
- Authentication is working with `admin` / `123`

## Recent Changes

- [x] Fix API prefix mismatch between frontend and backend
- [x] Clean up and optimize initial_data.py script
- [x] Resolved "yellow highlight" IDE warnings in initial_data.py
- [x] Temporarily switched to plain text passwords for debugging
- [x] Implemented modern Header and Footer with icons (Lucide-React)
- [x] Added "Quản trị" (Admin) page with product addition form and image upload
- [x] Protected Admin routes (only accessible by admin accounts)
- [x] Removed Map and Checkout from Header navigation
- [x] **Implemented `/me` endpoint in Backend to properly sync user data**
- [x] **Fixed tenTK display in Header and implemented User Dropdown for Logout**
- [x] Fixed "missing social icons" error by replacing them with available Lucide icons
- [x] **Resolved `ModuleNotFoundError: No module named 'jose'` and `passlib` by installing missing dependencies**
- [x] **Fixed `AttributeError: 'Settings' object has no attribute 'API_V1_STR'` by adding it to config**
- [x] **Verified backend starts successfully on Python 3.13**
- [x] **Implemented Product Image management with `AnhSP` table and associated relationships**
- [x] **Fixed Product creation by seeding default Supplier and Category records**
- [x] **Added cascade delete for Products and fixed circular FK reference (ID_HinhAnh) during deletion**
- [x] **Fixed UI field mapping (`tenSP`, `gia`, `mota`) and removed hardcoded image fallbacks**
- [x] **Improved Admin page with dynamic Category/Supplier fetching and better error handling**
- [x] **Fixed image upload path by correcting project root calculation (added missing dirname call)**
- [x] **Moved misplaced images from `backend/frontend` to the correct `frontend/public` directory and cleaned up**
- [x] **Implemented automatic image file deletion from filesystem when a product is deleted**
- [x] **Consolidated image storage to `frontend/public/images/products` and removed redundant `backend/uploads` folder**
- [x] **Cleaned up code and utilities to remove all references to legacy `/uploads` path**
- [x] **Merged Products page into Home page — removed standalone Products page**
- [x] **Removed "Sản phẩm" link from Header navigation**
- [x] **Enhanced Home page with: Hero section, About section, Why Choose Us, Owner Introduction**
- [x] **Added product tabs: Newest (by created_at), Hottest (by order count), All**
- [x] **Added pagination (6 products per page, prev/next buttons)**
- [x] **Added "Đến trang danh mục" CTA button on Home page**
- [x] **Created Categories page with category boxes (image + mota display)**
- [x] **Added category image upload (admin-only, stored in DB `danhmuc.anh_url`)**
- [x] **Created CategoryProducts page — shows all products in a category with image/name/price cards**
- [x] **Added backend endpoints: `/products/newest`, `/products/hottest`, `/categories/{id}/products`, `/categories/{id}/image`**
- [x] **Added `anh_url` column to `danhmuc` table for category images**
- [x] **Updated App.jsx routes: `/products` redirects to `/`, added `/categories` and `/categories/:id`**

## Technical Details

- **Backend**: FastAPI, SQLAlchemy, Pydantic, jose (JWT)
- **Frontend**: React, Vite, Axios, Zustand (authStore), React Router, Lucide-React
- **Database**: PostgreSQL (Active)
- **Image Storage**: 
  - Products: `frontend/public/images/products`
  - Categories: `frontend/public/images/categories`
- **API Base URL**: `http://localhost:8000/api/v1`

## Architecture Notes

- **Home page** now contains all product browsing features (search, newest/hottest tabs, pagination)
- **Products page** is deprecated — `/products` route redirects to Home (`/`)
- **Product detail** route (`/products/:id`) still works for deep linking
- **Categories page** (`/categories`) shows category boxes with images and descriptions
- **CategoryProducts page** (`/categories/:id`) shows all products in a specific category
- **Backend sorting**: 
  - Newest: `ORDER BY created_at DESC`
  - Hottest: `LEFT JOIN donhang`, `ORDER BY SUM(soluong) DESC`

## Environment Setup

- **Virtual Environment**: Located at `venv/` in the project root.
- **Python Interpreter**: Use the interpreter within `venv` to avoid `ModuleNotFoundError`.
- **Node Modules**: Installed `lucide-react` for modern icons.

## Guidelines

- Follow TDD approach (validate with tests).
- Keep code minimal and clean (SOLID, DRY, KISS).
- Update this file after each major modification.
