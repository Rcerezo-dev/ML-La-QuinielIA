# ⚡ Cheat Sheet - LaLiga Predictor

Referencia rápida de comandos y tips.

## 🚀 Primeros Pasos (3 minutos)

```bash
# 1. Setup venv
python -m venv venv
venv\Scripts\activate

# 2. Instala
pip install -r requirements.txt

# 3. Configura .env con tu API key
# (https://www.football-data.org/client/register)

# 4. Verifica
python VERIFY_SETUP.py

# 5. Ejecuta
streamlit run app.py
```

**Abre:** http://localhost:8501

---

## 📱 UI Streamlit - Botones

| Botón | Qué hace | Tiempo |
|-------|----------|--------|
| 📥 Cargar Datos | Descarga últimas 5 jornadas | 2-5s |
| 🧠 Entrenar Modelo | Entrena RandomForest | 5-10s |
| 🔮 Generar Predicciones | Predice próxima jornada | <1s |
| 📊 Conservadora | Quiniela confianza > 40% | Instant |
| ⚡ Arriesgada | Quiniela confianza > 55% | Instant |
| 🏆 Alto Nivel | Quiniela confianza > 60% | Instant |

---

## 🔧 Configuración Rápida

### Cambiar Liga
```bash
# En .env:
LEAGUE_CODE=PD    # LaLiga (actual)
LEAGUE_CODE=PL    # Premier League
LEAGUE_CODE=SA    # Serie A
LEAGUE_CODE=BL1   # Bundesliga
```

### Cambiar Puerto
```bash
streamlit run app.py --server.port=8502
```

### Debug Mode
```bash
# En app.py o cualquier archivo:
import logging
logging.basicConfig(level=logging.DEBUG)
```

---

## 📊 Python API - Uso Programático

### Pipeline Completo
```python
from src.scraper import scrape_all_data
from src.trainer import train_complete_model
from src.predictor import Predictor

# 1. Datos
last_5, next_matchday, standings = scrape_all_data()

# 2. Entrenar
trainer, metrics = train_complete_model(last_5)
print(f"Accuracy: {metrics['accuracy']:.2%}")

# 3. Predecir
predictor = Predictor(trainer, last_5)
predictions = predictor.predict_matchday(next_matchday)

# 4. Quiniela
quiniela = predictor.generate_quiniela(predictions, strategy='balanced')
print(quiniela['bet'].tolist())
```

### Predicción Individual
```python
import pandas as pd

pred = predictor.predict_match(
    home_team="Real Madrid",
    away_team="Barcelona",
    match_date=pd.Timestamp.now()
)

print(f"Predicción: {pred['prediction']}")
print(f"Confianza: {pred['confidence']:.1%}")
print(f"P(1)={pred['prob_local']:.1%}, P(X)={pred['prob_draw']:.1%}, P(2)={pred['prob_away']:.1%}")
```

### Cargar Modelo Existente
```python
from src.trainer import ModelTrainer

trainer = ModelTrainer()
trainer.load_model('model.pkl')

# Usar para predicciones
predictor = Predictor(trainer, historical_data)
```

---

## 🐛 Troubleshooting Rápido

| Error | Fix |
|-------|-----|
| `ModuleNotFoundError` | Venv no activado: `venv\Scripts\activate` |
| `API Key invalid` | Verifica `.env` sin comillas |
| `Port 8501 in use` | `streamlit run app.py --server.port=8502` |
| `ImportError` | Reinstala: `pip install --upgrade -r requirements.txt` |
| `No future matches` | Liga tiene pausa, espera jornada |
| `Python not found` | Reinstala Python, marca "Add to PATH" |

---

## 📁 Archivos Clave

```
app.py                 # UI Streamlit (modificar aquí para cambios UI)
requirements.txt       # Dependencias (add/remove packages aquí)
.env                   # Variables de entorno (TU API KEY)
.env.example           # Template (no modificar, copy como .env)

src/scraper.py         # Obtener datos (LEAGUE_CODE aquí)
src/features.py        # Feature engineering (variables aquí)
src/trainer.py         # Parámetros ML (n_estimators, max_depth, etc.)
src/predictor.py       # Lógica predicciones (estrategias aquí)
src/config.py          # Configuración global (ligas, umbrales)

data/raw/              # CSVs descargados
models/                # model.pkl guardado

scripts/predict.py     # CLI version
examples/basic_usage.py # Ejemplos (7 scripts)
```

---

## 🎯 Casos de Uso Comunes

### Quiero cambiar estrategia
```python
# En predictor.py, método generate_quiniela()
# Modifica confidence_threshold:
if strategy == "custom":
    return quiniela.apply(
        lambda row: row["prediction"] if row["confidence"] > 0.50 else "1",
        axis=1,
    )
```

