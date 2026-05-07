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
- [x] **Relocated image storage to `frontend/public/images/` for repository persistence**
- [x] **Configured Backend to save uploads directly to Frontend public folder**
- [x] **Updated Database image paths to use `/images/` prefix, served by Vite dev server**
- [x] **Maintained legacy support for `/uploads/` folder if it exists in Backend root**
- [x] **Updated `getImageUrl` utility to correctly handle both Frontend-served and Backend-served images**

## Technical Details

- **Backend**: FastAPI, SQLAlchemy, Pydantic, jose (JWT)
- **Frontend**: React, Vite, Axios, Zustand (authStore), React Router, Lucide-React
- **Database**: PostgreSQL (Active)
- **API Base URL**: `http://localhost:8000/api/v1`

## Environment Setup

- **Virtual Environment**: Located at `venv/` in the project root.
- **Python Interpreter**: Use the interpreter within `venv` to avoid `ModuleNotFoundError`.
- **Node Modules**: Installed `lucide-react` for modern icons.

## Guidelines

- Follow TDD approach (validate with tests).
- Keep code minimal and clean (SOLID, DRY, KISS).
- Update this file after each major modification.
