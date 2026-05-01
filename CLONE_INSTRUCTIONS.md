# 🚀 Clone Instructions - ML-La-QuinielIA

**Cómo clonar y ejecutar el proyecto desde GitHub**

---

## 📝 Para Compartir

Cuando subas a GitHub, comparte este comando:

```bash
git clone https://github.com/TU_USUARIO/ML-La-QuinielIA.git
cd ML-La-QuinielIA
```

---

## ⚡ Setup Rápido (5 minutos)

```bash
# 1. Clone
git clone https://github.com/TU_USUARIO/ML-La-QuinielIA.git
cd ML-La-QuinielIA

# 2. Entorno virtual
python -m venv venv
source venv/bin/activate          # macOS/Linux
# o
venv\Scripts\activate             # Windows

# 3. Dependencias
pip install -r requirements.txt

# 4. API Key (https://www.football-data.org/client/register)
# Renombra .env.example a .env y pega tu API key

# 5. Verificar
python VERIFY_SETUP.py

# 6. Ejecutar
streamlit run app.py
# o
python api.py
```

---

## 🔧 Instalación Completa

### Windows PowerShell
```powershell
# Clone
git clone https://github.com/TU_USUARIO/ML-La-QuinielIA.git
cd ML-La-QuinielIA

# Virtual env
python -m venv venv
venv\Scripts\Activate.ps1

# If blocked:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Config
Copy-Item .env.example .env
# Edita .env con tu API key

# Verify
python VERIFY_SETUP.py

# Run
streamlit run app.py
```

### macOS/Linux
```bash
git clone https://github.com/TU_USUARIO/ML-La-QuinielIA.git
cd ML-La-QuinielIA

python3 -m venv venv
source venv/bin/activate

pip install --upgrade pip
pip install -r requirements.txt

cp .env.example .env
# Edita .env

python VERIFY_SETUP.py

streamlit run app.py
```

---

## 🛠️ Ejecutar Backend REST

```bash
# Con venv activado
pip install -r requirements_api.txt
python api.py

# Abre: http://localhost:8000/docs
```

---

## 🎯 Primeros Pasos

### Opción 1: Web UI (Recomendado)
```bash
streamlit run app.py
# Abre http://localhost:8501
```

### Opción 2: Backend REST
```bash
python api.py
# Abre http://localhost:8000/docs
```

### Opción 3: CLI
```bash
python scripts/predict.py
```

### Opción 4: Ejemplos
```bash
python examples/basic_usage.py 1
python examples/basic_usage.py 3
```

---

## 📚 Documentación

| Comienza por | Propósito |
|--------------|-----------|
| `START_HERE.md` | Primeros pasos |
| `QUICKSTART.md` | Setup en 5 min |
| `README.md` | Documentación completa |
| `API_DOCS.md` | Endpoints REST |
| `EXAMPLE_UI_INTEGRATION.md` | Ejemplos de UI |

---

## 🆘 Troubleshooting

### "API Key invalid"
1. Registrate en: https://www.football-data.org/client/register
2. Copia tu API key
3. Renombra `.env.example` a `.env`
4. Pega tu key en la línea `FOOTBALL_DATA_API_KEY=`

### "ModuleNotFoundError"
```bash
# Asegúrate venv activado
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Reinstala
pip install --upgrade -r requirements.txt
```

### "Port already in use"
```bash
streamlit run app.py --server.port=8502
# o
uvicorn api:app --port 8001
```

---

## 📊 Estructura Clonada

```
ML-La-QuinielIA/
├── app.py                    ← Streamlit UI
├── api.py                    ← FastAPI REST
├── src/                      ← Módulos ML
├── scripts/                  ← CLI tools
├── examples/                 ← Ejemplos
├── data/                     ← Datos (vacío, se llena)
├── models/                   ← Modelos (vacío, se crea)
├── requirements.txt          ← Dependencies
├── .env.example              ← Template env
├── VERIFY_SETUP.py           ← Setup check
└── [documentación]           ← 11+ guías
```

---

## 🎯 Verificar Instalación

```bash
python VERIFY_SETUP.py
```

Debería mostrar ✓ en todos los checks:
- ✓ Python version
- ✓ Virtual environment
- ✓ Librerías
- ✓ Estructura carpetas
- ✓ Archivos críticos
- ✓ Configuración .env
- ✓ Importes funcionan

---

## 🚀 Ready to Go

```bash
streamlit run app.py
```

Abre automáticamente: http://localhost:8501

---

## 💡 Tips

1. **API Key gratis** → https://www.football-data.org/client/register
2. **Primer run** → ~15 segundos (descarga + entrena + predice)
3. **Próximos runs** → ~2 segundos (caché)
4. **Datos** → Se guardan localmente en `data/raw/`
5. **Modelo** → Se guardan en `models/model.pkl`

---

## 📞 Necesitas Ayuda?

1. Lee `INSTALL_WINDOWS.md` (Windows específico)
2. Chequea `START_HERE.md` (guía general)
3. Corre `python VERIFY_SETUP.py` (diagnóstico)
4. Lee `CHEATSHEET.md` (referencia rápida)

---

## ✨ Enjoy!

```
⚽ ML-La-QuinielIA
🤖 Machine Learning predictor para LaLiga
🔌 Backend REST + ML Model
📊 Predice resultados con 50%+ accuracy
```

**Clone, setup y disfruta! 🚀**

---

**Happy Coding! ⚽🤖**
