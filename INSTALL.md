# 📥 Instalación - La QuinielIA

Guía paso a paso para instalar y ejecutar el proyecto.

---

## ✅ Requisitos Previos

### 1. Python 3.10+

**Verifica si lo tienes:**
```powershell
python --version
```

**Si no lo tienes:**
1. Ve a https://python.org/downloads/
2. Descarga Python 3.11 o 3.12
3. **IMPORTANTE:** Marca "Add Python to PATH" durante la instalación
4. Reinicia tu computadora

---

### 2. Node.js 18+ (para Frontend)

**Verifica si lo tienes:**
```powershell
node --version
npm --version
```

**Si no lo tienes:**
1. Ve a https://nodejs.org/
2. Descarga la versión LTS (18+)
3. Instala normalmente
4. Reinicia tu computadora

---

### 3. Conda (para Backend)

**Verifica si lo tienes:**
```powershell
conda --version
```

**Si no lo tienes:**
1. Ve a https://www.anaconda.com/
2. Descarga Anaconda
3. Instala (marca "Add Anaconda to PATH")
4. Reinicia tu computadora

---

## 🚀 Setup Completo

### Paso 1: Crear Conda Environment

```powershell
# Abre PowerShell o CMD
conda create -n quiniela python=3.11 -y
conda activate quiniela
```

### Paso 2: Instalar Dependencias Backend

```powershell
# Asegúrate que conda está activado
conda activate quiniela

# Desde la carpeta raíz (quiniela/)
pip install -r requirements_api.txt
```

### Paso 3: Instalar Dependencias Frontend

```powershell
# Abre UNA NUEVA terminal (no la misma de arriba)
cd frontend
npm install
```

### Paso 4: Configurar Variables de Entorno

**Backend** (`quiniela/.env`):
```
FOOTBALL_DATA_API_KEY=tu_api_key_aqui
LEAGUE_CODE=PD
```

Obtén tu API key gratis: https://www.football-data.org/client/register

**Frontend** (`frontend/.env`):
```
VITE_API_URL=http://localhost:8000
```

---

## ▶️ Ejecutar la Aplicación

### Opción A: Scripts Automáticos (Recomendado)

**Primera vez:**
```powershell
cd frontend
.\setup.bat
```

**Después:**
```powershell
# Desde la carpeta raíz
.\start-all.bat
```

Esto abre 2 ventanas automáticamente.

---

### Opción B: Manual (Si los scripts no funcionan)

**Terminal 1: Backend**
```powershell
conda activate quiniela
python api.py
```

Deberías ver:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

**Terminal 2: Frontend**
```powershell
cd frontend
npm run dev
```

Deberías ver:
```
VITE v5.0.0  ready in XXX ms

➜  Local:   http://localhost:3000/
```

---

## 🌐 Verificar que Funciona

### Backend
Abre en tu navegador: http://localhost:8000/docs

Deberías ver Swagger UI con los endpoints de la API.

### Frontend
Abre en tu navegador: http://localhost:3000

Deberías ver el dashboard de La QuinielIA.

---

## 🐛 Troubleshooting

### "Python no encontrado"
```powershell
# Verifica que se instaló correctamente
python --version

# Si no funciona, reinstala desde https://python.org/
# IMPORTANTE: Marca "Add to PATH"
```

### "Node.js no encontrado"
```powershell
node --version

# Si no funciona, reinstala desde https://nodejs.org/
```

### "npm ERR! code ERESOLVE"
```powershell
cd frontend
npm install --legacy-peer-deps
npm run dev
```

### "Port 8000 ya en uso"
```powershell
# Backend en puerto diferente
python api.py --port 8001
```

### "Port 3000 ya en uso"
```powershell
cd frontend
npm run dev -- --port 3001
```

### Script .bat se cierra sin errores

**Solución:**
```powershell
# Abre PowerShell como ADMINISTRADOR
# Ejecuta:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Intenta de nuevo
```

### "Module not found" en npm

```powershell
cd frontend
rm package-lock.json
npm cache clean --force
npm install
npm run dev
```

### Conda no funciona

```powershell
# Cierra todas las terminales
# Abre UNA NUEVA
# Ejecuta:
conda activate quiniela
```

---

## 📋 Checklist Final

- [ ] Python 3.10+ instalado (`python --version`)
- [ ] Node.js 18+ instalado (`node --version`)
- [ ] Conda instalado (`conda --version`)
- [ ] Conda environment creado (`conda activate quiniela`)
- [ ] Backend dependencias instaladas (`pip install -r requirements_api.txt`)
- [ ] Frontend dependencias instaladas (`npm install`)
- [ ] `.env` creado en backend
- [ ] `.env` creado en frontend
- [ ] Backend corre en `http://localhost:8000`
- [ ] Frontend corre en `http://localhost:3000`

---

## 🎯 Próximos Pasos

Una vez todo funciona:

1. Ve a http://localhost:3000
2. Haz click en "Cargar Datos"
3. Entrena el modelo
4. Genera predicciones

---

## 💡 Tips

- **Mantén ambas terminales abiertas** (backend + frontend)
- **Nuevas instalaciones de Python/Node:** Reinicia tu computadora
- **Problemas persistentes:** Usa `check-install.bat` para diagnosticar
- **Logs útiles:** Revisa lo que dice la terminal, muchos errores se explican solos

---

**¿Aún hay problemas? Cuéntame qué error específico ves.** 👍
