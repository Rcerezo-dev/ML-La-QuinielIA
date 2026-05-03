import pandas as pd
import numpy as np
import logging
from typing import Dict, List, Tuple
from .features import FeatureEngineer
from .trainer import ModelTrainer

logger = logging.getLogger(__name__)

RESULT_MAP = {0: "1", 1: "X", 2: "2"}
RESULT_LABELS = {0: "Local", 1: "Empate", 2: "Visitante"}


class Predictor:
    """Realiza predicciones sobre partidos."""

    def __init__(self, trainer: ModelTrainer, history_df: pd.DataFrame):
        self.trainer = trainer
        self.history_df = history_df
        self.engineer = FeatureEngineer(history_df)

    def predict_match(self, home_team: str, away_team: str, match_date: pd.Timestamp) -> Dict:
        """
        Predice resultado de un partido.
        Retorna dict con probabilidades y predicción.
        """

        if self.trainer.model is None:
            logger.error("Modelo no cargado")
            return None

        # Crea features para el partido
        match_row = pd.Series(
            {
                "home_team": home_team,
                "away_team": away_team,
                "date": match_date,
                "home_goals": 0,
                "away_goals": 0,
            }
        )

        features = self.engineer.create_match_features(match_row)

        # Prepara X (solo features numéricos)
        X_data = {col: features[col] for col in self.trainer.feature_cols}
        X = pd.DataFrame([X_data])

        # Predicción
        pred_class = self.trainer.model.predict(X)[0]
        pred_proba = self.trainer.model.predict_proba(X)[0]

        return {
            "home_team": home_team,
            "away_team": away_team,
            "prediction": RESULT_MAP[pred_class],
            "prediction_label": RESULT_LABELS[pred_class],
            "prob_local": float(pred_proba[0]),
            "prob_draw": float(pred_proba[1]),
            "prob_away": float(pred_proba[2]),
            "confidence": float(max(pred_proba)),
        }

    def predict_matchday(self, matchday_df: pd.DataFrame) -> pd.DataFrame:
        """
        Predice todos los partidos de una jornada.
        Retorna DataFrame con predicciones.
        """

        predictions = []

        for _, match in matchday_df.iterrows():
            pred = self.predict_match(
                match["home_team"], match["away_team"], match["date"]
            )
            predictions.append(pred)

        pred_df = pd.DataFrame(predictions)

        # Estadísticas de predicciones
        draws_predicted = (pred_df["prediction"] == "X").sum()
        home_predicted = (pred_df["prediction"] == "1").sum()
        away_predicted = (pred_df["prediction"] == "2").sum()
        avg_draw_prob = pred_df["prob_draw"].mean()

        logger.info(f"Predicciones generadas para {len(pred_df)} partidos")
        logger.info(f"Resumen: Local={home_predicted}, Empate={draws_predicted}, Visitante={away_predicted}")
        logger.info(f"Probabilidad promedio de empate: {avg_draw_prob:.3f}")

        return pred_df

    def generate_quiniela(
        self, predictions_df: pd.DataFrame, strategy: str = "balanced"
    ) -> pd.DataFrame:
        """
        Genera quiniela (apuestas) basada en predicciones.
        strategy:
        - 'conservadora': Solo apuesta cuando confianza > 70% (apuestas seguras)
        - 'arriesgada': Apuesta cuando confianza > 45% (más atrevida)
        - 'alto_nivel': Solo apuesta cuando confianza > 75% (muy conservadora)
        """

        quiniela = predictions_df.copy()

        if strategy == "conservadora":
            # Solo apuesta partidos seguros (confianza > 70%)
            quiniela["bet"] = quiniela.apply(
                lambda row: (
                    row["prediction"]
                    if row["confidence"] > 0.70
                    else None  # Sin apuesta si no está seguro
                ),
                axis=1,
            )

        elif strategy == "arriesgada":
            # Apuesta con menos confianza (> 45%)
            quiniela["bet"] = quiniela.apply(
                lambda row: row["prediction"] if row["confidence"] > 0.45 else None,
                axis=1,
            )

        elif strategy == "alto_nivel":
            # Solo los más seguros (confianza > 75%)
            quiniela["bet"] = quiniela.apply(
                lambda row: row["prediction"] if row["confidence"] > 0.75 else None,
                axis=1,
            )

        return quiniela[["home_team", "away_team", "prediction", "confidence", "bet"]]

    def format_predictions(self, predictions_df: pd.DataFrame) -> pd.DataFrame:
        """Formatea predicciones para mostrar en UI."""

        display_df = pd.DataFrame(
            {
                "Partido": predictions_df.apply(
                    lambda x: f"{x['home_team']} vs {x['away_team']}", axis=1
                ),
                "Predicción": predictions_df["prediction_label"],
                "Prob 1": (predictions_df["prob_local"] * 100).round(1),
                "Prob X": (predictions_df["prob_draw"] * 100).round(1),
                "Prob 2": (predictions_df["prob_away"] * 100).round(1),
                "Confianza": (predictions_df["confidence"] * 100).round(1),
                "Apuesta": predictions_df["prediction"],
            }
        )

        return display_df

    def group_by_weekend(self, predictions_df: pd.DataFrame) -> Dict:
        """
        Agrupa predicciones por fin de semana (viernes a domingo).
        Retorna dict con estructura: {fecha_weekend: [partidos]}
        """
        predictions_df = predictions_df.copy()
        predictions_df["date"] = pd.to_datetime(predictions_df.get("date", pd.Series([None] * len(predictions_df))))

        # Si no hay fecha, agrupa por jornada
        if predictions_df["date"].isna().all():
            grouped = {}
            for _, row in predictions_df.iterrows():
                round_num = row.get("round", 1)
                if round_num not in grouped:
                    grouped[round_num] = []
                grouped[round_num].append(row)
            return grouped

        # Agrupa por fin de semana
        weekends = {}
        for _, match in predictions_df.iterrows():
            date = match["date"]
            if pd.isna(date):
                continue

            # Calcula el viernes anterior (para agrupar viernes, sábado, domingo)
            day_of_week = date.weekday()  # 0=lunes, 4=viernes, 5=sábado, 6=domingo
            if day_of_week < 4:  # lunes a jueves
                friday = date - pd.Timedelta(days=day_of_week + 3)
            else:  # viernes a domingo
                friday = date - pd.Timedelta(days=day_of_week - 4)

            friday_str = friday.strftime("%Y-%m-%d")

            if friday_str not in weekends:
                weekends[friday_str] = []
            weekends[friday_str].append(match.to_dict())

        return weekends

    def calculate_expected_value(
        self, predictions_df: pd.DataFrame, odds_dict: Dict = None
    ) -> float:
        """
        Calcula valor esperado de la quiniela (muy básico sin odds reales).
        odds_dict: dict con odds por resultado si se dispone
        """

        if odds_dict is None:
            # Odds típicas sin información real
            odds_dict = {"1": 2.0, "X": 3.5, "2": 3.5}

        total_ev = 0.0

        for _, row in predictions_df.iterrows():
            pred = row["prediction"]
            odds = odds_dict.get(pred, 1.0)
            prob = row.get(f"prob_{pred.lower()}", 0.33)
            ev = prob * odds - 1
            total_ev += ev

        return total_ev / len(predictions_df) if len(predictions_df) > 0 else 0
