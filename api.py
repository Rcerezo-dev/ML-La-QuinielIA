"""
API REST para LaLiga Predictor
FastAPI Backend - Listo para conectar con cualquier UI
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
import logging
import json
from datetime import datetime
from pathlib import Path

# Importa módulos del proyecto
from src.scraper import LaLigaScraper, scrape_all_data
from src.trainer import ModelTrainer, train_complete_model
from src.predictor import Predictor
from src.utils import create_directories, get_project_paths

# Setup
create_directories()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# App
app = FastAPI(
    title="LaLiga Predictor API",
    description="Backend para predicción de resultados de LaLiga",
    version="1.0.0",
    docs_url="/docs",
    openapi_url="/openapi.json",
)

# CORS - permite cualquier origen (cambiar en producción)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En prod: ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# MODELS (Pydantic)
# ============================================================================


class HealthResponse(BaseModel):
    """Respuesta de health check."""
    status: str
    timestamp: str


class DataLoadResponse(BaseModel):
    """Respuesta al cargar datos."""
    success: bool
    matches_loaded: int
    next_matchday_matches: int
    teams_count: int
    message: str


class TrainResponse(BaseModel):
    """Respuesta del entrenamiento del modelo."""
    success: bool
    accuracy: float
    f1_score: float
    total_matches: int
    message: str


class PredictionItem(BaseModel):
    """Un partido predicho."""
    home_team: str
    away_team: str
    prediction: str  # "1", "X", "2"
    prob_local: float
    prob_draw: float
    prob_away: float
    confidence: float


class QuinielaResponse(BaseModel):
    """Respuesta de quiniela generada."""
    strategy: str
    quiniela: List[str]  # Lista de "1", "X", "2"
    predictions: List[PredictionItem]
    stats: Dict


class StandingsResponse(BaseModel):
    """Respuesta de clasificación."""
    teams: List[Dict]
    total: int


class HistoryMatchResponse(BaseModel):
    """Un partido del histórico."""
    date: str
    home_team: str
    away_team: str
    home_goals: int
    away_goals: int
    round: int


class ErrorResponse(BaseModel):
    """Respuesta de error."""
    error: str
    details: Optional[str] = None


# ============================================================================
# STATE (datos en memoria)
# ============================================================================

class AppState:
    """Estado de la aplicación."""
    def __init__(self):
        self.last_5_matches = None
        self.next_matchday = None
        self.standings = None
        self.trainer = None
        self.predictions = None
        self.last_update = None

    def is_data_loaded(self) -> bool:
        return self.last_5_matches is not None

    def is_model_trained(self) -> bool:
        return self.trainer is not None

    def is_predicted(self) -> bool:
        return self.predictions is not None


state = AppState()


# ============================================================================
# HEALTH & INFO ENDPOINTS
# ============================================================================


@app.get("/", tags=["Info"])
async def root():
    """Root endpoint - Info básica."""
    return {
        "name": "LaLiga Predictor API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running",
    }


@app.get("/health", response_model=HealthResponse, tags=["Info"])
async def health():
    """Health check."""
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now().isoformat(),
    )


@app.get("/status", tags=["Info"])
async def status():
    """Estado actual de la aplicación."""
    return {
        "data_loaded": state.is_data_loaded(),
        "model_trained": state.is_model_trained(),
        "predictions_ready": state.is_predicted(),
        "last_update": state.last_update,
    }


# ============================================================================
# DATA ENDPOINTS
# ============================================================================


@app.post("/data/load", response_model=DataLoadResponse, tags=["Data"])
async def load_data():
    """
    Carga datos de LaLiga desde API.

    - Descarga últimas 5 jornadas
    - Descarga próxima jornada
    - Obtiene clasificación actual
    """
    try:
        logger.info("Iniciando carga de datos...")

        last_5, next_matchday, standings = scrape_all_data()

        if last_5 is None or len(last_5) == 0:
            raise HTTPException(status_code=400, detail="No se pudieron obtener datos")

        state.last_5_matches = last_5
        state.next_matchday = next_matchday
        state.standings = standings
        state.last_update = datetime.now().isoformat()

        next_count = len(next_matchday) if next_matchday is not None else 0
        standings_count = len(standings) if standings is not None else 0

        return DataLoadResponse(
            success=True,
            matches_loaded=len(last_5),
            next_matchday_matches=next_count,
            teams_count=standings_count,
            message=f"Cargados {len(last_5)} partidos históricos y {next_count} de próxima jornada",
        )

    except Exception as e:
        logger.error(f"Error cargando datos: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/data/history", tags=["Data"])
async def get_history():
    """Obtiene últimas 5 jornadas cargadas."""
    if state.last_5_matches is None:
        raise HTTPException(status_code=400, detail="Primero carga datos con POST /data/load")

    matches = []
    for _, row in state.last_5_matches.iterrows():
        matches.append({
            "date": row["date"].isoformat() if hasattr(row["date"], "isoformat") else str(row["date"]),
            "home_team": row["home_team"],
            "away_team": row["away_team"],
            "home_goals": int(row["home_goals"]),
            "away_goals": int(row["away_goals"]),
            "round": int(row["round"]) if "round" in row else None,
        })

    return {"matches": matches, "total": len(matches)}


@app.get("/data/next-matchday", tags=["Data"])
async def get_next_matchday():
    """Obtiene próxima jornada."""
    if state.next_matchday is None:
        raise HTTPException(status_code=400, detail="Próxima jornada no disponible")

    matches = []
    for _, row in state.next_matchday.iterrows():
        matches.append({
            "date": row["date"].isoformat() if hasattr(row["date"], "isoformat") else str(row["date"]),
            "home_team": row["home_team"],
            "away_team": row["away_team"],
            "round": int(row["round"]) if "round" in row else None,
        })

    return {"matches": matches, "total": len(matches)}


# ============================================================================
# MODEL ENDPOINTS
# ============================================================================


@app.post("/model/train", response_model=TrainResponse, tags=["Model"])
async def train_model():
    """
    Entrena modelo ML con últimas 5 jornadas.

    Requerido: Haber ejecutado POST /data/load primero
    """
    if not state.is_data_loaded():
        raise HTTPException(
            status_code=400,
            detail="Primero carga datos con POST /data/load",
        )

    try:
        logger.info("Entrenando modelo...")

        trainer, metrics = train_complete_model(state.last_5_matches)

        state.trainer = trainer
        state.last_update = datetime.now().isoformat()

        return TrainResponse(
            success=True,
            accuracy=float(metrics["accuracy"]),
            f1_score=float(metrics["f1_score"]),
            total_matches=len(state.last_5_matches),
            message="Modelo entrenado correctamente",
        )

    except Exception as e:
        logger.error(f"Error entrenando modelo: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/model/features", tags=["Model"])
async def get_feature_importance():
    """Obtiene features más importantes del modelo."""
    if not state.is_model_trained():
        raise HTTPException(
            status_code=400,
            detail="Primero entrena modelo con POST /model/train",
        )

    importance = state.trainer.get_feature_importance(top_n=15)

    return {
        "features": [
            {"name": k, "importance": float(v)} for k, v in importance.items()
        ],
    }


@app.get("/model/metrics", tags=["Model"])
async def get_model_metrics():
    """Obtiene métricas del modelo entrenado."""
    if not state.is_model_trained():
        raise HTTPException(
            status_code=400,
            detail="Primero entrena modelo con POST /model/train",
        )

    metrics = state.trainer.get_metrics()

    return {
        "accuracy": float(metrics["accuracy"]) if metrics["accuracy"] else None,
        "f1_score": float(metrics["f1_score"]) if metrics["f1_score"] else None,
        "confusion_matrix": metrics["confusion_matrix"],
    }


# ============================================================================
# PREDICTION ENDPOINTS
# ============================================================================


@app.post("/predictions/generate", tags=["Predictions"])
async def generate_predictions():
    """
    Genera predicciones para próxima jornada.

    Requerido:
    - POST /data/load
    - POST /model/train
    """
    if not state.is_model_trained():
        raise HTTPException(
            status_code=400,
            detail="Primero entrena modelo con POST /model/train",
        )

    if state.next_matchday is None:
        raise HTTPException(
            status_code=400,
            detail="Próxima jornada no disponible",
        )

    try:
        logger.info("Generando predicciones...")

        predictor = Predictor(state.trainer, state.last_5_matches)
        predictions = predictor.predict_matchday(state.next_matchday)

        state.predictions = predictions
        state.last_update = datetime.now().isoformat()

        # Convierte a formato API
        predictions_list = []
        for _, pred in predictions.iterrows():
            predictions_list.append({
                "home_team": pred["home_team"],
                "away_team": pred["away_team"],
                "prediction": pred["prediction"],
                "prob_local": float(pred["prob_local"]),
                "prob_draw": float(pred["prob_draw"]),
                "prob_away": float(pred["prob_away"]),
                "confidence": float(pred["confidence"]),
            })

        return {
            "success": True,
            "predictions": predictions_list,
            "total": len(predictions_list),
            "average_confidence": float(predictions["confidence"].mean()),
        }

    except Exception as e:
        logger.error(f"Error generando predicciones: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/predictions/latest", tags=["Predictions"])
async def get_latest_predictions():
    """Obtiene últimas predicciones generadas."""
    if not state.is_predicted():
        raise HTTPException(
            status_code=400,
            detail="Primero genera predicciones con POST /predictions/generate",
        )

    predictions_list = []
    for _, pred in state.predictions.iterrows():
        predictions_list.append({
            "home_team": pred["home_team"],
            "away_team": pred["away_team"],
            "prediction": pred["prediction"],
            "prob_local": float(pred["prob_local"]),
            "prob_draw": float(pred["prob_draw"]),
            "prob_away": float(pred["prob_away"]),
            "confidence": float(pred["confidence"]),
        })

    return {"predictions": predictions_list, "total": len(predictions_list)}


# ============================================================================
# QUINIELA ENDPOINTS
# ============================================================================


@app.post("/quiniela/generate", tags=["Quiniela"])
async def generate_quiniela(strategy: str = "balanced"):
    """
    Genera quiniela con estrategia especificada.

    Estrategias:
    - balanced: Apuesta si confianza > 40% (conservadora)
    - aggressive: Apuesta si confianza > 55% (arriesgada)
    - high_confidence: Apuesta si confianza > 60% (segura)
    """
    if not state.is_predicted():
        raise HTTPException(
            status_code=400,
            detail="Primero genera predicciones con POST /predictions/generate",
        )

    if strategy not in ["balanced", "aggressive", "high_confidence"]:
        raise HTTPException(
            status_code=400,
            detail="Estrategia inválida. Usa: balanced, aggressive, high_confidence",
        )

    try:
        logger.info(f"Generando quiniela con estrategia: {strategy}")

        predictor = Predictor(state.trainer, state.last_5_matches)
        quiniela = predictor.generate_quiniela(state.predictions, strategy=strategy)

        bets = quiniela["bet"].tolist()

        # Estadísticas
        stats = {
            "total_partidos": len(bets),
            "predicciones_1": bets.count("1"),
            "predicciones_x": bets.count("X"),
            "predicciones_2": bets.count("2"),
            "confidence_promedio": float(state.predictions["confidence"].mean()),
        }

        return {
            "success": True,
            "strategy": strategy,
            "quiniela": ",".join(bets),
            "bets": bets,
            "stats": stats,
        }

    except Exception as e:
        logger.error(f"Error generando quiniela: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# STANDINGS ENDPOINT
# ============================================================================


@app.get("/standings", tags=["Info"])
async def get_standings():
    """Obtiene clasificación actual de LaLiga."""
    if state.standings is None:
        raise HTTPException(
            status_code=400,
            detail="Primero carga datos con POST /data/load",
        )

    standings_list = []
    for _, row in state.standings.iterrows():
        standings_list.append({
            "position": int(row["position"]),
            "team": row["team"],
            "played": int(row["played"]),
            "wins": int(row["wins"]),
            "draws": int(row["draws"]),
            "losses": int(row["losses"]),
            "goals_for": int(row["goals_for"]),
            "goals_against": int(row["goals_against"]),
            "goal_diff": int(row["goal_diff"]),
            "points": int(row["points"]),
        })

    return {"standings": standings_list, "total": len(standings_list)}


# ============================================================================
# RESET ENDPOINT
# ============================================================================


@app.post("/reset", tags=["System"])
async def reset():
    """Limpia estado de la aplicación."""
    state.last_5_matches = None
    state.next_matchday = None
    state.standings = None
    state.trainer = None
    state.predictions = None
    state.last_update = None

    logger.info("Aplicación reiniciada")

    return {"success": True, "message": "Aplicación reiniciada"}


# ============================================================================
# ERROR HANDLERS
# ============================================================================


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Manejo de excepciones HTTP."""
    return ErrorResponse(error=exc.detail, details=None).__dict__


# ============================================================================
# STARTUP / SHUTDOWN
# ============================================================================


@app.on_event("startup")
async def startup_event():
    """Evento de startup."""
    logger.info("API iniciada ✅")
    logger.info("Docs disponible en: http://localhost:8000/docs")


@app.on_event("shutdown")
async def shutdown_event():
    """Evento de shutdown."""
    logger.info("API detenida")


# ============================================================================
# Para desarrollo local
# ============================================================================

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info",
    )
