# 🤝 Contributing to ML-La-QuinielIA

¡Gracias por tu interés en contribuir! Este documento te guía cómo ayudar.

## 📋 Code of Conduct

- Sé respetuoso
- Fomenta inclusividad
- Enfócate en feedback constructivo
- No toleramos harassment

## 🚀 Cómo Contribuir

### 1. Fork el Repositorio
```bash
git clone https://github.com/TU_USUARIO/ML-La-QuinielIA.git
cd ML-La-QuinielIA
```

### 2. Crea una Rama
```bash
git checkout -b feature/tu-feature-name
# o
git checkout -b bugfix/tu-bug-name
```

### 3. Haz Cambios
- Sigue PEP 8 para Python
- Documenta con docstrings
- Añade tests si es posible

### 4. Commit
```bash
git commit -m "feat: descripción clara de tu cambio"
```

Formato de commit:
- `feat:` Nueva feature
- `fix:` Bug fix
- `docs:` Documentación
- `refactor:` Refactorización
- `test:` Tests
- `chore:` Cambios build/deps

### 5. Push & Pull Request
```bash
git push origin feature/tu-feature-name
```

Abre PR en GitHub con:
- Descripción clara
- Por qué es necesario
- Cómo testearlo

## 📝 Tipos de Contribuciones

### 🐛 Reportar Bugs
1. Verifica que no existe issue similar
2. Incluye steps para reproducir
3. Espera respuesta del equipo

### ✨ Sugerir Features
1. Abre una discussion
2. Describe el use case
3. Explica beneficio

### 📖 Mejorar Documentación
- Typos
- Claridad
- Ejemplos
- Traducciones

### 🧪 Añadir Tests
- Unit tests
- Integration tests
- Test coverage

## 🏗️ Estructura del Proyecto

```
ML-La-QuinielIA/
├── src/              # Código principal
├── api.py            # Backend FastAPI
├── tests/            # Tests (si añades)
├── docs/             # Documentación
└── README.md         # Inicio
```

## 💻 Setup Desarrollo

```bash
# Clone
git clone https://github.com/TU_USUARIO/ML-La-QuinielIA.git
cd ML-La-QuinielIA

# Venv
python -m venv venv
source venv/bin/activate  # o venv\Scripts\activate en Windows

# Deps
pip install -r requirements.txt
pip install -r requirements_api.txt

# Dev deps (si necesitas)
pip install pytest black flake8 mypy

# Verifica
python VERIFY_SETUP.py
python api.py
```

## 🧪 Testing

```bash
# Correr tests
pytest

# Con coverage
pytest --cov=src

# Lint
flake8 src/
black src/
```

## 📚 Documentación

- README.md: Overview
- docs/: Documentación detallada
- Docstrings: En el código
- API_DOCS.md: API REST

## 🎯 Áreas donde Podemos Mejorar

- [ ] Tests unitarios
- [ ] Integración con más ligas
- [ ] UI oficial
- [ ] Deep Learning models
- [ ] Datos de lesionados
- [ ] Ensambles de modelos
- [ ] Documentación en español

## 🐍 Estilo de Código

### Python
```python
# ✓ Bueno
def predict_match(home: str, away: str, confidence_threshold: float = 0.5) -> Dict:
    """Predice resultado de un partido."""
    # código
    return result

# ✗ Malo
def predict_match(home,away,t=0.5):
    # código sin docstring
    return result
```

### Commits
```bash
# ✓ Bueno
git commit -m "feat: add quiniela strategies with confidence thresholds"

# ✗ Malo
git commit -m "fix stuff"
```

## 🚀 Release Process

1. Bump version en `__init__.py`
2. Update CHANGELOG.md
3. Create GitHub release
4. Publish to PyPI (futuro)

## 📞 Preguntas?

- GitHub Issues: Bugs y features
- Discussions: Preguntas generales
- Email: rubén@example.com

## 🙏 Thank You!

¡Gracias por contribuir a ML-La-QuinielIA! 

---

**Happy Coding! ⚽🤖**
