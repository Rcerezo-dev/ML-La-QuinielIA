# 🚀 QuickStart - LaLiga Predictor

Levanta la aplicación en 5 minutos.

## 1. API Key (GRATIS)

Ve a: https://www.football-data.org/client/register
- Regístrate con tu email
- Copia tu API Key

## 2. Setup

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

## 3. Instalar Dependencias

```bash
pip install -r requirements.txt
```

## 4. Configurar

Renombra `.env.example` a `.env` y pega tu API key:

```
FOOTBALL_DATA_API_KEY=your_key_here
LEAGUE_CODE=PD
TEST_SIZE=0.2
RANDOM_STATE=42
```

## 5. Ejecutar

### Opción A: Web UI (RECOMENDADO) 🎨
```bash
streamlit run app.py
```

Abre: http://localhost:8501

Workflow:
1. Click "📥 Cargar Datos"
2. Click "🧠 Entrenar Modelo"  
3. Click "🔮 Generar Predicciones"
4. Elige estrategia (conservadora/arriesgada/segura)

### Opción B: CLI 📟
```bash
python scripts/predict.py
```

## 6. Ejemplos de Uso

```bash
# Ejecutar ejemplos
python examples/basic_usage.py 1  # Pipeline básico
python examples/basic_usage.py 3  # Múltiples estrategias
python examples/basic_usage.py 4  # Análisis modelo
```

## 🆘 Problemas Comunes

### ❌ "API Key invalid"
- Verifica `.env` existe
- Verifica API key correcta en https://www.football-data.org/client
- Espera 5 minutos después de registrarte

### ❌ "Module not found"
```bash
pip install --upgrade -r requirements.txt
```

### ❌ "No future matches"
- La liga tiene pause de descanso
- Espera a que publique próxima jornada

### ❌ Puerto 8501 ocupado
```bash
streamlit run app.py --server.port=8502
```

## 📊 Esperado

**Primera ejecución:**
- ✅ Descarga datos: 2-5 segundos
- ✅ Entrena modelo: 5-10 segundos
- ✅ Predicciones: <1 segundo
- ✅ Accuracy: 45-55% (fútbol es caótico)

**Próximas ejecuciones:**
- Más rápido (datos en caché)

## 🎯 Flujo Básico

```
API (football-data.org)
    ↓
[Últimas 5 jornadas]
    ↓
[Feature Engineering]
    ↓
[Modelo ML - Random Forest]
    ↓
[Próxima jornada] → [Predicciones + Probabilidades]
    ↓
[3 Estrategias de Quiniela]
    ↓
[Resultado: 1, X, o 2]
```

## 💡 Tips

- **Primer uso**: Carga datos → Entrena → Predice (todo automático)
- **Usa conservadora**: Mejor para apuestas reales
- **Mira confianza**: Siempre > 40%
- **Reentrenamiento**: Semanal (nueva jornada = más datos)

## 📚 Más Info

Ver `README.md` para documentación completa

---

**¿Listo?** ⚽ Empieza con: `streamlit run app.py`
