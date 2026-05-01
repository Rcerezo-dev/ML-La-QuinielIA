# 🔌 Backend REST API - LaLiga Predictor

**Backend profesional listo para conectar con cualquier UI**

---

## 📦 Qué Incluye

```
✅ API REST con FastAPI (api.py)
✅ 14 endpoints documentados
✅ Documentación Swagger interactiva
✅ CORS habilitado (para cualquier UI)
✅ Manejo robusto de errores
✅ Autenticación lista para producción
✅ Ejemplos de integración (5 frameworks)
```

---

## ⚡ Setup (2 minutos)

```bash
# Instalar
pip install -r requirements_api.txt

# Ejecutar
python api.py

# Verificar
curl http://localhost:8000/health
```

**Servidor:** http://localhost:8000
**Docs:** http://localhost:8000/docs

---

## 🔌 Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| **Info** |
| GET | `/` | Info API |
| GET | `/health` | Health check |
| GET | `/status` | Estado app |
| **Data** |
| POST | `/data/load` | Cargar datos |
| GET | `/data/history` | Últimas 5 jornadas |
| GET | `/data/next-matchday` | Próxima jornada |
| **Model** |
| POST | `/model/train` | Entrenar ML |
| GET | `/model/features` | Features importantes |
| GET | `/model/metrics` | Métricas modelo |
| **Predictions** |
| POST | `/predictions/generate` | Generar predicciones |
| GET | `/predictions/latest` | Últimas predicciones |
| **Quiniela** |
| POST | `/quiniela/generate` | Generar quiniela |
| **Other** |
| GET | `/standings` | Clasificación |
| POST | `/reset` | Reiniciar app |

---

## 📱 Ejemplo de Uso (JavaScript)

```javascript
const API = 'http://localhost:8000';

// 1. Cargar datos
const loadData = async () => {
  const res = await fetch(`${API}/data/load`, { method: 'POST' });
  return await res.json();
};

// 2. Entrenar
const train = async () => {
  const res = await fetch(`${API}/model/train`, { method: 'POST' });
  return await res.json();
};

// 3. Predecir
const predict = async () => {
  const res = await fetch(`${API}/predictions/generate`, { method: 'POST' });
  return await res.json();
};

// 4. Quiniela
const quiniela = async () => {
  const res = await fetch(`${API}/quiniela/generate?strategy=balanced`, { 
    method: 'POST' 
  });
  return await res.json();
};

// Uso
await loadData();
await train();
const predictions = await predict();
const result = await quiniela();
console.log(result.quiniela); // "1,X,2,1,X,1,..."
```

---

## 🎨 Integración con Diferentes UI

### React
```jsx
const [predictions, setPredictions] = useState(null);

const handlePredict = async () => {
  const res = await fetch('http://localhost:8000/predictions/generate', {
    method: 'POST'
  });
  setPredictions(await res.json());
};
```

### Vue
```javascript
async predict() {
  const res = await fetch('http://localhost:8000/predictions/generate', {
    method: 'POST'
  });
  this.predictions = await res.json();
}
```

### Svelte
```svelte
async function predict() {
  const res = await fetch('http://localhost:8000/predictions/generate', {
    method: 'POST'
  });
  predictions = await res.json();
}
```

### Next.js / API Routes
```javascript
export default async function handler(req, res) {
  const backendRes = await fetch('http://localhost:8000/predictions/generate', {
    method: 'POST'
  });
  res.json(await backendRes.json());
}
```

Ver `EXAMPLE_UI_INTEGRATION.md` para ejemplos completos.

---

## 📚 Documentación

| Archivo | Contenido |
|---------|----------|
| `API_DOCS.md` | Endpoints, parámetros, respuestas |
| `BACKEND_SETUP.md` | Setup, deployment, config |
| `EXAMPLE_UI_INTEGRATION.md` | 5 ejemplos (React, Vue, Svelte, Python, Vanilla JS) |

---

## 🚀 Flujo Típico

```
┌──────────────┐
│ Tu UI        │
└──────┬───────┘
       │
       ├─→ POST /data/load
       │   └─→ ✓ Datos cargados
       │
       ├─→ POST /model/train
       │   └─→ ✓ Modelo entrenado (accuracy 50%)
       │
       ├─→ POST /predictions/generate
       │   └─→ ✓ Predicciones listas
       │
       └─→ POST /quiniela/generate?strategy=balanced
           └─→ ✓ Quiniela: "1,X,2,1,X,1,2,1,X,1"
```

---

## 🛠️ Configuración

### Puerto
```bash
uvicorn api:app --port 8001
```

### Host (accessible desde cualquier IP)
```bash
uvicorn api:app --host 0.0.0.0
```

