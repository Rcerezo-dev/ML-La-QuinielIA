@echo off
REM Frontend launcher - More robust version

title La QuinielIA - Frontend Dev Server

echo.
echo ========================================
echo   LA QUINIELIA - Frontend
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo npm install no se ha ejecutado aún.
    echo Instalando dependencias...
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo [ERROR] Error al instalar npm packages
        echo Intenta:
        echo   1. Abre PowerShell como ADMINISTRADOR
        echo   2. Ejecuta: npm install -g npm@latest
        echo   3. Cierra y vuelve a intentar
        echo.
        pause
        exit /b 1
    )
)

echo Iniciando Vite dev server...
echo Se abrirá en: http://localhost:3000
echo.
echo Presiona CTRL+C para detener
echo.

call npm run dev

pause
