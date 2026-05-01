# 🎯 START HERE - Comienza Aquí

**Bienvenido a LaLiga Predictor** ⚽

Tu herramienta completa de Machine Learning para predecir resultados de fútbol está lista.

---

## ⚡ Inicio Rápido (5 minutos)

### 1. API Key (GRATIS)
Ve a: https://www.football-data.org/client/register
- Regístrate
- Copia tu API key

### 2. Setup
```bash
# En PowerShell/Terminal:
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configurar
- Renombra `.env.example` a `.env`
- Pega tu API key en la línea:
  ```
  FOOTBALL_DATA_API_KEY=tu_key_aqui
  ```

### 4. Ejecutar
```bash
python VERIFY_SETUP.py     # Verifica todo
streamlit run app.py       # Lanza app
```

**Abre:** http://localhost:8501

### 5. Workflow
1. Click "📥 Cargar Datos"
2. Click "🧠 Entrenar Modelo"
3. Click "🔮 Generar Predicciones"
4. Elige estrategia (conservadora/arriesgada/segura)
5. ¡Listo! Tienes tu quiniela

---

## 📚 Documentación (Según Necesites)

| Situación | Lee |
|-----------|-----|
| 🏃 "Quiero empezar YA" | Este archivo + QUICKSTART.md |
| 🪟 "Estoy en Windows" | INSTALL_WINDOWS.md |
| 🔧 "Necesito configurar" | CHEATSHEET.md |
| 🎓 "Quiero entender arquitectura" | ARCHITECTURE.md |
| 📖 "Documentación completa" | README.md |
| 🆘 "Algo no funciona" | VERIFY_SETUP.py |

---

## 🎯 Qué Hace Esta Herramienta

```
┌─────────────────────────────────────────┐
│  Obtiene datos reales de LaLiga (API)   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Analiza últimas 5 jornadas             │
│  Extrae 30+ variables predictivas       │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Entrena modelo ML (Random Forest)      │
│  Accuracy ~50% (fútbol es caótico)      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Predice próxima jornada                │
│  Genera 3 quinielas (estrategias)       │
│  Muestra probabilidades                 │
└─────────────────────────────────────────┘
```

**Resultado:** Quiniela lista para usar 🎰

---

## ✨ Características

✅ Interfaz Streamlit intuitiva
✅ Descarga automática de datos
✅ Feature engineering profesional
✅ Modelo ML entrenado y evaluado
✅ Predicciones con probabilidades
✅ 3 estrategias de quiniela
✅ Exportación de resultados
✅ CLI alternativa (terminal)
✅ Ejemplos de uso incluidos
✅ Preparado para múltiples ligas

---

## 📊 Ejemplo Resultado

```
Predicción para próxima jornada:

Partido                    Pred  P(1)   P(X)   P(2)  Conf
Real Madrid vs Barcelona    1    65%    20%    15%   65%
Atlético vs Sevilla         X    35%    45%    20%   45%
Valencia vs Sociedad        2    40%    30%    30%   30%
...

QUINIELA CONSERVADORA: 1,X,1,1,X,2,1,1,X,1,X,1,2,1
```

---

## 🔍 Verificación Rápida

Para asegurarte de que todo funciona:

```bash
python VERIFY_SETUP.py
```

Debería mostrar ✓ en todos los checks.

Si hay algún ✗, lee el mensaje de error → Soluciona → Reintenta.

---

## 🚀 Comandos Principales

```bash
# Setup (una sola vez)
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Verificar setup
python VERIFY_SETUP.py

# Ejecutar interfaz web (RECOMENDADO)
streamlit run app.py

# Ejecutar CLI
python scripts\predict.py

