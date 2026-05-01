import os
import json
from pathlib import Path
from typing import Dict, List, Any
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_project_paths() -> Dict[str, Path]:
    """Retorna diccionario con rutas del proyecto."""
    base = Path(__file__).parent.parent
    return {
        'base': base,
        'data_raw': base / 'data' / 'raw',
        'data_processed': base / 'data' / 'processed',
        'models': base / 'models',
    }


def create_directories():
    """Crea estructura de directorios necesarios."""
    paths = get_project_paths()
    for path in paths.values():
        path.mkdir(parents=True, exist_ok=True)
    logger.info("Directorios creados/verificados")


def save_json(data: Any, filepath: str) -> None:
    """Guarda datos en JSON."""
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    logger.info(f"Guardado: {filepath}")


def load_json(filepath: str) -> Any:
    """Carga datos desde JSON."""
    if not os.path.exists(filepath):
        logger.warning(f"Archivo no encontrado: {filepath}")
        return None
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)


def format_date(date_str: str) -> str:
    """Formatea fecha ISO a formato legible."""
    try:
        dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        return dt.strftime('%d/%m/%Y %H:%M')
    except:
        return date_str


def get_team_name(team_dict: Dict) -> str:
    """Extrae nombre del equipo desde dict."""
    return team_dict.get('name', 'Unknown')


def categorize_result(home_goals: int, away_goals: int) -> str:
    """Categoriza resultado: 1 (local), X (empate), 2 (visitante)."""
    if home_goals > away_goals:
        return '1'
    elif home_goals == away_goals:
        return 'X'
    else:
        return '2'


def validate_prediction(pred: str) -> str:
    """Valida que predicción sea válida."""
    if pred not in ['1', 'X', '2']:
        raise ValueError(f"Predicción inválida: {pred}. Debe ser 1, X o 2")
    return pred
