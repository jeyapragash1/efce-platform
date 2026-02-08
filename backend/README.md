# EFCE Backend

## Overview
FastAPI backend for EFCE platform with PostgreSQL and JWT auth.

## Setup
1. Create a Python virtual environment.
2. Install dependencies:
   pip install -r requirements.txt
3. Copy .env.example to .env and update values.
4. Start server:
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

## Notes
- On first run the database tables are created automatically.
- Default seed data is inserted if tables are empty.
- User registration is restricted to admins (invite-only model).

## Default Admin
- Email: admin@efce.local
- Password: admin123
