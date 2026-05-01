@echo off
REM La QuinielIA - Start Both Backend + Frontend
REM Abre dos ventanas: una para el backend y otra para el frontend

echo.
echo ======================================
echo   LA QUINIELIA - Full Stack Launcher
echo ======================================
echo.

REM Verifica que estamos en la carpeta correcta
if not exist "api.py" (
    echo [ERROR] No se encontró api.py
    echo.
    echo Este script debe ejecutarse desde la carpeta raíz del proyecto (quiniela/)
    echo.
    pause
    exit /b 1
)

echo [✓] Carpeta correcta

REM Verifica Python
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python no está instalado o no está en PATH
    pause
    exit /b 1
)

echo [✓] Python:
python --version
echo.

REM Verifica Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js no está instalado o no está en PATH
    pause
    exit /b 1
)

echo [✓] Node.js:
node --version
echo.

echo ======================================
echo   Iniciando Backend y Frontend...
echo ======================================
echo.

REM Abre terminal para el Backend
echo [1/2] Iniciando Backend (FastAPI)...
start cmd /k "cd . && python api.py"

REM Espera un segundo para que el backend inicie
timeout /t 2 /nobreak

REM Abre terminal para el Frontend
echo [2/2] Iniciando Frontend (React/Vite)...
start cmd /k "cd frontend && npm run dev"

echo.
echo ======================================
echo   ✓ Ambos servicios iniciados
echo ======================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo.
echo Las ventanas se cerrarán cuando cierres los servicios.
echo.
pause
