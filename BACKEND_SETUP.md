# 🔌 Backend REST API Setup

**Servidor listo para conectar cualquier UI**

---

## ⚡ Inicio Rápido (2 minutos)

### 1. Instalar
```bash
# Con venv activado
pip install -r requirements_api.txt
```

### 2. Ejecutar
```bash
python api.py
```

### 3. Verificar
Abre: http://localhost:8000/health

Deberías ver:
```json
{"status": "healthy", "timestamp": "2024-01-15T..."}
```

### 4. Docs interactiva
Abre: http://localhost:8000/docs

---

## 🛠️ Uso Básico

### Cargar datos
```bash
curl -X POST http://localhost:8000/data/load
```

### Entrenar modelo
```bash
curl -X POST http://localhost:8000/model/train
```

### Predecir
```bash
curl -X POST http://localhost:8000/predictions/generate
```

### Generar quiniela
```bash
curl -X POST "http://localhost:8000/quiniela/generate?strategy=balanced"
```

---

## 📡 Conectar desde UI

### React
```jsx
const loadData = async () => {
  const res = await fetch('http://localhost:8000/data/load', {
    method: 'POST'
  });
  return await res.json();
};
```

### Vue
```javascript
async loadData() {
  const response = await fetch('http://localhost:8000/data/load', {
    method: 'POST'
  });
  return await response.json();
}
```

### Vanilla JS
```javascript
fetch('http://localhost:8000/data/load', { method: 'POST' })
  .then(r => r.json())
  .then(data => console.log(data));
```

---

## 📚 Documentación Completa

Ver: `API_DOCS.md` para:
- ✅ Todos los endpoints
- ✅ Parámetros y respuestas
- ✅ Ejemplos en JavaScript, React, Python
- ✅ Integración paso a paso

---

## 🚀 Deployment

### Local (desarrollo)
```bash
python api.py
```

### Producción (Heroku)
```bash
# requirements_api.txt incluye uvicorn
# Heroku ejecuta: uvicorn api:app --host 0.0.0.0 --port $PORT

# Procfile (crear si no existe)
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
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
docker build -t laliga-api .
docker run -p 8000:8000 laliga-api
```

---

## 🔧 Configuración

### Puerto
```bash
# Default: 8000
uvicorn api:app --port 8001
```

### Host
```bash
# Localhost solamente (default)
python api.py

# Accesible desde cualquier IP
uvicorn api:app --host 0.0.0.0
```

### Reload (desarrollo)
```bash
uvicorn api:app --reload
```

---

## ✅ Checklist

- [ ] API ejecutándose: `python api.py`
- [ ] Health check OK: `http://localhost:8000/health`
- [ ] Docs visible: `http://localhost:8000/docs`
- [ ] Tu UI conectando a `http://localhost:8000`

---

## 📞 Endpoints Rápidos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Info API |
| GET | `/health` | Health check |
| GET | `/status` | Estado aplicación |
| POST | `/data/load` | Cargar datos |
| GET | `/data/history` | Últimas 5 jornadas |
| GET | `/data/next-matchday` | Próxima jornada |
| POST | `/model/train` | Entrenar modelo |
| GET | `/model/features` | Features importantes |
| GET | `/model/metrics` | Métricas modelo |
| POST | `/predictions/generate` | Generar predicciones |
| GET | `/predictions/latest` | Últimas predicciones |
| POST | `/quiniela/generate` | Generar quiniela |
| GET | `/standings` | Clasificación |
| POST | `/reset` | Reiniciar app |

---

**¡Backend listo para tu UI! 🎨**
