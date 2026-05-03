"""
API REST para LaLiga Predictor
FastAPI Backend - Listo para conectar con cualquier UI
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Dict
import logging
import json
from datetime import datetime
from pathlib import Path
import pandas as pd

# Importa módulos del proyecto
from src.scraper import LaLigaScraper, scrape_all_data
from src.trainer import ModelTrainer, train_complete_model
from src.predictor import Predictor
from src.utils import create_directories, get_project_paths, save_json, load_json, categorize_result

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
        self.historical_matches = None  # Solo FINISHED (para entrenar)
        self.all_matches = None  # FINISHED + SCHEDULED (para mostrar calendario)
        self.next_matchday = None
        self.standings = None
        self.trainer = None
        self.predictions = None
        self.last_update = None

    def is_data_loaded(self) -> bool:
        return self.historical_matches is not None

    def is_model_trained(self) -> bool:
        return self.trainer is not None

    def is_predicted(self) -> bool:
        return self.predictions is not None


state = AppState()


# ============================================================================
# QUINIELA LOG (persistencia en disco)
# ============================================================================

def _log_path() -> Path:
    paths = get_project_paths()
    return paths["base"] / "data" / "quinielas_log.json"


def _load_log() -> List[Dict]:
    data = load_json(str(_log_path()))
    if not data or "entries" not in data:
        return []
    return data["entries"]


def _save_log(entries: List[Dict]) -> None:
    save_json({"entries": entries}, str(_log_path()))


def _upsert_log_entry(entry: Dict) -> None:
    """Guarda/reemplaza la entrada de una jornada en el log."""
    entries = _load_log()
    entries = [e for e in entries if e.get("round") != entry["round"]]
    entries.append(entry)
    entries.sort(key=lambda e: e.get("round", 0))
    _save_log(entries)


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

    - Descarga partidos completados (para entrenar)
    - Descarga todos los partidos (calendario completo)
    - Descarga próxima jornada
    - Obtiene clasificación actual
    """
    try:
        logger.info("Iniciando carga de datos...")

        historical, all_matches, next_matchday, standings = scrape_all_data()

        if historical is None or len(historical) == 0:
            raise HTTPException(status_code=400, detail="No se pudieron obtener datos")

        state.historical_matches = historical
        state.all_matches = all_matches
        state.next_matchday = next_matchday
        state.standings = standings
        state.last_update = datetime.now().isoformat()

        next_count = len(next_matchday) if next_matchday is not None else 0
        standings_count = len(standings) if standings is not None else 0
        all_count = len(all_matches) if all_matches is not None else 0

        return DataLoadResponse(
            success=True,
            matches_loaded=len(historical),
            next_matchday_matches=next_count,
            teams_count=standings_count,
            message=f"Cargados {len(historical)} partidos históricos, {all_count} en calendario total y {next_count} de próxima jornada",
        )

    except Exception as e:
        logger.error(f"Error cargando datos: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/data/history", tags=["Data"])
async def get_history():
    """Obtiene últimos 20 partidos cargadas."""
    if state.historical_matches is None:
        raise HTTPException(status_code=400, detail="Primero carga datos con POST /data/load")

    matches = []
    for _, row in state.historical_matches.iterrows():
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


@app.get("/data/matchdays", tags=["Data"])
async def get_matchdays():
    """Obtiene todas las jornadas (completadas y futuras) con sus partidos."""
    if state.all_matches is None or len(state.all_matches) == 0:
        raise HTTPException(status_code=400, detail="Primero carga datos con POST /data/load")

    df = state.all_matches.copy()
    df["round"] = pd.to_numeric(df["round"], errors="coerce").fillna(0).astype(int)

    matchdays = []
    for round_num in sorted(df["round"].unique()):
        round_matches = df[df["round"] == round_num]
        matches = []
        has_results = False

        for _, row in round_matches.iterrows():
            hg_raw = row["home_goals"]
            ag_raw = row["away_goals"]

            # Detecta valores ausentes: None, NaN o el sentinela -999
            def _is_missing(v):
                if v is None:
                    return True
                try:
                    if pd.isna(v):
                        return True
                except (TypeError, ValueError):
                    pass
                return v == -999

            hg_missing = _is_missing(hg_raw)
            ag_missing = _is_missing(ag_raw)

            if not hg_missing and not ag_missing:
                has_results = True

            home_goals = int(hg_raw) if not hg_missing else None
            away_goals = int(ag_raw) if not ag_missing else None

            matches.append({
                "date": row["date"].isoformat() if hasattr(row["date"], "isoformat") else str(row["date"]),
                "home_team": row["home_team"],
                "away_team": row["away_team"],
                "home_goals": home_goals,
                "away_goals": away_goals,
            })

        matchdays.append({
            "round": int(round_num),
            "matches": matches,
            "total": len(matches),
            "completed": has_results,
        })

    return {"matchdays": matchdays, "total_rounds": len(matchdays)}


