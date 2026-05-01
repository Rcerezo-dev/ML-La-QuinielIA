# 🔌 API REST Documentation - LaLiga Predictor

**Backend REST API para conectar con cualquier UI**

---

## 🚀 Inicio Rápido

### 1. Instalar dependencias
```bash
pip install -r requirements_api.txt
```

### 2. Ejecutar servidor
```bash
python api.py
```

**Servidor en:** `http://localhost:8000`
**Docs interactiva:** `http://localhost:8000/docs`

### 3. Conectar desde UI
```javascript
const response = await fetch('http://localhost:8000/health');
const data = await response.json();
```

---

## 📊 Endpoints Disponibles

### **Info & Health**

#### `GET /` 
Información básica
```bash
curl http://localhost:8000/
```
```json
{
  "name": "LaLiga Predictor API",
  "version": "1.0.0",
  "docs": "/docs",
  "status": "running"
}
```

#### `GET /health`
Health check
```bash
curl http://localhost:8000/health
```
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T20:30:00.123456"
}
```

#### `GET /status`
Estado actual de la aplicación
```bash
curl http://localhost:8000/status
```
```json
{
  "data_loaded": false,
  "model_trained": false,
  "predictions_ready": false,
  "last_update": null
}
```

---

## 📥 Data Endpoints

### `POST /data/load`
**Carga datos de LaLiga (últimas 5 jornadas + próxima)**

```bash
curl -X POST http://localhost:8000/data/load
```

**Response:**
```json
{
  "success": true,
  "matches_loaded": 45,
  "next_matchday_matches": 10,
  "teams_count": 20,
  "message": "Cargados 45 partidos históricos y 10 de próxima jornada"
}
```

---

### `GET /data/history`
**Obtiene últimas 5 jornadas cargadas**

```bash
curl http://localhost:8000/data/history
```

**Response:**
```json
{
  "matches": [
    {
      "date": "2024-01-13T20:00:00",
      "home_team": "Real Madrid",
      "away_team": "Barcelona",
      "home_goals": 2,
      "away_goals": 1,
      "round": 19
    },
    ...
  ],
  "total": 45
}
```

---

### `GET /data/next-matchday`
**Obtiene próxima jornada pendiente**

```bash
curl http://localhost:8000/data/next-matchday
```

**Response:**
```json
{
  "matches": [
    {
      "date": "2024-01-15T20:00:00",
      "home_team": "Real Madrid",
      "away_team": "Atletico",
      "round": 20
    },
    ...
  ],
  "total": 10
}
```

---

## 🧠 Model Endpoints

### `POST /model/train`
**Entrena modelo ML con datos cargados**

Requiere: `POST /data/load` primero

```bash
curl -X POST http://localhost:8000/model/train
```

**Response:**
```json
{
  "success": true,
  "accuracy": 0.5234,
  "f1_score": 0.4532,
  "total_matches": 45,
  "message": "Modelo entrenado correctamente"
}
```

---

### `GET /model/features`
**Obtiene features más importantes**

```bash
curl http://localhost:8000/model/features
```

**Response:**
```json
{
  "features": [
    {
      "name": "home_win_rate",
      "importance": 0.1234
    },
    {
      "name": "form_diff",
      "importance": 0.1023
    },
    ...
  ]
}
```

---

### `GET /model/metrics`
**Obtiene métricas del modelo**

```bash
curl http://localhost:8000/model/metrics
```

**Response:**
```json
{
  "accuracy": 0.5234,
  "f1_score": 0.4532,
  "confusion_matrix": [
    [8, 2, 2],
    [1, 4, 3],
    [3, 2, 7]
  ]
}
```

---

## 🔮 Prediction Endpoints

### `POST /predictions/generate`
**Genera predicciones para próxima jornada**

Requiere:
- `POST /data/load`
- `POST /model/train`

```bash
curl -X POST http://localhost:8000/predictions/generate
```

**Response:**
```json
{
  "success": true,
  "predictions": [
    {
      "home_team": "Real Madrid",
      "away_team": "Barcelona",
      "prediction": "1",
      "prob_local": 0.65,
      "prob_draw": 0.20,
      "prob_away": 0.15,
      "confidence": 0.65
    },
    ...
  ],
  "total": 10,
  "average_confidence": 0.5432
}
```

---

### `GET /predictions/latest`
**Obtiene últimas predicciones generadas**

```bash
curl http://localhost:8000/predictions/latest
```

**Response:** (mismo formato que POST /predictions/generate)

---

## 🎲 Quiniela Endpoints

### `POST /quiniela/generate`
**Genera quiniela con estrategia especificada**

**Estrategias:**
- `balanced`: Conservadora (confianza > 40%)
- `aggressive`: Arriesgada (confianza > 55%)
- `high_confidence`: Segura (confianza > 60%)

```bash
curl -X POST "http://localhost:8000/quiniela/generate?strategy=balanced"
```

**Response:**
```json
{
  "success": true,
  "strategy": "balanced",
  "quiniela": "1,X,2,1,X,1,X,2,1,1",
  "bets": ["1", "X", "2", "1", "X", "1", "X", "2", "1", "1"],
  "stats": {
    "total_partidos": 10,
    "predicciones_1": 5,
    "predicciones_x": 3,
    "predicciones_2": 2,
    "confidence_promedio": 0.5234
  }
}
```

---

## 🏆 Info Endpoints

### `GET /standings`
**Obtiene clasificación de LaLiga**

```bash
curl http://localhost:8000/standings
```

**Response:**
```json
{
  "standings": [
    {
      "position": 1,
      "team": "Real Madrid",
      "played": 19,
      "wins": 15,
      "draws": 2,
      "losses": 2,
      "goals_for": 48,
      "goals_against": 15,
      "goal_diff": 33,
      "points": 47
    },
    ...
  ],
  "total": 20
}
```

---

## 🔄 System Endpoints

### `POST /reset`
**Reinicia la aplicación (limpia estado)**

```bash
curl -X POST http://localhost:8000/reset
```

**Response:**
```json
{
  "success": true,
  "message": "Aplicación reiniciada"
}
```

---

## 📋 Flujo Típico de Llamadas

```javascript
// 1. Cargar datos
await fetch('http://localhost:8000/data/load', { method: 'POST' })

