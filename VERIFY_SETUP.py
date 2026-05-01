"""
Script de verificación de setup.
Comprueba que todo está instalado y configurado correctamente.
Uso: python VERIFY_SETUP.py
"""

import sys
import os
from pathlib import Path

print("\n" + "="*60)
print("✓ VERIFICACIÓN DE SETUP - LaLiga Predictor")
print("="*60)

checks = []

# 1. Python Version
print("\n1️⃣ Python Version...")
version = sys.version_info
if version.major == 3 and version.minor >= 8:
    print(f"   ✓ Python {version.major}.{version.minor}.{version.micro}")
    checks.append(True)
else:
    print(f"   ✗ Python {version.major}.{version.minor} (requiere 3.8+)")
    checks.append(False)

# 2. Virtual Environment
print("\n2️⃣ Entorno Virtual...")
in_venv = hasattr(sys, 'real_prefix') or (
    hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix
)
if in_venv:
    print(f"   ✓ Venv activado: {sys.prefix}")
    checks.append(True)
else:
    print(f"   ⚠️ No venv activado (recomendado: venv\\Scripts\\activate)")
    checks.append(False)

# 3. Dependencias
print("\n3️⃣ Librerías...")
required = {
    'pandas': 'pandas',
    'numpy': 'numpy',
    'sklearn': 'scikit-learn',
    'requests': 'requests',
    'bs4': 'beautifulsoup4',
    'streamlit': 'streamlit',
    'joblib': 'joblib',
    'dotenv': 'python-dotenv',
    'xgboost': 'xgboost',
    'plotly': 'plotly',
    'seaborn': 'seaborn',
}

missing = []
for module, package in required.items():
    try:
        __import__(module)
        print(f"   ✓ {package}")
    except ImportError:
        print(f"   ✗ {package} (falta)")
        missing.append(package)

checks.append(len(missing) == 0)

if missing:
    print(f"\n   Para instalar: pip install {' '.join(missing)}")

# 4. Estructura de carpetas
print("\n4️⃣ Estructura de Carpetas...")
base = Path(__file__).parent
required_dirs = [
    'src',
    'data',
    'models',
    'scripts',
    'examples',
]

missing_dirs = []
for dir_name in required_dirs:
    dir_path = base / dir_name
    if dir_path.exists():
        print(f"   ✓ {dir_name}/")
    else:
        print(f"   ✗ {dir_name}/ (falta)")
        missing_dirs.append(dir_name)

checks.append(len(missing_dirs) == 0)

# 5. Archivos críticos
print("\n5️⃣ Archivos Críticos...")
required_files = [
    'app.py',
    'requirements.txt',
    'README.md',
    'src/__init__.py',
    'src/scraper.py',
    'src/features.py',
    'src/trainer.py',
    'src/predictor.py',
    'src/utils.py',
    'src/config.py',
]

missing_files = []
for file_name in required_files:
    file_path = base / file_name
    if file_path.exists():
        print(f"   ✓ {file_name}")
    else:
        print(f"   ✗ {file_name} (falta)")
        missing_files.append(file_name)

checks.append(len(missing_files) == 0)

# 6. Configuración .env
print("\n6️⃣ Archivo .env...")
env_path = base / '.env'
env_example_path = base / '.env.example'

if env_path.exists():
    with open(env_path) as f:
        content = f.read()
        if 'FOOTBALL_DATA_API_KEY=' in content:
            has_key = 'your_free_api_key' not in content.lower()
            if has_key:
                print(f"   ✓ .env configurado con API key")
                checks.append(True)
            else:
                print(f"   ⚠️ .env tiene placeholder (necesitas tu API key)")
                print(f"      Registrate en: https://www.football-data.org/client/register")
                checks.append(False)
        else:
            print(f"   ✗ FOOTBALL_DATA_API_KEY no encontrado en .env")
            checks.append(False)
elif env_example_path.exists():
    print(f"   ⚠️ Necesitas renombrar .env.example a .env")
    print(f"      y añadir tu API key")
    checks.append(False)
else:
    print(f"   ⚠️ .env no encontrado (necesarias variables de entorno)")
    checks.append(False)

# 7. Importes
print("\n7️⃣ Verificación de Importes...")
try:
    sys.path.insert(0, str(base))
    from src.scraper import LaLigaScraper
    from src.trainer import ModelTrainer
    from src.predictor import Predictor
    from src.features import FeatureEngineer
    print(f"   ✓ Todos los módulos importan correctamente")
    checks.append(True)
except Exception as e:
    print(f"   ✗ Error al importar: {e}")
    checks.append(False)

# 8. Directorios de datos
print("\n8️⃣ Directorios de Datos...")
data_dirs = ['data/raw', 'data/processed', 'models']
for dir_name in data_dirs:
    dir_path = base / dir_name
    dir_path.mkdir(parents=True, exist_ok=True)
    print(f"   ✓ {dir_name} (creado si no existía)")

checks.append(True)

# Resumen
print("\n" + "="*60)
passed = sum(checks)
total = len(checks)
percentage = (passed / total) * 100

print(f"RESUMEN: {passed}/{total} verificaciones pasadas ({percentage:.0f}%)")

if all(checks):
    print("\n✅ ¡SETUP COMPLETADO CORRECTAMENTE!")
    print("\nPróximos pasos:")
    print("1. Abre terminal en esta carpeta")
    print("2. Activa venv: venv\\Scripts\\activate")
    print("3. Ejecuta: streamlit run app.py")
    print("4. Abre: http://localhost:8501")
    sys.exit(0)
else:
    print("\n⚠️ Se encontraron algunos problemas.")
    print("Revisa los puntos marcados con ✗ o ⚠️")
    sys.exit(1)