### Quiero más features
```python
# En features.py, create_match_features():
features['custom_var'] = calcular_algo(...)
```

### Quiero otro modelo ML
```python
# En trainer.py, reemplaza:
from xgboost import XGBClassifier
self.model = XGBClassifier(n_estimators=100)
```

### Quiero guardar predicciones
```python
predictions.to_csv('predicciones.csv', index=False)
predictions.to_json('predicciones.json', orient='records')
predictions.to_excel('predicciones.xlsx', index=False)
```

### Quiero múltiples ligas
```python
# En config.py, ya están definidas
# En .env, cambia LEAGUE_CODE=PL para Premier
# En scraper.py, respeta LEAGUE_CODE de .env
```

---

## 📊 Interpretación Resultados

```
Predicción: "1" (Local gana)
P(1) = 0.65 = 65% probabilidad local gana
P(X) = 0.20 = 20% probabilidad empate
P(2) = 0.15 = 15% probabilidad visitante gana

Confianza = max(0.65, 0.20, 0.15) = 0.65 = 65%
  → Muy confiado en predicción 1
  
Confianza < 40% = No apuesta (muy incierto)
Confianza 40-55% = Apuesta conservadora
Confianza > 55% = Apuesta arriesgada
```

---

## 🔄 Workflow Típico Semanal

```
1. JUEVES/VIERNES: Se juega última jornada
   ↓
2. SÁBADO: Obtén datos → Entrena modelo
   ↓
3. LUNES: Genera predicciones próxima jornada
   ↓
4. MARTES-VIERNES: Próxima jornada se juega
   ↓
5. Repite desde JUEVES
```

---

## ⚙️ Parámetros Configurables

| Parámetro | Ubicación | Rango | Defecto |
|-----------|-----------|-------|---------|
| n_estimators | trainer.py | 50-500 | 100 |
| max_depth | trainer.py | 5-30 | 15 |
| test_size | .env | 0.1-0.4 | 0.2 |
| confidence_threshold | predictor.py | 0.3-0.7 | 0.4-0.6 |
| matchdays_history | config.py | 3-10 | 5 |

---

## 📚 Documentación Rápida

- **Instalación Windows**: `INSTALL_WINDOWS.md`
- **Setup rápido**: `QUICKSTART.md`
- **Arquitectura**: `ARCHITECTURE.md`
- **Documentación completa**: `README.md`
- **Verificación**: `python VERIFY_SETUP.py`

---

## 🎓 Ejemplos

```bash
python examples/basic_usage.py 1  # Pipeline básico
python examples/basic_usage.py 2  # Paso a paso
python examples/basic_usage.py 3  # Múltiples estrategias
python examples/basic_usage.py 4  # Análisis modelo
python examples/basic_usage.py 5  # Predicción individual
python examples/basic_usage.py 6  # Datos guardados
python examples/basic_usage.py 7  # Exportar
```

---

## 💻 Comandos Sistema

```bash
# Actualizar dependencias
pip install --upgrade -r requirements.txt

# Ver paquetes instalados
pip list

# Limpiar caché pip
pip cache purge

# Requerimientos actualizado
pip freeze > requirements.txt

# Desactivar venv
deactivate

# Borrar venv (si quieres empezar de cero)
rmdir /s venv  # Windows
rm -rf venv    # Mac/Linux
```

---

## 🆘 SOS Rápido

```bash
# "No sé qué está pasando"
python VERIFY_SETUP.py      # Diagnóstico automático

# "Quiero borrar todo y empezar"
rmdir /s venv               # Borra venv
rmdir /s data\raw           # Borra datos
rmdir /s models             # Borra modelos
python -m venv venv         # Nuevo venv
venv\Scripts\activate
pip install -r requirements.txt

# "¿Qué versión tengo?"
python --version
pip list | findstr streamlit
```

---

## 📞 Quick Links

- **API Key**: https://www.football-data.org/client/register
- **API Docs**: https://www.football-data.org/docs
- **API Status**: https://www.football-data.org/status
- **Streamlit Docs**: https://docs.streamlit.io
- **Scikit-learn**: https://scikit-learn.org

---

## ✅ Pre-Launch Checklist

- [ ] `.env` tiene API key (sin comillas)
- [ ] `venv\Scripts\activate` ejecutado
- [ ] `python VERIFY_SETUP.py` pasa
- [ ] Puerto 8501 disponible
- [ ] Conexión internet
- [ ] Python 3.8+

✅ Listo → `streamlit run app.py`

---

**¡Que disfrutes! ⚽**
