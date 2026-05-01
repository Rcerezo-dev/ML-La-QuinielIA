@echo off
REM La QuinielIA Frontend - Dev Server Launcher
REM Instala dependencias y lanza el servidor de desarrollo

echo.
echo ======================================
echo   LA QUINIELIA - Frontend Dev Server
echo ======================================
echo.

REM Verifica si Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js no está instalado o no está en PATH
    echo.
    echo Descarga Node.js desde: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Muestra versión de Node
echo [✓] Node.js encontrado:
node --version
npm --version
echo.

REM Verifica si node_modules existe
if not exist "node_modules" (
    echo [1/2] Instalando dependencias (primera vez)...
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Error al instalar dependencias
        pause
        exit /b 1
    )
    echo.
    echo [✓] Dependencias instaladas
) else (
    echo [✓] Dependencias ya instaladas
)

echo.
echo [2/2] Iniciando servidor de desarrollo...
echo.
echo ======================================
echo   Abriendo http://localhost:3000
echo ======================================
echo.
echo Presiona CTRL+C para detener el servidor
echo.

REM Inicia el servidor
call npm run dev

pause
