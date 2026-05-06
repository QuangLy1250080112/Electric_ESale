# Project Context: ESale

## Overview
Electronics E-commerce Platform (ESale) built with FastAPI and React.

## Features & Tasks
- [x] Initial database setup with admin/guest accounts
- [x] Backend API structure with v1 versioning
- [x] Frontend authentication integration
- [x] Fix login redirection issue in LoginForm
- [x] Fix API prefix mismatch between frontend and backend
- [x] Clean up and optimize initial_data.py script
- [x] Resolved "yellow highlight" IDE warnings in initial_data.py
- [x] Temporarily switched to plain text passwords for debugging

## Technical Details
- **Backend**: FastAPI, SQLAlchemy, Pydantic, Bcrypt
- **Frontend**: React, Vite, Axios, Zustand (authStore), React Router
- **Database**: PostgreSQL (Development: SQLite)
- **API Base URL**: `http://localhost:8000/api/v1`

## Environment Setup
- **Virtual Environment**: Located at `venv/` in the project root.
- **Python Interpreter**: Use the interpreter within `venv` to avoid `ModuleNotFoundError`.
- **Dependencies**: Install via `pip install -r requirements.txt` in the `backend/` directory.
- **Backend Entry**: From `backend/` directory, run `python -m uvicorn app.main:app --reload`.
