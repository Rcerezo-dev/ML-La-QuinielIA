# 🏗️ Arquitectura del Sistema

## Diagrama General

```
┌─────────────────────────────────────────────────────────────┐
│                    APLICACIÓN STREAMLIT                      │
│                      (Interface & UX)                        │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
    ┌────────────┐  ┌────────────┐  ┌──────────────┐
    │  SCRAPER   │  │  TRAINER   │  │  PREDICTOR   │
    │            │  │            │  │              │
    │ Descarga   │  │ Entrena ML │  │ Predice      │
    │ datos API  │  │ y evalúa   │  │ resultados   │
    └──────┬─────┘  └──────┬─────┘  └──────┬───────┘
           │               │                │
           └───────────────┼────────────────┘
                           │
           ┌───────────────┼───────────────┐
           ↓               ↓               ↓
    ┌─────────────┐  ┌──────────────┐  ┌─────────────┐
    │  FEATURES   │  │   TRAINER    │  │  UTILS      │
    │             │  │              │  │             │
    │ Engineering │  │ Modelo ML    │  │ Funciones   │
    │ & Pipeline  │  │ RandomForest │  │ auxiliares  │
    └─────────────┘  └──────────────┘  └─────────────┘
           │               │                │
           └───────────────┼────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ↓                  ↓                  ↓
    ┌──────────┐   ┌──────────────┐   ┌────────────┐
    │   DATA   │   │    MODELS    │   │   CONFIG   │
    │          │   │              │   │            │
    │ raw/     │   │ model.pkl    │   │ Parámetros │
    │ processed│   │ metadata.pkl │   │ ligas      │
    └──────────┘   └──────────────┘   └────────────┘
```

## Componentes

### 1. **Scraper** (`src/scraper.py`)
- **Responsabilidad**: Obtener datos de la API de football-data.org
- **Métodos principales**:
  - `get_standings()`: Clasificación actual
  - `get_matches()`: Partidos completados
  - `get_last_n_matchdays()`: Últimas N jornadas
  - `get_next_matchday()`: Próxima jornada
  - `save_data()` / `load_data()`: Persistencia CSV

### 2. **Feature Engineer** (`src/features.py`)
- **Responsabilidad**: Crear variables predictivas
- **Proceso**:
  1. Para cada partido, obtiene estadísticas de ambos equipos
  2. Calcula métricas (forma, goles, puntos)
  3. Crea ratios y comparativas
  4. Normaliza y prepara X, y para modelo
- **Output**: DataFrame con 30+ features numéricos

### 3. **Trainer** (`src/trainer.py`)
- **Responsabilidad**: Entrenar y evaluar modelo ML
- **Algoritmo**: Random Forest (100 árboles)
- **Process**:
  1. Train/Test split (80/20)
  2. Entrenamiento con estratificación
  3. Evaluación (accuracy, F1, confusión)
  4. Persistencia con joblib
- **Output**: Modelo .pkl + métricas

### 4. **Predictor** (`src/predictor.py`)
- **Responsabilidad**: Generar predicciones
- **Métodos**:
  - `predict_match()`: Predicción individual
  - `predict_matchday()`: Jornada completa
  - `generate_quiniela()`: Estrategias de apuesta
  - `format_predictions()`: Formato UI
- **Output**: DataFrame con predicciones + probabilidades

### 5. **App Streamlit** (`app.py`)
- **Responsabilidad**: Interface visual
- **Features**:
  - 4 tabs principales (Predicciones, Histórico, Clasificación, Info)
  - Sidebar con controles
  - Visualizaciones Plotly
  - Estado de sesión
- **UX**: Flujo intuitivo 1-2-3

### 6. **Config** (`src/config.py`)
- **Responsabilidad**: Centralizar configuración
- **Contiene**:
  - Códigos de ligas (LaLiga, Premier, etc.)
  - Parámetros modelo
  - Estrategias quiniela
  - Mapeos resultado

### 7. **Utils** (`src/utils.py`)
- **Responsabilidad**: Funciones auxiliares
- **Servicios**:
  - Gestión de directorios
  - Serialización JSON
  - Formateo de datos
  - Validaciones

## Flujo de Datos

### 1️⃣ Descarga
```
API → Scraper.scrape_all_data() → CSV (data/raw/)
                      ↓
           Últimas 5 jornadas
           Próxima jornada
           Clasificación
```

### 2️⃣ Preparación
```
CSV → FeatureEngineer.create_training_dataset()
        ↓
    For each partido en histórico:
        Obtén stats equipo local (últimos 5)
        Obtén stats equipo visitante
        Calcula 30+ features
        ↓
    X (features), y (resultado)
```

### 3️⃣ Entrenamiento
```
X, y → ModelTrainer.train_model()
        ↓
    Split: 80% train, 20% test
    RandomForest.fit(X_train, y_train)
    ↓
    Evaluate: accuracy, F1, confusion
    Save: model.pkl + metadata.pkl
```

