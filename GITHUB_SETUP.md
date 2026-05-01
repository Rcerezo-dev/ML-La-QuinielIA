# 🚀 GitHub Setup - ML-La-QuinielIA

**Instrucciones para subir tu repositorio local a GitHub**

---

## 1️⃣ Crear Repositorio en GitHub

### Opción A: Desde GitHub Web
1. Ve a https://github.com/new
2. **Repository name**: `ML-La-QuinielIA`
3. **Description**: "🤖 Machine Learning predictor para resultados de LaLiga con REST API"
4. **Public** (para que otros lo vean)
5. **NO marques** "Initialize with README" (ya tienes)
6. Click **Create repository**

### Opción B: GitHub CLI
```bash
gh repo create ML-La-QuinielIA --public --source=. --remote=origin --push
```

---

## 2️⃣ Conectar Repositorio Local

Si ya creaste repo en GitHub:

```bash
# En tu carpeta local
cd C:\Users\Ruben\Documents\Projects\quiniela

# Añade el remote
git remote add origin https://github.com/TU_USUARIO/ML-La-QuinielIA.git

# Renombra rama master a main (estándar en GitHub)
git branch -M main

# Push inicial
git push -u origin main
```

---

## 3️⃣ Verificar en GitHub

Abre: `https://github.com/TU_USUARIO/ML-La-QuinielIA`

Deberías ver:
- ✅ 10 commits
- ✅ Todos los archivos
- ✅ README.md como página principal
- ✅ Licencia MIT
- ✅ 🌟 Button para star (pide a amigos 😉)

---

## 4️⃣ Configuración Adicional (Opcional)

### Proteger rama main
Settings → Branches → Add rule:
- Branch name pattern: `main`
- Require pull request reviews
- Require status checks

### Topics (tags para descubrimiento)
En repo settings, añade:
- `machine-learning`
- `football`
- `laliga`
- `python`
- `fastapi`
- `rest-api`

### Social Preview
Settings → Social Preview → Upload image
(Añade screenshot de la UI cuando la hagas)

---

## 5️⃣ Flujo de Trabajo Futuro

### Para desarrollar features nuevas

```bash
# 1. Crea rama
git checkout -b feature/mi-feature

# 2. Haz cambios
# (edita archivos)

# 3. Commit
git add .
git commit -m "feat: descripción de tu feature"

# 4. Push
git push origin feature/mi-feature

# 5. Open Pull Request en GitHub
# (GitHub te mostrará opción "Compare & pull request")
```

### Para recibir cambios de otros

```bash
# Alguien hizo un PR y fue merged
# Actualiza tu local:
git fetch origin
git pull origin main
```

---

## 6️⃣ Badges para README

Añade estos badges al inicio del README.md:

```markdown
# ML-La-QuinielIA

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.12](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green.svg)](https://fastapi.tiangolo.com/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.3-orange.svg)](https://scikit-learn.org/)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](CONTRIBUTING.md)

🤖 Machine Learning predictor para resultados de LaLiga...
```

---

## 7️⃣ Publicar Releases

Cuando tengas versión estable:

```bash
# Tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

O desde GitHub:
1. Releases → Draft a new release
2. Tag: `v1.0.0`
3. Title: `Version 1.0.0`
4. Description: (lo que cambió)
5. Publish

---

## 📊 GitHub Status

Comando para ver status remoto:

```bash
git status
git remote -v
git log --oneline --all
```

---

## 🆘 Troubleshooting

### "fatal: 'origin' does not appear to be a 'git' repository"
```bash
git remote add origin https://github.com/TU_USUARIO/ML-La-QuinielIA.git
```

### "Permission denied (publickey)"
```bash
# Configura SSH keys
ssh-keygen -t ed25519 -C "r.cerezo26@gmail.com"
# Añade public key a GitHub settings
```

### "conflicts on merge"
```bash
git pull origin main
# Resuelve conflictos manualmente
git add .
git commit -m "resolve: merge conflicts"
git push origin main
```

---

## 🎯 Next Steps

1. ✅ Crea repo en GitHub
2. ✅ Push inicial
3. ✅ Verifica en web
4. ✅ Comparte URL con amigos
5. 🎨 Cuando tengas UI lista, actualiza repo
6. 📦 Considera publicar en PyPI (futuro)

---

## 📝 URL del Repo

Después de crear:
```
https://github.com/TU_USUARIO/ML-La-QuinielIA
```

Comparte este link con:
- Amigos
- GitHub profile
- Portfolio
- Twitter/X
- LinkedIn

---

## ⭐ Promoción

```
🚀 ML-La-QuinielIA - ML predictor para LaLiga
🤖 Backend REST API + ML Model
⚽ Predice resultados con 50%+ accuracy
🔌 Listo para conectar cualquier UI
📚 Documentación completa

GitHub: github.com/TU_USUARIO/ML-La-QuinielIA
```

---

**¡Tu proyecto está en GitHub! 🎉**

Ahora comparte y sigue desarrollando 🚀
