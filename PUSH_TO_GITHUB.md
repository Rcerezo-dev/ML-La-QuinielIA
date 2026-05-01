# 🚀 Push to GitHub - ML-La-QuinielIA

**Tu repositorio local está completamente commiteado. Ahora súbelo a GitHub en 3 pasos.**

---

## ⚡ Opción Rápida (Recomendado)

### 1️⃣ Crea Repositorio en GitHub

Ve a: **https://github.com/new**

**Llena el formulario:**
- **Repository name:** `ML-La-QuinielIA`
- **Description:** `🤖 Machine Learning predictor para LaLiga con REST API`
- **Public** (marcar)
- **NO marques** "Initialize with README" (ya tienes commits)
- Click **Create repository**

**Resultado:** Te mostrará algo como:
```
https://github.com/TU_USUARIO/ML-La-QuinielIA
```

---

### 2️⃣ Ejecuta Estos Comandos

Copia y pega en PowerShell/Terminal:

```bash
# Renombra rama master a main (estándar GitHub)
git branch -M main

# Añade el remote
git remote add origin https://github.com/TU_USUARIO/ML-La-QuinielIA.git

# Push inicial
git push -u origin main
```

**REEMPLAZA `TU_USUARIO` con tu username de GitHub**

---

### 3️⃣ Verifica en GitHub

Abre en browser:
```
https://github.com/TU_USUARIO/ML-La-QuinielIA
```

Deberías ver:
- ✅ 14 commits
- ✅ Todos los archivos
- ✅ README.md como home
- ✅ Licencia MIT
- ✅ .gitignore funcionando

---

## 🔑 Si Necesitas SSH Key

Si te pide autenticación:

### GitHub CLI (MÁS FÁCIL)

```bash
# Instala: https://cli.github.com

# Autentica
gh auth login

# Sigue instrucciones en pantalla
```

### SSH Manual

```bash
# Genera SSH key
ssh-keygen -t ed25519 -C "r.cerezo26@gmail.com"

# Copia la key pública
cat ~/.ssh/id_ed25519.pub

# En GitHub: Settings → SSH Keys → Add Key
# Pega el contenido

# Test
ssh -T git@github.com
```

---

## 📋 Comando Completo (Copy-Paste)

```bash
git branch -M main
git remote add origin https://github.com/TU_USUARIO/ML-La-QuinielIA.git
git push -u origin main
```

**Solo cambia `TU_USUARIO` con tu username**

---

## ✅ Verificar que Funcionó

```bash
# Ver remotes configurados
git remote -v

# Debería mostrar:
# origin  https://github.com/TU_USUARIO/ML-La-QuinielIA.git (fetch)
# origin  https://github.com/TU_USUARIO/ML-La-QuinielIA.git (push)
```

---

## 🎯 Después de Pushear

### Añade Topics (Tags)
En GitHub, Settings → Add topics:
- `machine-learning`
- `football`
- `laliga`
- `python`
- `fastapi`
- `rest-api`

### Añade Social Preview
Settings → Social preview → Upload image
(Futura screenshot de tu UI)

### Comparte el Link
```
https://github.com/TU_USUARIO/ML-La-QuinielIA
```

Comparte en:
- Twitter/X
- LinkedIn
- Portfolio
- Amigos

---

## 🆘 Troubleshooting

### "fatal: remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/TU_USUARIO/ML-La-QuinielIA.git
git push -u origin main
```

### "Permission denied (publickey)"
Necesitas configurar SSH key:
```bash
ssh-keygen -t ed25519
# Copia y pega en GitHub Settings → SSH Keys
```

### "fatal: 'origin' does not appear to be a 'git' repository"
```bash
# Verifica que estés en la carpeta correcta
pwd
git remote -v
git remote add origin https://github.com/TU_USUARIO/ML-La-QuinielIA.git
```

### "Everything up-to-date"
Todo está bien. Ya está en GitHub.

---

## 📊 Estado Actual

```bash
# Ver status
git status

# Ver remote
git remote -v

# Ver commits
git log --oneline -5
```

---

## 🎉 ¡Listo!

Después de pushear tendrás:
- ✅ Repositorio en GitHub público
- ✅ 14 commits visibles
- ✅ Toda la documentación
- ✅ Código compartible
- ✅ Portfolio project

---

**Una vez hayas hecho push, el proyecto estará público y compartible! 🚀**

```
https://github.com/TU_USUARIO/ML-La-QuinielIA
```
