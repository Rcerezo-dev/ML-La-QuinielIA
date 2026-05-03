@echo off
echo Starting La QuinielIA...
echo.
echo [1/2] Starting Backend (Flask API on port 8000)...
start cmd /k python api.py
echo.
echo [2/2] Starting Frontend (Vite on port 5173)...
start cmd /k cd frontend && npm run dev
echo.
echo Both services are starting. Check the opened windows for logs.
timeout /t 3
