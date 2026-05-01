@echo off
REM La QuinielIA Frontend - Setup Script
REM Limpia, instala dependencias y verifica la configuración

echo.
echo ======================================
echo   LA QUINIELIA - Frontend Setup
echo ======================================
echo.

REM Verifica si Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js no está instalado
    echo.
    echo Descarga desde: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [✓] Node.js:
node --version

echo [✓] npm:
npm --version
echo.

REM Opción de limpiar
if "%1"=="clean" (
    echo [1/3] Limpiando node_modules y package-lock.json...
    if exist "node_modules" (
        rmdir /s /q node_modules
        echo [✓] node_modules eliminado
    )
    if exist "package-lock.json" (
        del package-lock.json
        echo [✓] package-lock.json eliminado
    )
    echo.
)

REM Instala dependencias
echo [2/3] Instalando dependencias...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Error al instalar dependencias
    pause
    exit /b 1
)

echo [✓] Dependencias instaladas
echo.

REM Verifica archivo .env
echo [3/3] Verificando configuración...
if not exist ".env" (
    echo [!] Creando .env desde .env.example...
    copy .env.example .env
    echo [✓] .env creado. Verifica VITE_API_URL
) else (
    echo [✓] .env existe
)

echo.
echo ======================================
echo   ✓ Setup completado
echo ======================================
echo.
echo Próximos pasos:
echo   1. Abre una terminal PowerShell/CMD
echo   2. Navega a: cd frontend
echo   3. Ejecuta: npm run dev
echo.
echo O simplemente haz doble-click en: start-dev.bat
echo.
pause