# Ver ejemplos
python examples\basic_usage.py 1
```

---

## 🎓 Qué Aprendes

Construyendo esta herramienta aprenderás:

- 🔍 **Web Scraping**: Obtener datos de APIs
- 📊 **Data Science**: Feature engineering, pipelines
- 🤖 **Machine Learning**: Entrenamiento, evaluación, predicción
- 🐍 **Python Profesional**: Estructura, logging, error handling
- 📱 **UI/UX**: Streamlit, visualizaciones interactivas
- 🏗️ **Arquitectura**: Código limpio, escalable, extensible

---

## 🆘 Si Algo Falla

### Opción 1: Auto-diagnóstico
```bash
python VERIFY_SETUP.py
```

Te dirá exactamente qué falta.

### Opción 2: Troubleshooting
Lee `INSTALL_WINDOWS.md` → sección "Troubleshooting"

### Opción 3: Common Issues

| Problema | Solución |
|----------|----------|
| "API Key invalid" | Copia correctamente (sin comillas) |
| "ModuleNotFoundError" | Activa venv: `venv\Scripts\activate` |
| "Port in use" | `streamlit run app.py --server.port=8502` |
| Python no reconocido | Instala desde python.org, marca "Add to PATH" |

---

## 💡 Tips para Éxito

1. **API Key**: Tómate 2 min para registrarte (es gratis)
2. **Venv**: Siempre actívalo. Marca el `(venv)` en prompt
3. **Primer run**: Toma ~15s (descarga + entrena + predice)
4. **Proximos runs**: Mucho más rápido (~2s)
5. **Accuracy**: ~50% es BUENO (fútbol es impredecible)
6. **Estrategia**: Usa "Conservadora" para apuestas reales
7. **Reentrenamiento**: Semanal cuando hay nueva jornada

---

## 📁 Estructura Final

```
quiniela-predictor/  ← ¡Aquí estás!
├── app.py           ← Interfaz Streamlit
├── requirements.txt ← Dependencias
├── .env             ← TU configuración (API key)
│
├── src/             ← Código principal
│   ├── scraper.py       (Obtiene datos)
│   ├── features.py      (Engineering)
│   ├── trainer.py       (Entrena modelo)
│   ├── predictor.py     (Predice)
│   └── config.py        (Configuración)
│
├── scripts/         ← Herramientas
│   └── predict.py       (CLI version)
│
├── examples/        ← Ejemplos de uso
│   └── basic_usage.py   (7 scripts)
│
├── data/            ← Datos
│   ├── raw/             (Descargados)
│   └── processed/       (Procesados)
│
├── models/          ← Modelo guardado
│   └── model.pkl        (Tu modelo ML)
│
└── Documentación/   ← Guías
    ├── README.md        (Todo)
    ├── QUICKSTART.md    (5 min)
    ├── ARCHITECTURE.md  (Diseño)
    ├── CHEATSHEET.md    (Referencia)
    └── ...
```

---

## ✅ Antes de Empezar

- [ ] Tienes Python 3.8+ (verifica: `python --version`)
- [ ] Descargaste el proyecto completo
- [ ] Obtuviste tu API key gratis
- [ ] Tienes internet
- [ ] Tienes editor de texto (VS Code, Notepad, etc.)

---

## 🎬 Próximo Paso

### Opción A: Web UI (RECOMENDADO) 🎨
```bash
streamlit run app.py
```
Interfaz visual, 100% intuitiva.

### Opción B: Terminal 📟
```bash
python scripts\predict.py
```
Rápido y sin UI.

### Opción C: Código Python 🐍
```python
from src.scraper import scrape_all_data
from src.trainer import train_complete_model
# ... tu lógica
```

---

## 📞 Resources

- **API Data**: https://www.football-data.org
- **Streamlit**: https://docs.streamlit.io
- **Scikit-Learn**: https://scikit-learn.org
- **Pandas**: https://pandas.pydata.org

---

## 🎉 ¡Listo!

Has invertido en una herramienta profesional y completa.

### Ahora:
1. Abre terminal en esta carpeta
2. Ejecuta: `python VERIFY_SETUP.py`
3. Luego: `streamlit run app.py`
4. Disfruta prediciendo 🚀

---

## 🙌 Último Empujón

Si algo sigue sin funcionar después de leer esto:

1. **Ejecuta verificación**: `python VERIFY_SETUP.py`
2. **Lee INSTALL_WINDOWS.md** (si estás en Windows)
3. **Google el error exacto**
4. **Reinstala todo**:
   ```bash
   rmdir /s venv
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   ```

---

**¡Gracias por usar LaLiga Predictor! ⚽**

*Hecho con ❤️ para machine learning + fútbol enthusiasts*

**PD:** No olvides que las predicciones son probabilísticas. 
Úsalo por diversión y educación, no apuestes dinero que no puedas perder. 📊
