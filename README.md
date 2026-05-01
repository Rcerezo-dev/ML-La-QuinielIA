# ⚽ Quiniela Predictor - LaLiga

Herramienta profesional de Machine Learning para predicción de resultados de fútbol en LaLiga española.

## 🎯 Funcionalidades

✅ **Descarga automática** de datos reales de LaLiga  
✅ **Análisis histórico** de últimas 5 jornadas  
✅ **Feature Engineering** con variables predictivas  
✅ **Modelo ML** (Random Forest) entrenado  
✅ **Predicciones** con probabilidades para próxima jornada  
✅ **Generador de Quinielas** con 3 estrategias (conservadora, arriesgada, segura)  
✅ **Interfaz Streamlit** intuitiva y visual  
✅ **Persistencia** de modelo con joblib  
✅ **Arquitectura extensible** para Premier League, Champions, etc.

## 📦 Estructura del Proyecto

```
quiniela-predictor/
├── app.py                 # Aplicación principal Streamlit
├── requirements.txt       # Dependencias Python
├── .env.example          # Variables de entorno
├── README.md             # Este archivo
├── data/
│   ├── raw/              # Datos descargados
│   └── processed/        # Datos procesados
├── models/
│   ├── model.pkl         # Modelo entrenado
│   └── metadata.pkl      # Metadatos
└── src/
    ├── __init__.py
    ├── scraper.py        # Web scraping / API
    ├── features.py       # Feature engineering
    ├── trainer.py        # Entrenamiento ML
    ├── predictor.py      # Generador de predicciones
    └── utils.py          # Utilidades comunes
```

## 🚀 Instalación

### 1. Clonar o descargar el proyecto
```bash
cd quiniela-predictor
```

### 2. Crear entorno virtual
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 3. Instalar dependencias
```bash
pip install -r requirements.txt
```

### 4. Configurar API Key
- Registrate en https://www.football-data.org/client/register (es GRATIS)
- Copia tu API key
- Renombra `.env.example` a `.env`
- Pega tu API key en `.env`:
```
FOOTBALL_DATA_API_KEY=tu_api_key_aqui
LEAGUE_CODE=PD
TEST_SIZE=0.2
RANDOM_STATE=42
```

## 📱 Uso

### Opción 1: Interfaz Streamlit (RECOMENDADO)
```bash
streamlit run app.py
```

Luego abre: http://localhost:8501

**Pasos:**
1. Click en "📥 Cargar Datos" (descarga últimas 5 jornadas + próxima)
2. Click en "🧠 Entrenar Modelo" (entrena RandomForest)
3. Click en "🔮 Generar Predicciones" (predice próxima jornada)
4. Elige estrategia: Conservadora / Arriesgada / Segura

### Opción 2: Script CLI
```bash
python scripts/predict.py
```

### Opción 3: Uso programático
```python
from src.scraper import scrape_all_data
from src.trainer import train_complete_model
from src.predictor import Predictor

# 1. Descargar datos
last_5, next_matchday, standings = scrape_all_data()

# 2. Entrenar
trainer, metrics = train_complete_model(last_5)
print(f"Accuracy: {metrics['accuracy']:.2%}")

# 3. Predecir
predictor = Predictor(trainer, last_5)
predictions = predictor.predict_matchday(next_matchday)

# 4. Generar quiniela
quiniela = predictor.generate_quiniela(predictions, strategy='balanced')
print(quiniela)
```

## 🧠 Modelo ML

### Algoritmo
- **Random Forest Classifier**
- 100 árboles
- Max depth: 15
- Estratificación por clase

### Features (30+)
- **Forma reciente**: Victorias, empates, derrotas últimas 5 jornadas
- **Goles**: Promedio a favor/contra
- **Diferencia**: Goles y puntos respecto visitante
- **Ratios**: Win rate, puntos promedio
- **Comparativas**: Diferencia de forma, potencia ofensiva, defensa

### Target (3 clases)
- `0`: Local gana (1)
- `1`: Empate (X)
- `2`: Visitante gana (2)

### Evaluación
- Train/Test split: 80/20
- Métricas: Accuracy, F1-Score, Matriz de Confusión
- Validación cruzada si es necesario

## 📊 Resultados Esperados

