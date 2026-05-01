# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto respeta [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added
- ✨ Backend REST API con FastAPI
- 🎯 14 endpoints completamente documentados
- 📊 Feature engineering con 30+ variables predictivas
- 🧠 Modelo Random Forest entrenado y evaluado
- 🔮 Generador de predicciones con probabilidades
- 🎲 3 estrategias de quiniela (conservadora, arriesgada, segura)
- 📚 Documentación completa (6 guías)
- 🎨 Ejemplos de integración (React, Vue, Svelte, Python, Vanilla JS)
- 🔌 CORS habilitado para cualquier UI
- ✅ VERIFY_SETUP.py para diagnóstico automático
- 🐍 CLI alternativa (scripts/predict.py)
- 📱 7 ejemplos de uso programático

### Features Principales
- Descarga automática de datos desde football-data.org API
- Análisis de últimas 5 jornadas
- Próxima jornada predicha
- Clasificación actual
- Feature importance visualization
- Métricas de evaluación detalladas
- Error handling robusto

### Documentation
- START_HERE.md (guía de inicio)
- QUICKSTART.md (5 minutos setup)
- INSTALL_WINDOWS.md (Windows específico)
- ARCHITECTURE.md (diseño técnico)
- CHEATSHEET.md (referencia rápida)
- API_DOCS.md (endpoints detallados)
- BACKEND_README.md (backend overview)
- EXAMPLE_UI_INTEGRATION.md (5 frameworks)
- BACKEND_SETUP.md (setup & deployment)

### Technical Stack
- Python 3.12
- FastAPI (REST API)
- Streamlit (UI original, opcional)
- scikit-learn (ML)
- pandas (Data)
- Plotly (Visualizations)

---

## [0.1.0] - 2024-01-14

### Initial Development
- Setup inicial del proyecto
- Estructura profesional de carpetas
- Modelos base de componentes
- Configuración CI/CD básica

---

## Unreleased

### Planned Features
- [ ] Soporte para múltiples ligas (Premier, Serie A, Bundesliga)
- [ ] Ensambles de modelos (XGBoost, LightGBM)
- [ ] Deep Learning (LSTM)
- [ ] Integración con datos de lesionados
- [ ] API de odds
- [ ] Dashboard mejorado
- [ ] Tests unitarios
- [ ] Docker image
- [ ] PyPI package
- [ ] App móvil (React Native)

---

## Notas

### Versionado
- MAJOR: Cambios incompatibles (breaking changes)
- MINOR: Nuevas features compatibles
- PATCH: Bug fixes

### Branch Strategy
- `main`: Versiones estables (releases)
- `develop`: Desarrollo activo
- `feature/*`: Nuevas features
- `bugfix/*`: Bug fixes

---

**Última actualización:** 2024-01-15
**Maintainer:** Rubén Cerezo
