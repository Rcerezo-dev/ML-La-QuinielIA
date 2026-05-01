import requests
import pandas as pd
import logging
from typing import Dict, List, Tuple, Optional
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from .utils import save_json, load_json, get_project_paths

load_dotenv()
logger = logging.getLogger(__name__)

BASE_URL = "https://api.football-data.org/v4"
API_KEY = os.getenv("FOOTBALL_DATA_API_KEY", "")
LEAGUE_CODE = os.getenv("LEAGUE_CODE", "PD")  # PD = Primera División (LaLiga)


class LaLigaScraper:
    """Scraper para datos de LaLiga desde football-data.org"""

    def __init__(self):
        self.base_url = BASE_URL
        self.api_key = API_KEY
        self.league_code = LEAGUE_CODE
        self.headers = {"X-Auth-Token": self.api_key} if self.api_key else {}
        self.paths = get_project_paths()

    def get_standings(self) -> Optional[pd.DataFrame]:
        """Obtiene clasificación actual de LaLiga."""
        try:
            url = f"{self.base_url}/competitions/{self.league_code}/standings"
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()

            data = response.json()
            standings_list = []

            for table in data.get("standings", []):
                for team in table.get("table", []):
                    standings_list.append(
                        {
                            "team": team["team"]["name"],
                            "position": team["position"],
                            "played": team["playedGames"],
                            "wins": team["won"],
                            "draws": team["draw"],
                            "losses": team["lost"],
                            "goals_for": team["goalsFor"],
                            "goals_against": team["goalsAgainst"],
                            "goal_diff": team["goalDifference"],
                            "points": team["points"],
                        }
                    )

            df = pd.DataFrame(standings_list)
            logger.info(f"Clasificación obtenida: {len(df)} equipos")
            return df

        except Exception as e:
            logger.error(f"Error obteniendo clasificación: {e}")
            return None

    def get_matches(self, status: str = "FINISHED") -> Optional[pd.DataFrame]:
        """
        Obtiene partidos de LaLiga.
        status: FINISHED, SCHEDULED, LIVE, etc.
        """
        try:
            url = f"{self.base_url}/competitions/{self.league_code}/matches"
            params = {"status": status}

            response = requests.get(
                url, headers=self.headers, params=params, timeout=10
            )
            response.raise_for_status()

            data = response.json()
            matches_list = []

            for match in data.get("matches", []):
                matches_list.append(
                    {
                        "id": match["id"],
                        "date": match["utcDate"],
                        "round": match.get("season", {}).get("currentMatchday", "Unknown"),
                        "home_team": match["homeTeam"]["name"],
                        "away_team": match["awayTeam"]["name"],
                        "home_goals": match["score"]["fullTime"]["home"],
                        "away_goals": match["score"]["fullTime"]["away"],
                        "status": match["status"],
                    }
                )

            df = pd.DataFrame(matches_list)
            df["date"] = pd.to_datetime(df["date"])
            logger.info(f"Partidos obtenidos: {len(df)}")
            return df

        except Exception as e:
            logger.error(f"Error obteniendo partidos: {e}")
            return None

    def get_last_n_matchdays(self, n: int = 5) -> Optional[pd.DataFrame]:
        """Obtiene últimas n jornadas completas disputadas."""
        try:
            matches = self.get_matches(status="FINISHED")
            if matches is None or len(matches) == 0:
                return None

            matches = matches.sort_values("date", ascending=False)

            # Agrupa por jornada y obtiene últimas n
            matches["round"] = pd.to_numeric(
                matches["round"], errors="coerce"
            ).fillna(0)
            last_matchday = matches["round"].max()
            min_matchday = max(1, last_matchday - n + 1)

            filtered = matches[
                (matches["round"] >= min_matchday) & (matches["round"] <= last_matchday)
            ]

            logger.info(
                f"Últimas {n} jornadas: de {min_matchday} a {last_matchday}"
            )
            return filtered.sort_values("date")

        except Exception as e:
            logger.error(f"Error obteniendo últimas jornadas: {e}")
            return None

    def get_next_matchday(self) -> Optional[pd.DataFrame]:
        """Obtiene próxima jornada pendiente."""
        try:
            matches = self.get_matches(status="SCHEDULED")
            if matches is None or len(matches) == 0:
                logger.warning("No hay jornadas próximas programadas")
                return None

            matches = matches.sort_values("date")

            # Obtiene próxima jornada única
            next_round = matches["round"].min()
            next_matchday = matches[matches["round"] == next_round]

            logger.info(f"Próxima jornada encontrada: Jornada {next_round}")
            return next_matchday.sort_values("date")

        except Exception as e:
            logger.error(f"Error obteniendo próxima jornada: {e}")
            return None

    def save_data(self, df: pd.DataFrame, filename: str) -> None:
        """Guarda dataframe en CSV."""
        filepath = self.paths["data_raw"] / filename
        df.to_csv(filepath, index=False, encoding="utf-8")
        logger.info(f"Datos guardados: {filepath}")

    def load_data(self, filename: str) -> Optional[pd.DataFrame]:
        """Carga dataframe desde CSV."""
        filepath = self.paths["data_raw"] / filename
        try:
            df = pd.read_csv(filepath)
            df["date"] = pd.to_datetime(df["date"], errors="coerce")
            logger.info(f"Datos cargados: {filepath}")
            return df
        except FileNotFoundError:
            logger.warning(f"Archivo no encontrado: {filepath}")
            return None


def scrape_all_data() -> Tuple[Optional[pd.DataFrame], Optional[pd.DataFrame], Optional[pd.DataFrame]]:
    """
    Función principal para obtener todos los datos necesarios.
    Retorna: (últimas 5 jornadas, próxima jornada, clasificación)
    """
    scraper = LaLigaScraper()

    # Obtiene datos
    last_5 = scraper.get_last_n_matchdays(n=5)
    next_matchday = scraper.get_next_matchday()
    standings = scraper.get_standings()

    # Guarda
    if last_5 is not None:
        scraper.save_data(last_5, "last_5_matchdays.csv")
    if next_matchday is not None:
        scraper.save_data(next_matchday, "next_matchday.csv")
    if standings is not None:
        scraper.save_data(standings, "standings.csv")

    return last_5, next_matchday, standings