// 2. Entrenar modelo
await fetch('http://localhost:8000/model/train', { method: 'POST' })

// 3. Generar predicciones
await fetch('http://localhost:8000/predictions/generate', { method: 'POST' })

// 4. Generar quiniela
await fetch('http://localhost:8000/quiniela/generate?strategy=balanced', { method: 'POST' })

// 5. Obtener resultado
await fetch('http://localhost:8000/predictions/latest')
```

---

## 🧬 Ejemplos de Integración

### JavaScript/Fetch API

```javascript
// Cargar datos
const loadData = async () => {
  const response = await fetch('http://localhost:8000/data/load', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  return await response.json();
};

// Entrenar
const trainModel = async () => {
  const response = await fetch('http://localhost:8000/model/train', {
    method: 'POST'
  });
  return await response.json();
};

// Predecir
const predict = async () => {
  const response = await fetch('http://localhost:8000/predictions/generate', {
    method: 'POST'
  });
  return await response.json();
};

// Quiniela
const quiniela = async (strategy = 'balanced') => {
  const response = await fetch(
    `http://localhost:8000/quiniela/generate?strategy=${strategy}`,
    { method: 'POST' }
  );
  return await response.json();
};
```

### React

```jsx
const [status, setStatus] = useState('idle');
const [predictions, setPredictions] = useState(null);

const handleLoadData = async () => {
  setStatus('loading');
  try {
    const res = await fetch('http://localhost:8000/data/load', {
      method: 'POST'
    });
    const data = await res.json();
    if (data.success) {
      setStatus('data_loaded');
    }
  } catch (error) {
    setStatus('error');
    console.error(error);
  }
};

const handlePredict = async () => {
  setStatus('predicting');
  try {
    const res = await fetch('http://localhost:8000/predictions/generate', {
      method: 'POST'
    });
    const data = await res.json();
    setPredictions(data.predictions);
    setStatus('done');
  } catch (error) {
    setStatus('error');
  }
};
```

### Python/Requests

```python
import requests

BASE_URL = 'http://localhost:8000'

# Cargar datos
response = requests.post(f'{BASE_URL}/data/load')
print(response.json())

# Entrenar
response = requests.post(f'{BASE_URL}/model/train')
print(response.json())

# Predecir
response = requests.post(f'{BASE_URL}/predictions/generate')
predictions = response.json()
print(predictions)

# Quiniela
response = requests.post(f'{BASE_URL}/quiniela/generate?strategy=balanced')
quiniela = response.json()
print(f"Quiniela: {quiniela['quiniela']}")
```

---

## ⚙️ Configuración Avanzada

### CORS (Production)
En `api.py`, línea ~30:

```python
# Actual (permite todos)
allow_origins=["*"]

# Production (específico)
allow_origins=[
    "http://localhost:3000",      # React dev
    "https://tudominio.com",      # Tu app
]
```

### Port Personalizado
```bash
# Default: 8000
python api.py

# Custom port (8001)
uvicorn api:app --port 8001
```

### Host Personalizado
```bash
# Localhost solamente (default)
python api.py

# Accessible desde cualquier IP
uvicorn api:app --host 0.0.0.0
```

---

## 🔐 Security (Para Producción)

### 1. Deshabilitar CORS wildcard
```python
allow_origins=["https://tu-dominio.com"]
```

### 2. Agregar autenticación
```python
from fastapi.security import HTTPBearer

security = HTTPBearer()

@app.post("/predictions/generate", dependencies=[Depends(security)])
async def generate_predictions():
    ...
```

### 3. Rate limiting
```bash
pip install slowapi
```

### 4. HTTPS
```bash
uvicorn api:app --ssl-keyfile key.pem --ssl-certfile cert.pem
```

---

## 🐛 Troubleshooting

### "Connection refused"
```bash
# Verifica que servidor está running
python api.py

# Comprueba en browser
http://localhost:8000/health
```

### "CORS error" desde UI
```python
# En api.py, asegúrate CORS está habilitado
allow_origins=["*"]  # O tu dominio específico
```

### "Modelo no entrenado"
Debes ejecutar en orden:
1. POST /data/load
2. POST /model/train
3. POST /predictions/generate

### "Próxima jornada no disponible"
La liga tiene pausa. Espera a que publique el calendario.

---

## 📊 Response Status Codes

| Code | Meaning | Ejemplo |
|------|---------|---------|
| 200 | OK - Exitoso | Datos cargados |
| 400 | Bad Request | Datos no cargados aún |
| 500 | Server Error | Error en API o modelo |

---

## 📚 Documentación Interactiva

Abre en browser:
```
http://localhost:8000/docs
```

Interfaz Swagger UI para:
- Probar endpoints
- Ver parámetros
- Ver schemas
- Ver respuestas

---

## 🎯 Cheatsheet

```bash
# Health check
curl http://localhost:8000/health

# Cargar datos
curl -X POST http://localhost:8000/data/load

# Entrenar
curl -X POST http://localhost:8000/model/train

# Predecir
curl -X POST http://localhost:8000/predictions/generate

# Quiniela (3 opciones)
curl -X POST "http://localhost:8000/quiniela/generate?strategy=balanced"
curl -X POST "http://localhost:8000/quiniela/generate?strategy=aggressive"
curl -X POST "http://localhost:8000/quiniela/generate?strategy=high_confidence"

# Clasificación
curl http://localhost:8000/standings

# Reiniciar
curl -X POST http://localhost:8000/reset
```

---

## 📝 Ejemplo UI Mínima

```html
<!DOCTYPE html>
<html>
<head>
    <title>LaLiga Predictor</title>
</head>
<body>
    <h1>LaLiga Predictor</h1>
    
    <button onclick="loadData()">Cargar Datos</button>
    <button onclick="trainModel()">Entrenar Modelo</button>
    <button onclick="predict()">Predecir</button>
    <button onclick="quiniela()">Generar Quiniela</button>
    
    <div id="result"></div>
    
    <script>
        const API = 'http://localhost:8000';
        
        const loadData = async () => {
            const res = await fetch(API + '/data/load', { method: 'POST' });
            const data = await res.json();
            document.getElementById('result').innerHTML = JSON.stringify(data, null, 2);
        };
        
        const trainModel = async () => {
            const res = await fetch(API + '/model/train', { method: 'POST' });
            const data = await res.json();
            document.getElementById('result').innerHTML = `
                <strong>Accuracy: ${(data.accuracy * 100).toFixed(1)}%</strong><br>
                <strong>F1 Score: ${data.f1_score.toFixed(4)}</strong>
            `;
        };
        
        const predict = async () => {
            const res = await fetch(API + '/predictions/generate', { method: 'POST' });
            const data = await res.json();
            const html = data.predictions.map(p => `
                <div>
                    ${p.home_team} vs ${p.away_team}<br>
                    Predicción: ${p.prediction} (${(p.confidence * 100).toFixed(0)}% confianza)
                </div>
            `).join('');
            document.getElementById('result').innerHTML = html;
        };
        
        const quiniela = async () => {
            const res = await fetch(API + '/quiniela/generate?strategy=balanced', { method: 'POST' });
            const data = await res.json();
            document.getElementById('result').innerHTML = `
                <strong>Quiniela: ${data.quiniela}</strong>
            `;
        };
    </script>
</body>
</html>
```

---

**¡Listo para conectar con tu UI! 🔌**