### 4️⃣ Predicción
```
Próxima jornada → Predictor.predict_matchday()
                    ↓
                For each partido:
                    Obtén features
                    Modelo.predict_proba()
                    ↓
                    [P(1), P(X), P(2)]
                    ↓
                    Estrategia → Quiniela
```

## Datos

### Input
- **Fuente**: football-data.org (API gratuita)
- **Datos por partido**:
  ```json
  {
    "date": "2024-01-15T20:00Z",
    "home_team": "Real Madrid",
    "away_team": "Barcelona",
    "home_goals": 2,
    "away_goals": 1,
    "round": 19
  }
  ```

### Features Generados
```
Home Team (10):
- wins, draws, losses
- goals_for, goals_against
- goal_diff, win_rate
- avg_goals_for, avg_goals_against
- points_avg

Away Team (10):
- [Mismo que home]

Comparativas (3):
- form_diff
- goal_power_diff
- defense_diff
```

### Output
```json
{
  "home_team": "Real Madrid",
  "away_team": "Barcelona",
  "prediction": "1",
  "prob_local": 0.65,
  "prob_draw": 0.20,
  "prob_away": 0.15,
  "confidence": 0.65
}
```

## Modelo ML

### Algorithm: Random Forest

```
RandomForestClassifier(
    n_estimators=100,        # 100 árboles
    max_depth=15,            # Profundidad máxima
    min_samples_split=5,     # Mín muestras para split
    min_samples_leaf=2,      # Mín en hoja
    random_state=42          # Reproducibilidad
)
```

### Target (3 clases)
- `0`: Local gana (1)
- `1`: Empate (X)
- `2`: Visitante gana (2)

### Métricas
- **Accuracy**: Porcentaje aciertos (45-55% esperado)
- **F1 Score**: Balance precision-recall
- **Confusion Matrix**: Errores por clase

### Hiperparámetros
Ajustables en `src/trainer.py`:
```python
n_estimators: 100 → 150-200 (más poder, más lento)
max_depth: 15 → 10-20 (profundidad)
min_samples_split: 5 → 3-7 (regularización)
```

## Extensibilidad

### Añadir Liga Nueva
```python
# 1. En config.py, añade:
LEAGUE_CODES["Serie A"] = "SA"
LEAGUE_CONFIG["Serie A"] = {...}

# 2. En scraper.py, cambia:
LEAGUE_CODE = "SA"

# 3. Listo!
```

### Cambiar Modelo ML
```python
# En trainer.py, reemplaza:
from sklearn.ensemble import GradientBoostingClassifier
# o XGBoost, LightGBM, etc.

self.model = GradientBoostingClassifier(...)
```

### Ensamble de Modelos
```python
# Usar múltiples modelos y promediar probabilidades
models = [
    RandomForestClassifier(...),
    GradientBoostingClassifier(...),
    SVC(probability=True)
]

# Voting: proba_final = mean([m.predict_proba(X) for m in models])
```

### Features Adicionales
```python
# En features.py, añade en create_match_features():
"injuries": count_injured_players(home_team),
"fatigue": days_since_last_match,
"referee_bias": referee_home_favoritism,
"weather": rainfall + wind_speed
```

## Performance

### Tiempos Esperados
| Operación | Tiempo |
|-----------|--------|
| Descarga datos | 2-5s |
| Feature engineering | 1-2s |
| Entrenamiento modelo | 5-10s |
| Predicción | <1s |
| **Total** | **10-20s** |

### Memoria
- Raw data: ~1-5 MB
- Features: ~5-10 MB
- Model: ~5-10 MB
- **Total**: <50 MB

## Seguridad & Robustez

### Error Handling
- Try/except en todas las llamadas API
- Fallback a datos locales si API falla
- Validación de inputs
- Logging detallado

### Data Validation
```python
# En scraper.py
assert len(matches) > 0, "Sin datos"
assert "home_goals" in matches.columns
assert all(matches["date"].notna())
```

### Model Validation
```python
# En trainer.py
assert X.shape[0] >= min_samples, "Pocos datos"
assert y.nunique() == 3, "Classes desbalanceadas"
assert not X.isnull().any().any(), "NaNs en features"
```

## Testing (Futuro)

### Estructura recomendada
```
tests/
├── test_scraper.py
├── test_features.py
├── test_trainer.py
└── test_predictor.py
```

### Ejemplo test
```python
def test_scraper_returns_dataframe():
    scraper = LaLigaScraper()
    df = scraper.get_matches()
    assert isinstance(df, pd.DataFrame)
    assert len(df) > 0
```

## DevOps (Futuro)

### Docker
```dockerfile
FROM python:3.12
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["streamlit", "run", "app.py"]
```

### CI/CD
```yaml
# .github/workflows/test.yml
- Run tests
- Check coverage > 80%
- Build Docker image
- Push to registry
```

---

**Arquitectura limpia, escalable y lista para producción** ⚡
