@echo off
REM La QuinielIA - Diagnostic Script
REM Verifica requisitos y detecta problemas

setlocal enabledelayedexpansion

echo.
echo ======================================
echo   LA QUINIELIA - Diagnostic Tool
echo ======================================
echo.

REM Color para errores y éxitos
set "ERROR=[ERROR]"
set "OK=[OK]"

REM 1. Verificar Python
echo Verificando Python...
python --version >nul 2>&1
if !ERRORLEVEL! EQU 0 (
    echo !OK! Python está instalado:
    python --version
) else (
    echo !ERROR! Python NO está instalado
    echo   Descarga: https://python.org/
    echo.
)

REM 2. Verificar Node.js
echo.
echo Verificando Node.js...
node --version >nul 2>&1
if !ERRORLEVEL! EQU 0 (
    echo !OK! Node.js está instalado:
    node --version
) else (
    echo !ERROR! Node.js NO está instalado
    echo   Descarga: https://nodejs.org/
    echo.
)

REM 3. Verificar npm
echo.
echo Verificando npm...
npm --version >nul 2>&1
if !ERRORLEVEL! EQU 0 (
    echo !OK! npm está instalado:
    npm --version
) else (
    echo !ERROR! npm NO está instalado
    echo.
)

REM 4. Verificar conda
echo.
echo Verificando conda...
conda --version >nul 2>&1
if !ERRORLEVEL! EQU 0 (
    echo !OK! Conda está instalado:
    conda --version
) else (
    echo !ERROR! Conda NO está instalado
    echo   Descarga: https://www.anaconda.com/
    echo.
)

REM 5. Verificar estructura de carpetas
echo.
echo Verificando estructura del proyecto...
if exist "api.py" (
    echo !OK! Encontrado: api.py
) else (
    echo !ERROR! NO encontrado: api.py
)

if exist "frontend" (
    echo !OK! Encontrado: frontend/
    if exist "frontend\package.json" (
        echo !OK! Encontrado: frontend/package.json
    ) else (
        echo !ERROR! NO encontrado: frontend/package.json
    )
) else (
    echo !ERROR! NO encontrado: frontend/
)

REM 6. Verificar .env files
echo.
echo Verificando archivos .env...
if exist ".env" (
    echo !OK! .env existe (backend)
) else (
    echo [!] .env NO existe (backend) - se usarán defaults
)

if exist "frontend\.env" (
    echo !OK! frontend/.env existe
) else (
    echo [!] frontend/.env NO existe - se creará
)

REM 7. Verificar puertos disponibles
echo.
echo Verificando puertos...
netstat -ano | find ":8000 " >nul 2>&1
if !ERRORLEVEL! EQU 0 (
    echo [!] Puerto 8000 OCUPADO (backend)
) else (
    echo !OK! Puerto 8000 disponible
)

netstat -ano | find ":3000 " >nul 2>&1
if !ERRORLEVEL! EQU 0 (
    echo [!] Puerto 3000 OCUPADO (frontend)
) else (
    echo !OK! Puerto 3000 disponible
)

REM 8. Verificar quiniela environment
echo.
echo Verificando Conda environments...
conda env list | find "quiniela" >nul 2>&1
if !ERRORLEVEL! EQU 0 (
    echo !OK! Conda environment 'quiniela' existe
) else (
    echo [!] Conda environment 'quiniela' NO existe
    echo   Crea uno con:
    echo   conda create -n quiniela python=3.11 -y
    echo.
)

REM 9. Mostrar siguiente paso
echo.
echo ======================================
echo   Resultado del Diagnóstico
echo ======================================
echo.
echo Si ves [ERROR] arriba, necesitas instalar ese software.
echo.
echo Para iniciar:
echo   1. Asegúrate que Python, Node.js y Conda están instalados
echo   2. Ejecuta: start-all.bat
echo.
echo Si aún hay errores, ejecuta:
echo   frontend\start-dev.bat
echo.
echo Y copia aquí todos los mensajes de error que veas.
echo.
pause
