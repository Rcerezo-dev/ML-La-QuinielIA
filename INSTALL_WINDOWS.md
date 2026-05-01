# 🪟 Instalación en Windows

Guía paso a paso para Windows 10/11.

## Requisitos Previos

- Python 3.8+ instalado (descarga desde python.org)
- Git (opcional, para clonar repo)
- Conexión a Internet

## Paso 1: Obtener API Key (GRATIS)

1. Ve a: https://www.football-data.org/client/register
2. Regístrate con tu email
3. Verifica email
4. Login
5. Copia tu API Key (Panel → Account)

## Paso 2: Descargar Proyecto

### Opción A: Con Git
```bash
git clone <repo-url>
cd quiniela-predictor
```

### Opción B: Manual
1. Descarga ZIP desde repo
2. Descomprime en tu carpeta

## Paso 3: Crear Entorno Virtual

Abre PowerShell o CMD:

```powershell
# Navega a la carpeta
cd C:\ruta\a\quiniela-predictor

# Crea venv
python -m venv venv

# Activa venv
venv\Scripts\activate

# Deberías ver (venv) al principio del prompt
```

## Paso 4: Instalar Dependencias

Con venv activado:

```powershell
pip install --upgrade pip

pip install -r requirements.txt
```

**Toma ~3-5 minutos la primera vez**

## Paso 5: Configurar API Key

1. En la carpeta del proyecto, abre `.env.example`
2. Guárdalo como `.env` (sin extensión)
3. Reemplaza:
   ```
   FOOTBALL_DATA_API_KEY=your_free_api_key_here
   ```
   Con tu API key (sin comillas)

Resultado:
```
FOOTBALL_DATA_API_KEY=abc123def456xyz789
LEAGUE_CODE=PD
TEST_SIZE=0.2
RANDOM_STATE=42
```

## Paso 6: Ejecutar App

Con venv aún activado:

```powershell
streamlit run app.py
```

**Debería abrir automáticamente en http://localhost:8501**

Si no abre:
- Abre manualmente: http://localhost:8501
- Si no funciona puerto, prueba: `streamlit run app.py --server.port=8502`

## Paso 7: Usar la Aplicación

### Primera Ejecución:

1. **Cargar Datos**
   - Click en botón "📥 Cargar Datos"
   - Espera 2-5 segundos
   - Deberías ver ✅ Datos cargados

2. **Entrenar Modelo**
   - Click en "🧠 Entrenar Modelo"
   - Espera 5-10 segundos
   - Verás accuracy y F1 score

3. **Generar Predicciones**
   - Click en "🔮 Generar Predicciones"
   - Verás tabla con predicciones
   - Elige estrategia (conservadora/arriesgada/segura)

### Próximas Ejecuciones:

- Reutiliza modelo guardado
- Mucho más rápido (~2 segundos)
- Actualiza datos weekly si quieres

## Alternativa: CLI (Sin Streamlit)

Si prefieres terminal:

```powershell
python scripts\predict.py
```

Mostrará predicciones en la terminal.

## Troubleshooting Windows

### ❌ "python: El término no se reconoce"

**Solución**: Python no está en PATH

```powershell
# Prueba:
python --version
# Si no funciona:
python3 --version

# Si ambos fallan:
# Reinstala Python desde python.org
# Marca: "Add Python to PATH"
```

### ❌ "venv no activa"

En PowerShell, podría necesitar permisos. Prueba:

```powershell
# Si da error de ejecución:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Luego vuelve a activar:
venv\Scripts\Activate.ps1
```

### ❌ "pip command not found"

```powershell
# Usa:
python -m pip install -r requirements.txt
```

### ❌ "ModuleNotFoundError: No module named..."

Venv no activado. Verifica que ves `(venv)` en prompt:

```
❌ C:\ruta>      ← Mal
✅ (venv) C:\ruta> ← Bien
```

Reactiva:
```powershell
venv\Scripts\activate
```

### ❌ Puerto 8501 ya está en uso

Usa otro puerto:

```powershell
streamlit run app.py --server.port=8502
```

Abre: http://localhost:8502

### ❌ "Cannot import plotly / requests / pandas"

Una dependencia no instaló bien:

```powershell
# Reinstala todo:
pip install --upgrade --force-reinstall -r requirements.txt
```

### ❌ API Key error

Verifica `.env`:

```
❌ .env.example    ← Mal (no renombró)
✅ .env            ← Bien

❌ FOOTBALL_DATA_API_KEY = 'abc123'  ← Comillas
✅ FOOTBALL_DATA_API_KEY=abc123       ← Sin comillas
```

Si persiste, genera nueva key en:
https://www.football-data.org/client

## Desactivar Entorno (Cuando termines)

```powershell
deactivate
```

## Actualizar Código

Si descargas versión nueva:

```powershell
# Con venv activado:
pip install --upgrade -r requirements.txt
```

## Cambiar de Liga

Edita `.env`:

```
LEAGUE_CODE=PD    # LaLiga España
LEAGUE_CODE=PL    # Premier League
LEAGUE_CODE=SA    # Serie A Italia
LEAGUE_CODE=BL1   # Bundesliga Alemania
```

## Tips Productividad

### Crear Shortcut para iniciar
Crea archivo `start.bat`:

```batch
@echo off
cd /d "%~dp0"
call venv\Scripts\activate
streamlit run app.py
pause
```

Guarda en carpeta raíz, doble click para iniciar.

### IDE Recomendado
- VS Code (https://code.visualstudio.com/)
  - Extensión: Python
  - Extensión: Streamlit
  - Extensión: Pylance

### Virtual Studio Code Setup
```json
{
  "python.defaultInterpreterPath": "${workspaceFolder}/venv/Scripts/python.exe"
}
```

## Sistema Operativo Verificado

✅ Windows 10 (21H2)
✅ Windows 11
⚠️ Windows 7 (podría tener issues)

## Última Verificación

```powershell
# Verifica todo instalado:
python --version
pip --version
pip list | findstr streamlit pandas scikit-learn

# Output debería mostrar:
# Python 3.12.x
# pip 24.x.x
# streamlit
# pandas
# scikit-learn
```

Si todo ✅ → Listo para usar!

---

**Si algo no funciona:**
1. Revisa Troubleshooting arriba
2. Google el error exacto
3. Abre issue en repo

**¡Disfruta predicting! ⚽**
