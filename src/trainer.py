import pandas as pd
import numpy as np
import logging
from typing import Tuple, Dict, List
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    classification_report,
    f1_score,
)
import joblib
import os
from .utils import get_project_paths
from .features import FeatureEngineer

logger = logging.getLogger(__name__)

RANDOM_STATE = int(os.getenv("RANDOM_STATE", 42))
TEST_SIZE = float(os.getenv("TEST_SIZE", 0.2))


class ModelTrainer:
    """Entrena y evalúa modelo predictivo."""

    def __init__(self):
        self.model = None
        self.feature_cols = None
        self.accuracy = None
        self.f1 = None
        self.confusion_mat = None
        self.report = None
        self.paths = get_project_paths()

    def train_model(
        self, X: pd.DataFrame, y: np.ndarray, test_size: float = TEST_SIZE
    ) -> Dict[str, float]:
        """
        Entrena RandomForest con train/test split.
        y debe tener valores: 0 (local gana), 1 (empate), 2 (visitante gana)
        """

        # Split
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=RANDOM_STATE, stratify=y
        )

        logger.info(
            f"Train/Test split: {len(X_train)}/{len(X_test)} ({test_size*100}%)"
        )

        # Entrena modelo
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=15,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=RANDOM_STATE,
            n_jobs=-1,
        )

        self.model.fit(X_train, y_train)
        self.feature_cols = X.columns.tolist()

        # Evaluación
        y_pred = self.model.predict(X_test)

        self.accuracy = accuracy_score(y_test, y_pred)
        self.f1 = f1_score(y_test, y_pred, average="weighted")
        self.confusion_mat = confusion_matrix(y_test, y_pred)
        self.report = classification_report(y_test, y_pred, output_dict=True)

        logger.info(f"Modelo entrenado. Accuracy: {self.accuracy:.4f}, F1: {self.f1:.4f}")

        return {
            "accuracy": float(self.accuracy),
            "f1_score": float(self.f1),
            "confusion_matrix": self.confusion_mat.tolist(),
            "report": self.report,
        }

    def save_model(self, filename: str = "model.pkl") -> str:
        """Guarda modelo entrenado."""
        if self.model is None:
            logger.error("No hay modelo entrenado para guardar")
            return None

        filepath = self.paths["models"] / filename
        joblib.dump(self.model, filepath)
        logger.info(f"Modelo guardado: {filepath}")

        # Guarda también feature cols
        metadata = {"feature_cols": self.feature_cols}
        joblib.dump(metadata, self.paths["models"] / "metadata.pkl")

        return str(filepath)

    def load_model(self, filename: str = "model.pkl") -> bool:
        """Carga modelo entrenado."""
        filepath = self.paths["models"] / filename

        if not filepath.exists():
            logger.error(f"Modelo no encontrado: {filepath}")
            return False

        self.model = joblib.load(filepath)

        # Carga metadata
        metadata_path = self.paths["models"] / "metadata.pkl"
        if metadata_path.exists():
            metadata = joblib.load(metadata_path)
            self.feature_cols = metadata.get("feature_cols", [])

        logger.info(f"Modelo cargado: {filepath}")
        return True

    def get_feature_importance(self, top_n: int = 10) -> Dict[str, float]:
        """Retorna features más importantes."""
        if self.model is None:
            logger.error("No hay modelo entrenado")
            return {}

        importances = dict(
            zip(self.feature_cols, self.model.feature_importances_)
        )
        sorted_imp = dict(
            sorted(importances.items(), key=lambda x: x[1], reverse=True)[:top_n]
        )

        return sorted_imp

    def get_metrics(self) -> Dict:
        """Retorna métricas de evaluación."""
        return {
            "accuracy": self.accuracy,
            "f1_score": self.f1,
            "confusion_matrix": self.confusion_mat.tolist() if self.confusion_mat is not None else None,
        }


def train_complete_model(matches_df: pd.DataFrame) -> Tuple[ModelTrainer, Dict]:
    """
    Pipeline completo: features + entrenamiento.
    Retorna modelo entrenado y métricas.
    """

    # Feature engineering
    engineer = FeatureEngineer(matches_df)
    X, y, feature_cols, features_df = engineer.create_training_dataset(matches_df)

    # Entrena
    trainer = ModelTrainer()
    metrics = trainer.train_model(X, y)

    # Guarda
    trainer.save_model()

    logger.info("Pipeline de entrenamiento completado")

    return trainer, metrics
