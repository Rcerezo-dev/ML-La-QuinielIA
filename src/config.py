"""
Configuración de ligas y parámetros globales.
Permite extensión a múltiples ligas (LaLiga, Premier, Champions, etc.)
"""

from enum import Enum
from typing import Dict

# Códigos de ligas en football-data.org
LEAGUE_CODES = {
    "LaLiga": "PD",           # Primera División España
    "Premier League": "PL",   # English Premier League
    "Serie A": "SA",          # Italian Serie A
    "Bundesliga": "BL1",      # German Bundesliga
    "Ligue 1": "FL1",         # French Ligue 1
    "Champions League": "CL", # UEFA Champions League
    "Europa League": "EL",    # UEFA Europa League
}

# Configuración por liga
LEAGUE_CONFIG = {
    "LaLiga": {
        "code": "PD",
        "name": "Primera División",
        "country": "España",
        "matchdays_history": 5,
        "total_matchdays": 38,
    },
    "Premier League": {
        "code": "PL",
        "name": "English Premier League",
        "country": "Inglaterra",
        "matchdays_history": 5,
        "total_matchdays": 38,
    },
    "Serie A": {
        "code": "SA",
        "name": "Serie A TIM",
        "country": "Italia",
        "matchdays_history": 5,
        "total_matchdays": 38,
    },
    "Bundesliga": {
        "code": "BL1",
        "name": "Bundesliga",
        "country": "Alemania",
        "matchdays_history": 5,
        "total_matchdays": 34,
    },
}

# Parámetros modelo por defecto
MODEL_PARAMS = {
    "n_estimators": 100,
    "max_depth": 15,
    "min_samples_split": 5,
    "min_samples_leaf": 2,
    "random_state": 42,
    "test_size": 0.2,
}

# Estrategias de quiniela
QUINIELA_STRATEGIES = {
    "balanced": {
        "name": "Conservadora",
        "description": "Apuesta si confianza > 40%",
        "confidence_threshold": 0.40,
        "default_prediction": "1",
    },
    "aggressive": {
        "name": "Arriesgada",
        "description": "Apuesta si confianza > 55%",
        "confidence_threshold": 0.55,
        "default_prediction": "1",
    },
    "high_confidence": {
        "name": "Alta Confianza",
        "description": "Apuesta solo si confianza > 60%",
        "confidence_threshold": 0.60,
        "default_prediction": "1",
    },
}

# Mapeos de resultados
RESULT_MAP = {
    0: "1",  # Local gana
    1: "X",  # Empate
    2: "2",  # Visitante gana
}

RESULT_LABELS = {
    0: "Local",
    1: "Empate",
    2: "Visitante",
}

RESULT_NAMES_ES = {
    "1": "Local",
    "X": "Empate",
    "2": "Visitante",
}


class League(Enum):
    """Enum de ligas disponibles."""
    LALIGA = "PD"
    PREMIER = "PL"
    SERIE_A = "SA"
    BUNDESLIGA = "BL1"
    LIGUE_1 = "FL1"
    CHAMPIONS = "CL"
    EUROPA = "EL"


def get_league_code(league_name: str) -> str:
    """Obtiene código de liga."""
    return LEAGUE_CODES.get(league_name, "PD")


def get_league_config(league_code: str) -> Dict:
    """Obtiene configuración de una liga."""
    for config in LEAGUE_CONFIG.values():
        if config["code"] == league_code:
            return config
    return LEAGUE_CONFIG["LaLiga"]


def get_strategy_config(strategy: str) -> Dict:
    """Obtiene configuración de estrategia."""
    return QUINIELA_STRATEGIES.get(strategy, QUINIELA_STRATEGIES["balanced"])


# Paths relativos
PATHS = {
    "data_raw": "data/raw",
    "data_processed": "data/processed",
    "models": "models",
    "logs": "logs",
    "exports": "exports",
}

# Features a usar en modelo
FEATURE_NAMES = [
    # Home team
    "home_wins",
    "home_draws",
    "home_losses",
    "home_goals_for",
    "home_goals_against",
    "home_goal_diff",
    "home_win_rate",
    "home_avg_goals_for",
    "home_avg_goals_against",
    "home_points_avg",
    # Away team
    "away_wins",
    "away_draws",
    "away_losses",
    "away_goals_for",
    "away_goals_against",
    "away_goal_diff",
    "away_win_rate",
    "away_avg_goals_for",
    "away_avg_goals_against",
    "away_points_avg",
    # Comparativas
    "form_diff",
    "goal_power_diff",
    "defense_diff",
]