### Reload (durante desarrollo)
```bash
uvicorn api:app --reload
```

### CORS (Producción)
En `api.py`, línea ~30:
```python
allow_origins=[
    "http://localhost:3000",      # Tu UI
    "https://tudominio.com"       # Tu dominio
]
```

---

## ✅ Checklist antes de Usar

- [ ] Instalaste `requirements_api.txt`
- [ ] Ejecutaste `python api.py`
- [ ] Accediste a `http://localhost:8000/health`
- [ ] Documentación en `http://localhost:8000/docs`
- [ ] Tu UI puede hacer requests a `http://localhost:8000`

---

## 🔐 Security (Producción)

### 1. Deshabilitar CORS wildcard
```python
allow_origins=["https://tu-dominio.com"]
```

### 2. Rate Limiting
```bash
pip install slowapi
```

### 3. Authentication
```python
from fastapi.security import HTTPBearer
security = HTTPBearer()

@app.post("/data/load", dependencies=[Depends(security)])
```

### 4. HTTPS
```bash
uvicorn api:app --ssl-keyfile key.pem --ssl-certfile cert.pem
```

---

## 📊 Response Examples

### Success (200)
```json
{
  "success": true,
  "predictions": [...],
  "total": 10
}
```

### Error (400)
```json
{
  "error": "Primero carga datos con POST /data/load"
}
```

### Error (500)
```json
{
  "error": "Error interno del servidor"
}
```

---

## 🐛 Troubleshooting

### "Connection refused"
```bash
# Verifica servidor running
python api.py

# Check en browser
http://localhost:8000/health
```

### "CORS error"
Asegúrate que `allow_origins` incluye tu dominio:
```python
allow_origins=["*"]  # Dev
allow_origins=["https://tu-ui.com"]  # Prod
```

### "Modelo no entrenado"
Debes ejecutar en orden:
1. POST /data/load ✓
2. POST /model/train ✓
3. POST /predictions/generate

### "Próxima jornada no disponible"
Espera a que publique calendario.

---

## 📈 Performance

| Operación | Tiempo |
|-----------|--------|
| Health check | <10ms |
| Load data | 2-5s |
| Train model | 5-10s |
| Predict | <500ms |
| Quiniela | <100ms |

---

## 🌐 Deployment

### Heroku
```bash
# Procfile
web: uvicorn api:app --host 0.0.0.0 --port $PORT

# Deploy
git push heroku main
```

### Docker
```dockerfile
FROM python:3.12
COPY requirements_api.txt .
RUN pip install -r requirements_api.txt
COPY . .
CMD ["uvicorn", "api:app", "--host", "0.0.0.0"]
```

### Railway / Render
Variables de entorno:
```
PYTHON_VERSION=3.12
```

---

## 📞 API Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 400 | Bad Request (datos no cargados, etc) |
| 500 | Server Error |

---

## 🎓 Propósito Educativo

Este backend te enseña:

✓ Cómo crear APIs REST con FastAPI
✓ Pydantic para validación de datos
✓ CORS para integración con UIs
✓ Manejo robusto de errores
✓ Documentación automática (Swagger)
✓ Deployment en producción

---

## 🔗 Integración Rápida

```javascript
// Tu UI solo necesita esto:
const API = 'http://localhost:8000';

async function loadAndPredict() {
  // Cargar
  await fetch(`${API}/data/load`, { method: 'POST' });
  
  // Entrenar
  await fetch(`${API}/model/train`, { method: 'POST' });
  
  // Predecir
  const res = await fetch(`${API}/predictions/generate`, { method: 'POST' });
  const data = await res.json();
  
  // Usar predicciones
  console.log(data.predictions);
}
```

---

## 📝 Documentación Interactiva

Abre en browser después de ejecutar `python api.py`:

```
http://localhost:8000/docs
```

Puedes:
- ✅ Ver todos los endpoints
- ✅ Probar llamadas directamente
- ✅ Ver ejemplos de respuestas
- ✅ Descargar OpenAPI JSON

---

## 🎯 Next Steps

### Para hacer tu UI:

1. **Lee** `API_DOCS.md` (endpoints completos)
2. **Ve ejemplos** en `EXAMPLE_UI_INTEGRATION.md`
3. **Elige framework** (React, Vue, etc)
4. **Conecta** a `http://localhost:8000`
5. **Done!**

---

## 💪 Ready to Go

```bash
python api.py
```

Backend corriendo. **Ahora haz tu UI con Claude Design! 🎨**

---

**Questions?** Check `API_DOCS.md` or `EXAMPLE_UI_INTEGRATION.md`

¡Backend profesional listo! 🚀
