import pandas as pd
import numpy as np
import logging
from typing import Dict, List

logger = logging.getLogger(__name__)


class FeatureEngineer:
    """Crea features para el modelo predictivo."""

    def __init__(self, matches_df: pd.DataFrame):
        self.matches_df = matches_df.sort_values("date").reset_index(drop=True)
        self.standings = None

    def categorize_result(self, home_goals: int, away_goals: int) -> int:
        """Convierte resultado a clase: 0=local, 1=empate, 2=visitante."""
        if home_goals > away_goals:
            return 0  # Local gana
        elif home_goals == away_goals:
            return 1  # Empate
        else:
            return 2  # Visitante gana

    def get_team_stats_before_date(
        self, team: str, date: pd.Timestamp, last_n: int = 5
    ) -> Dict[str, float]:
        """Calcula estadísticas de un equipo antes de una fecha (últimos last_n partidos)."""

        # Obtiene partidos anteriores a esa fecha
        before = self.matches_df[self.matches_df["date"] < date].copy()

        # Partidos donde participó
        team_matches = before[
            (before["home_team"] == team) | (before["away_team"] == team)
        ].tail(last_n)

        if len(team_matches) == 0:
            return self._get_default_stats()

        stats = {
            "matches_played": len(team_matches),
            "wins": 0,
            "draws": 0,
            "losses": 0,
            "goals_for": 0,
            "goals_against": 0,
            "points": 0,
        }

        for _, match in team_matches.iterrows():
            is_home = match["home_team"] == team
            goals_for = match["home_goals"] if is_home else match["away_goals"]
            goals_against = match["away_goals"] if is_home else match["home_goals"]

            # Solo cuenta si el partido tiene resultado (no None)
            if goals_for is None or goals_against is None:
                continue

            stats["goals_for"] += goals_for
            stats["goals_against"] += goals_against

            if goals_for > goals_against:
                stats["wins"] += 1
                stats["points"] += 3
            elif goals_for == goals_against:
                stats["draws"] += 1
                stats["points"] += 1
            else:
                stats["losses"] += 1

        # Calcula ratios
        stats["goal_difference"] = stats["goals_for"] - stats["goals_against"]
        stats["avg_goals_for"] = (
            stats["goals_for"] / stats["matches_played"]
            if stats["matches_played"] > 0
            else 0
        )
        stats["avg_goals_against"] = (
            stats["goals_against"] / stats["matches_played"]
            if stats["matches_played"] > 0
            else 0
        )
        stats["win_rate"] = (
            stats["wins"] / stats["matches_played"]
            if stats["matches_played"] > 0
            else 0
        )
        stats["points_avg"] = (
            stats["points"] / stats["matches_played"]
            if stats["matches_played"] > 0
            else 0
        )

        return stats

    def _get_default_stats(self) -> Dict[str, float]:
        """Retorna estadísticas por defecto para equipo sin historial."""
        return {
            "matches_played": 0,
            "wins": 0,
            "draws": 0,
            "losses": 0,
            "goals_for": 0,
            "goals_against": 0,
            "goal_difference": 0,
            "points": 0,
            "avg_goals_for": 0,
            "avg_goals_against": 0,
            "win_rate": 0,
            "points_avg": 0,
        }

    def create_match_features(self, match_row: pd.Series) -> Dict[str, float]:
        """Crea features para un partido individual."""

        home_team = match_row["home_team"]
        away_team = match_row["away_team"]
        match_date = match_row["date"]

        # Obtiene estadísticas
        home_stats = self.get_team_stats_before_date(home_team, match_date, last_n=20)
        away_stats = self.get_team_stats_before_date(away_team, match_date, last_n=20)

        # Crea features
        features = {
            "home_team": home_team,
            "away_team": away_team,
            "date": match_date,
            # Home team
            "home_wins": home_stats["wins"],
            "home_draws": home_stats["draws"],
            "home_losses": home_stats["losses"],
            "home_goals_for": home_stats["goals_for"],
            "home_goals_against": home_stats["goals_against"],
            "home_goal_diff": home_stats["goal_difference"],
            "home_win_rate": home_stats["win_rate"],
            "home_avg_goals_for": home_stats["avg_goals_for"],
            "home_avg_goals_against": home_stats["avg_goals_against"],
            "home_points_avg": home_stats["points_avg"],
            # Away team
            "away_wins": away_stats["wins"],
            "away_draws": away_stats["draws"],
            "away_losses": away_stats["losses"],
            "away_goals_for": away_stats["goals_for"],
            "away_goals_against": away_stats["goals_against"],
            "away_goal_diff": away_stats["goal_difference"],
            "away_win_rate": away_stats["win_rate"],
            "away_avg_goals_for": away_stats["avg_goals_for"],
            "away_avg_goals_against": away_stats["avg_goals_against"],
            "away_points_avg": away_stats["points_avg"],
            # Comparativas
            "form_diff": (home_stats["points_avg"] - away_stats["points_avg"]),
            "goal_power_diff": (
                home_stats["avg_goals_for"] - away_stats["avg_goals_for"]
            ),
            "defense_diff": (
                away_stats["avg_goals_against"] - home_stats["avg_goals_against"]
            ),
        }

        return features

    def create_features_for_matches(self, matches_df: pd.DataFrame) -> pd.DataFrame:
        """Crea features para múltiples partidos."""

        features_list = []

        for idx, match in matches_df.iterrows():
            features = self.create_match_features(match)
            features_list.append(features)

        features_df = pd.DataFrame(features_list)

        # Elimina columnas no numéricas para el modelo
        feature_cols = [
            col
            for col in features_df.columns
            if col not in ["home_team", "away_team", "date"]
        ]

        return features_df, feature_cols

    def create_training_dataset(self, matches_df: pd.DataFrame) -> tuple:
        """Crea dataset de entrenamiento con features y targets."""

        # Filtra solo partidos con resultados (sin None/NaN en goals)
        valid_matches = matches_df[
            (matches_df["home_goals"].notna()) &
            (matches_df["away_goals"].notna())
        ].copy()

        if len(valid_matches) == 0:
            raise ValueError("No hay partidos con resultados válidos para entrenar")

        features_df, feature_cols = self.create_features_for_matches(valid_matches)

        # Crea target
        targets = np.array(
            [
                self.categorize_result(
                    int(valid_matches.iloc[i]["home_goals"]),
                    int(valid_matches.iloc[i]["away_goals"]),
                )
                for i in range(len(valid_matches))
            ]
        )

        X = features_df[feature_cols].fillna(0)
        y = targets

        logger.info(f"Dataset creado: {X.shape[0]} partidos, {X.shape[1]} features")

        return X, y, feature_cols, features_df