# ============================================================================
# MODEL ENDPOINTS
# ============================================================================


@app.post("/model/train", response_model=TrainResponse, tags=["Model"])
async def train_model():
    """
    Entrena modelo ML con los datos históricos cargados.

    Requerido: Haber ejecutado POST /data/load primero
    """
    if not state.is_data_loaded():
        raise HTTPException(
            status_code=400,
            detail="Primero carga datos con POST /data/load",
        )

    try:
        logger.info("Entrenando modelo...")

        trainer, metrics = train_complete_model(state.historical_matches)

        state.trainer = trainer
        state.last_update = datetime.now().isoformat()

        return TrainResponse(
            success=True,
            accuracy=float(metrics["accuracy"]),
            f1_score=float(metrics["f1_score"]),
            total_matches=len(state.historical_matches),
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
async def generate_predictions(round: Optional[int] = None):
    """
    Genera predicciones para una jornada concreta.

    - Si se pasa `round`, predice todos los partidos de esa jornada (Quiniela completa).
    - Si no se pasa, cae a `state.next_matchday`.

    Requerido:
    - POST /data/load
    - POST /model/train
    """
    if not state.is_model_trained():
        raise HTTPException(
            status_code=400,
            detail="Primero entrena modelo con POST /model/train",
        )

    if round is not None:
        if state.all_matches is None or len(state.all_matches) == 0:
            raise HTTPException(
                status_code=400,
                detail="Calendario no cargado. Ejecuta POST /data/load primero.",
            )

        df = state.all_matches.copy()
        df["round"] = pd.to_numeric(df["round"], errors="coerce").fillna(0).astype(int)
        matchday_df = df[df["round"] == int(round)].sort_values("date")

        if len(matchday_df) == 0:
            raise HTTPException(
                status_code=404,
                detail=f"No hay partidos para la jornada {round}",
            )
        target_round = int(round)
    else:
        if state.next_matchday is None:
            raise HTTPException(
                status_code=400,
                detail="Próxima jornada no disponible",
            )
        matchday_df = state.next_matchday
        try:
            target_round = int(matchday_df["round"].iloc[0])
        except Exception:
            target_round = None

    try:
        logger.info(f"Generando predicciones para jornada {target_round} ({len(matchday_df)} partidos)...")

        predictor = Predictor(state.trainer, state.historical_matches)
        predictions = predictor.predict_matchday(matchday_df)

        state.predictions = predictions
        state.last_update = datetime.now().isoformat()

        # Mapa equipos -> (date, round) para cruzar con el calendario
        meta_by_pair = {}
        for _, m in matchday_df.iterrows():
            key = (m["home_team"], m["away_team"])
            meta_by_pair[key] = {
                "date": m["date"].isoformat() if hasattr(m["date"], "isoformat") else str(m["date"]),
                "round": int(pd.to_numeric(m.get("round", target_round), errors="coerce") or target_round or 0),
            }

        # Convierte a formato API
        predictions_list = []
        for _, pred in predictions.iterrows():
            meta = meta_by_pair.get((pred["home_team"], pred["away_team"]), {})
            predictions_list.append({
                "home_team": pred["home_team"],
                "away_team": pred["away_team"],
                "date": meta.get("date"),
                "round": meta.get("round", target_round),
                "prediction": pred["prediction"],
                "prob_local": float(pred["prob_local"]),
                "prob_draw": float(pred["prob_draw"]),
                "prob_away": float(pred["prob_away"]),
                "confidence": float(pred["confidence"]),
            })

        # Ordena por fecha (cronológico dentro de la jornada)
        predictions_list.sort(key=lambda p: p.get("date") or "")

        # Persiste la quiniela en el log (sustituye la entrada previa de esta jornada)
        if target_round is not None:
            try:
                _upsert_log_entry({
                    "round": int(target_round),
                    "predicted_at": datetime.now().isoformat(),
                    "predictions": predictions_list,
                })
            except Exception as log_err:
                logger.warning(f"No se pudo persistir el log de quiniela: {log_err}")

        return {
            "success": True,
            "round": target_round,
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
# HISTORY ENDPOINTS
# ============================================================================


def _build_results_lookup() -> Dict:
    """Construye lookup (home, away, round) -> {home_goals, away_goals, actual} desde all_matches."""
    if state.all_matches is None or len(state.all_matches) == 0:
        return {}

    df = state.all_matches.copy()
    df["round"] = pd.to_numeric(df["round"], errors="coerce").fillna(0).astype(int)

    lookup = {}
    for _, row in df.iterrows():
        hg = row.get("home_goals")
        ag = row.get("away_goals")

        def _missing(v):
            if v is None:
                return True
            try:
                if pd.isna(v):
                    return True
            except (TypeError, ValueError):
                pass
            return v == -999

        if _missing(hg) or _missing(ag):
            continue

        try:
            hg_i = int(hg)
            ag_i = int(ag)
        except (TypeError, ValueError):
            continue

        key = (row["home_team"], row["away_team"], int(row["round"]))
        lookup[key] = {
            "home_goals": hg_i,
            "away_goals": ag_i,
            "actual": categorize_result(hg_i, ag_i),
        }
    return lookup


@app.get("/history", tags=["History"])
async def get_history_log():
    """
    Retorna histórico de quinielas predichas, enriquecido con resultados reales
    cuando ya están disponibles. Cada entrada incluye aciertos/total y accuracy.
    """
    entries = _load_log()
    results = _build_results_lookup()

    enriched = []
    for entry in entries:
        round_num = int(entry.get("round", 0))
        items = []
        hits = 0
        finished = 0

        for pred in entry.get("predictions", []):
            key = (pred.get("home_team"), pred.get("away_team"), round_num)
            actual = results.get(key)

            item = {
                "home_team": pred.get("home_team"),
                "away_team": pred.get("away_team"),
                "date": pred.get("date"),
                "prediction": pred.get("prediction"),
                "prob_local": pred.get("prob_local"),
                "prob_draw": pred.get("prob_draw"),
                "prob_away": pred.get("prob_away"),
                "confidence": pred.get("confidence"),
                "actual": None,
                "home_goals": None,
                "away_goals": None,
                "hit": None,
            }

            if actual:
                finished += 1
                item["actual"] = actual["actual"]
                item["home_goals"] = actual["home_goals"]
                item["away_goals"] = actual["away_goals"]
                item["hit"] = bool(actual["actual"] == pred.get("prediction"))
                if item["hit"]:
                    hits += 1

            items.append(item)

        total = len(items)
        accuracy = (hits / finished) if finished > 0 else None

        enriched.append({
            "round": round_num,
            "predicted_at": entry.get("predicted_at"),
            "total": total,
            "finished": finished,
            "pending": total - finished,
            "hits": hits,
            "accuracy": accuracy,
            "predictions": items,
        })

    enriched.sort(key=lambda e: e["round"], reverse=True)

    overall_finished = sum(e["finished"] for e in enriched)
    overall_hits = sum(e["hits"] for e in enriched)

    return {
        "entries": enriched,
        "total_quinielas": len(enriched),
        "overall_accuracy": (overall_hits / overall_finished) if overall_finished > 0 else None,
        "overall_hits": overall_hits,
        "overall_finished": overall_finished,
        "results_available": state.all_matches is not None,
    }


@app.delete("/history/{round}", tags=["History"])
async def delete_history_entry(round: int):
    """Borra una entrada del log."""
    entries = _load_log()
    new_entries = [e for e in entries if int(e.get("round", -1)) != int(round)]
    if len(new_entries) == len(entries):
        raise HTTPException(status_code=404, detail=f"No hay quiniela guardada para jornada {round}")
    _save_log(new_entries)
    return {"success": True, "round": int(round)}


# ============================================================================
# QUINIELA ENDPOINTS
# ============================================================================


@app.post("/quiniela/generate", tags=["Quiniela"])
async def generate_quiniela(strategy: str = "conservadora"):
    """
    Genera quiniela con estrategia especificada.

    Estrategias:
    - conservadora: Solo apuesta cuando confianza > 70% (segura, pocas apuestas)
    - arriesgada: Apuesta cuando confianza > 45% (más atrevida, más apuestas)
    - alto_nivel: Solo apuesta cuando confianza > 75% (muy selectiva, muy pocas apuestas)
    """
    if not state.is_predicted():
        raise HTTPException(
            status_code=400,
            detail="Primero genera predicciones con POST /predictions/generate",
        )

    if strategy not in ["conservadora", "arriesgada", "alto_nivel"]:
        raise HTTPException(
            status_code=400,
            detail="Estrategia inválida. Usa: conservadora, arriesgada, alto_nivel",
        )

    try:
        logger.info(f"Generando quiniela con estrategia: {strategy}")

        predictor = Predictor(state.trainer, state.historical_matches)
        quiniela = predictor.generate_quiniela(state.predictions, strategy=strategy)

        # Filtra apuestas válidas (no None)
        valid_bets = [b for b in quiniela["bet"].tolist() if b is not None]

        # Estadísticas
        stats = {
            "total_partidos": len(quiniela),
            "apuestas_realizadas": len(valid_bets),
            "predicciones_1": valid_bets.count("1"),
            "predicciones_x": valid_bets.count("X"),
            "predicciones_2": valid_bets.count("2"),
            "confidence_promedio": float(state.predictions["confidence"].mean()),
        }

        return {
            "success": True,
            "strategy": strategy,
            "quiniela": ",".join(valid_bets),
            "bets": quiniela[["home_team", "away_team", "prediction", "confidence", "bet"]].to_dict(orient="records"),
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
    state.historical_matches = None
    state.all_matches = None
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
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail}
    )


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
