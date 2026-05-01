@echo off
REM Verificación simple de instalaciones
REM No se cierra abruptamente

echo.
echo ==========================================
echo   LA QUINIELIA - System Check
echo ==========================================
echo.

REM Python
echo 1. Buscando Python...
python --version
if %ERRORLEVEL% EQU 0 (
    echo [OK] Python está instalado
    echo.
) else (
    echo [ERROR] Python NO está instalado
    echo Descarga desde: https://python.org/
    echo.
)

REM Node
echo 2. Buscando Node.js...
node --version
if %ERRORLEVEL% EQU 0 (
    echo [OK] Node.js está instalado
    echo.
) else (
    echo [ERROR] Node.js NO está instalado
    echo Descarga desde: https://nodejs.org/
    echo.
)

REM npm
echo 3. Buscando npm...
npm --version
if %ERRORLEVEL% EQU 0 (
    echo [OK] npm está instalado
    echo.
) else (
    echo [ERROR] npm NO está instalado
    echo Instálalo con Node.js
    echo.
)

REM Conda
echo 4. Buscando Conda...
conda --version
if %ERRORLEVEL% EQU 0 (
    echo [OK] Conda está instalado
    echo.
) else (
    echo [ERROR] Conda NO está instalado
    echo Descarga desde: https://www.anaconda.com/
    echo.
)

REM Archivos
echo 5. Buscando archivos...
if exist "api.py" (
    echo [OK] api.py encontrado
) else (
    echo [ERROR] api.py NO encontrado
)

if exist "frontend\package.json" (
    echo [OK] frontend/package.json encontrado
    echo.
) else (
    echo [ERROR] frontend/package.json NO encontrado
    echo.
)

REM Instrucciones
echo ==========================================
echo   ¿QUÉ HACER?
echo ==========================================
echo.
echo Si ves [ERROR], INSTALA ese software:
echo   Python: https://python.org/
echo   Node.js: https://nodejs.org/
echo   Conda: https://www.anaconda.com/
echo.
echo IMPORTANTE: Después de instalar,
echo CIERRA esta ventana y abre UNA NUEVA.
echo.
echo Una vez todo esté instalado:
echo.
echo   cd frontend
echo   npm install
echo   npm run dev
echo.
echo.
pause