```
Accuracy: 45-55% (fútbol es impredecible)
F1 Score: 0.40-0.50

Comparación:
- Predicción aleatoria: 33% accuracy
- Nuestro modelo: 50%+ accuracy
```

*Nota: El fútbol es altamente estocástico. Incluso 50% de accuracy es bueno.*

## 🎯 Estrategias de Quiniela

### 1️⃣ Conservadora (Equilibrada)
- Apuesta si confianza > 40%
- Por defecto: Local si no hay seguridad
- **Riesgo**: Bajo
- **Retorno esperado**: Positivo a largo plazo

### 2️⃣ Arriesgada (Agresiva)
- Apuesta si confianza > 55%
- Busca cuotas altas
- **Riesgo**: Alto
- **Retorno esperado**: Variable

### 3️⃣ Alto Nivel Confianza (Segura)
- Apuesta SOLO si confianza > 60%
- Pocos partidos pero muy seguros
- **Riesgo**: Muy bajo
- **Retorno esperado**: Consistente

## 🔧 Configuración Avanzada

### Ajustar parámetros modelo
En `src/trainer.py`:
```python
self.model = RandomForestClassifier(
    n_estimators=150,      # Más árboles = más poder
    max_depth=20,          # Mayor profundidad = overfitting
    min_samples_split=3,   # Menos muestras = más flexible
    random_state=42,
    n_jobs=-1,
)
```

### Cambiar source de datos
En `src/scraper.py`:
```python
# Para Premier League (PL)
LEAGUE_CODE = "PL"

# Para Serie A (SA)
LEAGUE_CODE = "SA"

# Para Bundesliga (BL1)
LEAGUE_CODE = "BL1"
```

## 📈 Extensiones Futuras

### 1. Múltiples Ligas
```python
from src.config import SUPPORTED_LEAGUES
# ES (LaLiga), EN (Premier), IT (Serie A), DE (Bundesliga)
```

### 2. Aprendizaje Continuo
- Reentrenamiento semanal automático
- Validación out-of-sample
- Feedback loop

### 3. Features Avanzadas
- Datos de lesionados
- Fatiga de viajes
- Árbitros
- Clima

### 4. Ensambles
- Combinar múltiples modelos (RF + XGBoost + LightGBM)
- Voting classifier
- Stacking

### 5. API REST
- Exponer predicciones vía Flask/FastAPI
- Integración con otras plataformas

## 🐛 Troubleshooting

### Error: API Key inválida
```
❌ Error obteniendo partidos: 'X-Auth-Token' error
```
**Solución:**
1. Verifica que `.env` existe y tiene formato correcto
2. Comprueba API key en https://www.football-data.org/client
3. Registra nueva API key

### Error: No hay jornadas
```
⚠️ No hay jornadas próximas programadas
```
**Solución:**
- Espera a que se publique el calendario de próxima jornada
- La API actualiza datos en tiempo real

### Error: Modelo no entrena
```
❌ No hay suficientes datos
```
**Solución:**
- Necesita mínimo ~5 partidos para entrenar
- Si la liga tiene pause, usa datos históricos

## 📝 Logging

Todos los módulos usan logging standard de Python:
```python
import logging
logger = logging.getLogger(__name__)
logger.info("Tu mensaje")
```

Activa debug si necesitas:
```python
logging.basicConfig(level=logging.DEBUG)
```

## 📊 APIs Utilizadas

- **football-data.org**: Datos de LaLiga, Premier, Serie A, Bundesliga
  - Libre para uso personal
  - 10 requests/minuto plan free
  - Histórico completo disponible

## 📄 Licencia

Libre para uso personal y educativo.

## 🤝 Contribuciones

Para mejoras o reportar bugs:
1. Fork el proyecto
2. Crea rama feature (`git checkout -b feature/mejora`)
3. Commit cambios (`git commit -am 'Añade mejora'`)
4. Push a rama (`git push origin feature/mejora`)
5. Abre Pull Request

## ⚠️ Disclaimer

**Las predicciones son probabilísticas y no garantizan resultados.**

- El fútbol es impredecible
- Las probabilidades se basan en datos históricos
- Úsalo solo con fines educativos
- No apuestes dinero que no puedas perder

## 📞 Soporte

- Issues: Crea issue en el repositorio
- Documentación: Ver docstrings en código
- Ejemplos: Ver `scripts/` directorio

---

**Hecho con ❤️ para aficionados de LaLiga**
