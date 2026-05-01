# 🚀 Quick Start — La QuinielIA

Inicia la aplicación completa en 2 clicks.

---

## ⚡ La Forma Más Fácil

### 1. Setup Inicial (Primera Vez)

Navega a `frontend/` y ejecuta:

```bash
start-dev.bat
```

O en PowerShell:

```powershell
.\frontend\setup.bat
```

Esto:
- ✅ Instala Node.js dependencias
- ✅ Crea `.env` si no existe
- ✅ Verifica la configuración

### 2. Iniciar Todo

Desde la carpeta raíz del proyecto:

```bash
start-all.bat
```

Esto abre **dos ventanas**:
- **Terminal 1**: Backend (FastAPI) en `http://localhost:8000`
- **Terminal 2**: Frontend (React) en `http://localhost:3000`

---

## 📋 Scripts Disponibles

| Script | Ubicación | Función |
|--------|-----------|---------|
| `start-all.bat` | Raíz | Inicia Backend + Frontend en 2 ventanas |
| `start-dev.bat` | `frontend/` | Solo Frontend (dev server) |
| `setup.bat` | `frontend/` | Setup inicial, instala dependencias |

---

## 🔧 Instalación Manual

Si prefieres no usar los `.bat`:

### Backend
```powershell
# Terminal 1
cd quiniela
conda activate quiniela
python api.py
```

### Frontend
```powershell
# Terminal 2
cd frontend
npm install  # Primera vez
npm run dev
```

---

## 🌐 URLs

Una vez iniciados:

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| Swagger | http://localhost:8000/docs |

---

## ✅ Verificación

### ¿Backend funciona?
```powershell
Invoke-WebRequest http://localhost:8000/health
# Deberías ver: {"status":"ok"}
```

### ¿Frontend funciona?
Abre http://localhost:3000 en tu navegador.

---

## 🔑 Configuración

### API Key (Backend)

En `quiniela/.env`:
```
FOOTBALL_DATA_API_KEY=tu_api_key_aqui
```

Obtén una key gratis en: https://www.football-data.org/client/register

### API URL (Frontend)

En `frontend/.env`:
```
VITE_API_URL=http://localhost:8000
```

---

## 🐛 Troubleshooting

### "Node.js no encontrado"
- Descarga: https://nodejs.org/ (v18+)
- Instala
- Reinicia la terminal

### "Python no encontrado"
- Descarga: https://python.org/ (3.10+)
- Instala y marca "Add to PATH"
- Reinicia la terminal

### "Port 3000 ya en uso"
```powershell
# En frontend/:
npm run dev -- --port 3001
```

### "Port 8000 ya en uso"
```powershell
# En quiniela/:
python api.py --port 8001
```

### "Module not found" en npm
```powershell
cd frontend
rm package-lock.json
npm install
```

---

## 📊 Stack Completo

```
Frontend (React 18)
  ├── Vite 5
  ├── Lucide Icons
  └── CSS Variables (Design System)

Backend (FastAPI)
  ├── Python 3.10+
  ├── scikit-learn (ML)
  ├── pandas (Data)
  └── football-data.org API

Data
  └── LaLiga matches & standings
```

---

## 🎯 Próximos Pasos

1. ✅ Inicia con `start-all.bat`
2. ✅ Abre http://localhost:3000
3. ✅ Carga datos con "Cargar Datos"
4. ✅ Entrena el modelo
5. ✅ Genera predicciones

---

## 💡 Tips

- **Desarrollo rápido**: Los `.bat` manejan todo automáticamente
- **Debug API**: Abre http://localhost:8000/docs para ver todos los endpoints
- **Hot Reload**: Frontend recarga automático cuando editas código
- **Logs**: Ambas ventanas muestran logs en tiempo real

---

## 📞 Necesitas Ayuda?

Ver archivos de documentación:
- `README.md` — Descripción general
- `frontend/README.md` — Frontend específico
- `ARCHITECTURE.md` — Diseño del sistema
- `API_DOCS.md` — Documentación de endpoints

---

**¡A disfrutar! ⚽🤖**
