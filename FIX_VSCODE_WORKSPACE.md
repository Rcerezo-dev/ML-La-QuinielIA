# 🔧 Fix VSCode Workspace - ML-La-QuinielIA

**VSCode está mostrando ramas de otro proyecto. Aquí cómo arreglarlo.**

---

## 🚨 EL PROBLEMA

```
Hay 2 repositorios diferentes en Projects/:

1. job_agent/
   └── .git (rama: master, tiene "finetuning")
   
2. quiniela/ (NUESTRO PROYECTO)
   └── .git (rama: main, ML-La-QuinielIA)

VSCode abre AMBOS, por eso muestra ramas equivocadas
```

---

## ✅ SOLUCIÓN (ELEGIR UNA)

### Opción 1: RECOMENDADO - Abrir Solo Nuestro Repo

**Lo más fácil:**

1. **Abre VSCode**
2. **File → Close Folder** (cierra todo)
3. **File → Open Folder**
4. **Navega a:** `C:\Users\Ruben\Documents\Projects\quiniela`
5. **Click Select Folder**
6. ✅ **Listo!** Ahora VSCode SOLO abre ML-La-QuinielIA

### Opción 2: Crear Workspace Dedicado

**Si quieres tener ambos proyectos pero organizados:**

1. **Abre VSCode en carpeta quiniela** (ver Opción 1)
2. **File → Save Workspace As...**
3. **Nombre:** `ML-La-QuinielIA.code-workspace`
4. **Guarda en:** `C:\Users\Ruben\Documents\Projects\quiniela\`
5. **Close folder**
6. **File → Open Workspace from File...**
7. **Selecciona:** `ML-La-QuinielIA.code-workspace`
8. ✅ **Listo!** Ahora siempre abre el workspace correcto

### Opción 3: Limpiar Workspace Existente

**Si VSCode ya tiene un workspace (advanced):**

1. **En VSCode:** File → Preferences → Settings
2. **Busca:** "workspace"
3. **Busca archivo:** `.code-workspace`
4. **Edítalo y deja SOLO:**
   ```json
   {
     "folders": [
       {
         "path": "C:\\Users\\Ruben\\Documents\\Projects\\quiniela"
       }
     ]
   }
   ```
5. **Guarda y reinicia VSCode**

---

## ✨ DESPUÉS DE ARREGLARLO

### En VSCode abajo a la izquierda deberías ver:

```
✅ main (rama ML-La-QuinielIA)
```

NO deberías ver:

```
❌ finetuning o master (ramas de otros proyectos)
```

### En el explorador deberías ver:

```
📁 quiniela
├── src/
├── api.py
├── app.py
├── README.md
├── requirements.txt
├── .git
└── [37 archivos]
```

NO deberías ver:

```
❌ job_agent/ o Keepcoding/ (otros proyectos)
```

---

## 📋 VERIFICAR ESTADO

```bash
# En terminal (en la carpeta quiniela):
git branch

# Resultado correcto:
# * main
#   (sin finetuning)
```

---

## 🎯 RESUMIDO

| Antes | Después |
|-------|---------|
| ❌ VSCode abre 2 repos | ✅ VSCode abre solo quiniela |
| ❌ Rama: finetuning (equivocada) | ✅ Rama: main (correcta) |
| ❌ Confusión de proyectos | ✅ Todo claro y organizado |

---

## 💡 CONSEJO

**Guarda este workspace:**

1. **File → Save Workspace As...**
2. **Nombre:** `ML-La-QuinielIA.code-workspace`
3. **Ubicación:** En la carpeta raíz del proyecto
4. **Próximas veces:** Abre ese archivo en VSCode
5. ✅ **Siempre abrirá el proyecto correcto**

---

**¡Ahora VSCode estará limpio y solo mostrará tu proyecto! ✅**
