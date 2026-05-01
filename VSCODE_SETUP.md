# 🔧 VSCode Setup - ML-La-QuinielIA

**VSCode está mostrando rama equivocada. Aquí cómo arreglarlo.**

---

## 🚨 EL PROBLEMA

```
VSCode muestra:  rama "finetuning"
Debería mostrar: rama "main" (ML-La-QuinielIA)
```

---

## ✅ SOLUCIÓN

### Opción 1: Cambiar de Rama en VSCode (FÁCIL)

1. **Abre VSCode**
2. **Abajo a la izquierda**, haz click donde dice `finetuning`
3. **Selecciona:** `main`
4. **Listo!** Ahora estás en rama `main` (ML-La-QuinielIA)

Alternativa atajo: `Ctrl+Shift+P` → "Git: Checkout to..."

---

### Opción 2: Abrir Carpeta Correcta

Si VSCode sigue mostrando lo incorrecto:

1. **File → Open Folder**
2. Navega a: `C:\Users\Ruben\Documents\Projects\quiniela`
3. **Select Folder**
4. **Listo!** VSCode ahora está en el proyecto correcto

---

## 📋 VERIFICAR EN VSCODE

Abajo a la izquierda deberías ver:

```
✅ main (rama actual)
```

NO debería ser:

```
❌ finetuning
```

---

## 🌳 DIFERENCIA DE RAMAS

### `finetuning` (otra rama)
- Proyecto anterior
- No es ML-La-QuinielIA
- Ignora esta rama

### `main` (NUESTRA RAMA)
- ML-La-QuinielIA
- 15 commits
- Nuestro proyecto
- **ESTA ES LA QUE QUEREMOS**

---

## 🎯 DESPUÉS DE CAMBIAR

Cuando estés en `main`, en VSCode deberías ver:

```
📁 quiniela (carpeta)
├── src/
├── api.py
├── app.py
├── README.md
├── [archivos del proyecto]
└── .git
```

---

## 🆘 SI SIGUE SIN FUNCIONAR

```bash
# En terminal, verifica que estés en rama main
git branch

# Resultado correcto:
# * main
#   finetuning

# Si estás en finetuning:
git checkout main

# Verifica again
git branch
```

---

## ✨ RESUMEN

| Aspecto | Valor |
|---------|-------|
| **Carpeta correcta** | `C:\Users\Ruben\Documents\Projects\quiniela` |
| **Rama correcta** | `main` |
| **Proyecto** | ML-La-QuinielIA |
| **Commits** | 15 |
| **Estado** | Listo para GitHub |

---

**Ahora VSCode mostrará el proyecto correcto! ✅**
