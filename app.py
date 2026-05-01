import streamlit as st
import pandas as pd
import numpy as np
import logging
from pathlib import Path
import plotly.graph_objects as go
from dotenv import load_dotenv

# Importa módulos custom
from src.scraper import LaLigaScraper, scrape_all_data
from src.trainer import ModelTrainer, train_complete_model
from src.predictor import Predictor
from src.utils import create_directories, get_project_paths

# Setup
load_dotenv()
create_directories()
logging.basicConfig(level=logging.INFO)

st.set_page_config(
    page_title="⚽ Quiniela LaLiga",
    page_icon="⚽",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Estilos
st.markdown(
    """
    <style>
    .main { padding: 2rem; }
    .metric-card { background-color: #f0f2f6; padding: 1.5rem; border-radius: 0.5rem; }
    h1 { color: #1f77b4; }
    h2 { color: #ff7f0e; }
    </style>
    """,
    unsafe_allow_html=True,
)


def initialize_session_state():
    """Inicializa variables de sesión."""
    if "data_loaded" not in st.session_state:
        st.session_state.data_loaded = False
    if "model_trained" not in st.session_state:
        st.session_state.model_trained = False
    if "last_5" not in st.session_state:
        st.session_state.last_5 = None
    if "next_matchday" not in st.session_state:
        st.session_state.next_matchday = None
    if "trainer" not in st.session_state:
        st.session_state.trainer = None
    if "predictions" not in st.session_state:
        st.session_state.predictions = None


def load_data():
    """Carga datos desde API o CSV local."""
    with st.spinner("📥 Descargando datos de LaLiga..."):
        scraper = LaLigaScraper()
        last_5, next_matchday, standings = scrape_all_data()

        if last_5 is not None and len(last_5) > 0:
            st.session_state.last_5 = last_5
            st.session_state.standings = standings
            st.session_state.data_loaded = True

            if next_matchday is not None:
                st.session_state.next_matchday = next_matchday
                st.success(
                    f"✅ Datos cargados: {len(last_5)} partidos + próxima jornada"
                )
            else:
                st.warning("⚠️ Próxima jornada no disponible todavía")
        else:
            st.error("❌ Error al descargar datos. Verifica tu API key.")


def train_model():
    """Entrena modelo con últimas 5 jornadas."""
    if not st.session_state.data_loaded:
        st.error("❌ Primero carga los datos")
        return

    with st.spinner("🧠 Entrenando modelo..."):
        trainer, metrics = train_complete_model(st.session_state.last_5)

        st.session_state.trainer = trainer
        st.session_state.model_trained = True

        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("📊 Accuracy", f"{metrics['accuracy']:.2%}")
        with col2:
            st.metric("🎯 F1 Score", f"{metrics['f1_score']:.4f}")
        with col3:
            st.metric("✅ Modelo", "Entrenado")

        # Features importance
        importance = trainer.get_feature_importance(top_n=10)
        fig = go.Figure(
            data=[
                go.Bar(
                    x=list(importance.values()),
                    y=list(importance.keys()),
                    orientation="h",
                )
            ]
        )
        fig.update_layout(
            title="🎯 Top 10 Features más Importantes",
            xaxis_title="Importancia",
            yaxis_title="Feature",
        )
        st.plotly_chart(fig, use_container_width=True)

        st.success("✅ Modelo entrenado y guardado")


def generate_predictions():
    """Genera predicciones para próxima jornada."""
    if not st.session_state.model_trained or st.session_state.next_matchday is None:
        st.error("❌ Entrena el modelo y carga la próxima jornada primero")
        return

    with st.spinner("🔮 Generando predicciones..."):
        predictor = Predictor(st.session_state.trainer, st.session_state.last_5)

        predictions = predictor.predict_matchday(st.session_state.next_matchday)
        st.session_state.predictions = predictions

        # Muestra tabla de predicciones
        display_df = predictor.format_predictions(predictions)
        st.dataframe(display_df, use_container_width=True)

        # Estrategias de quiniela
        st.subheader("🎲 Estrategias de Quiniela")

        col1, col2, col3 = st.columns(3)

        with col1:
            if st.button("📊 Conservadora", use_container_width=True):
                quiniela = predictor.generate_quiniela(predictions, strategy="balanced")
                st.info(f"**Apuestas Conservadoras:**\n{quiniela['bet'].tolist()}")

        with col2:
            if st.button("⚡ Arriesgada", use_container_width=True):
                quiniela = predictor.generate_quiniela(predictions, strategy="aggressive")
                st.warning(f"**Apuestas Arriesgadas:**\n{quiniela['bet'].tolist()}")

        with col3:
            if st.button("🏆 Alto Nivel Confianza", use_container_width=True):
                quiniela = predictor.generate_quiniela(predictions, strategy="high_confidence")
                st.success(f"**Apuestas Seguras:**\n{quiniela['bet'].tolist()}")

        # Probabilidades por resultado
        st.subheader("📈 Análisis de Probabilidades")
        prob_1 = predictions["prob_local"].mean() * 100
        prob_x = predictions["prob_draw"].mean() * 100
        prob_2 = predictions["prob_away"].mean() * 100

        fig = go.Figure(
            data=[
                go.Pie(
                    labels=["Local (1)", "Empate (X)", "Visitante (2)"],
                    values=[prob_1, prob_x, prob_2],
                    marker=dict(colors=["#1f77b4", "#ff7f0e", "#2ca02c"]),
                )
            ]
        )
        fig.update_layout(title="Probabilidades Promedio Jornada")
        st.plotly_chart(fig, use_container_width=True)


def show_historical_data():
    """Muestra datos históricos de últimas 5 jornadas."""
    if not st.session_state.data_loaded:
        st.info("Carga los datos primero")
        return

    st.subheader("📊 Últimas 5 Jornadas")

    if st.session_state.last_5 is not None:
        display_df = pd.DataFrame(
            {
                "Fecha": st.session_state.last_5["date"].dt.strftime("%d/%m/%Y"),
                "Jornada": st.session_state.last_5["round"],
                "Local": st.session_state.last_5["home_team"],
                "Goles": st.session_state.last_5.apply(
                    lambda x: f"{x['home_goals']}-{x['away_goals']}", axis=1
                ),
                "Visitante": st.session_state.last_5["away_team"],
            }
        )
        st.dataframe(display_df, use_container_width=True)

        # Estadísticas
        col1, col2, col3 = st.columns(3)
        with col1:
            total_matches = len(st.session_state.last_5)
            st.metric("Partidos", total_matches)
        with col2:
            total_goals = (
                st.session_state.last_5["home_goals"]
                + st.session_state.last_5["away_goals"]
            ).sum()
            st.metric("Goles Totales", total_goals)
        with col3:
            avg_goals = total_goals / total_matches if total_matches > 0 else 0
            st.metric("Media Goles/Partido", f"{avg_goals:.2f}")


def show_standings():
    """Muestra clasificación actual."""
    if not st.session_state.data_loaded:
        st.info("Carga los datos primero")
        return

    st.subheader("🏆 Clasificación LaLiga")

    if st.session_state.standings is not None:
        display_df = st.session_state.standings[
            ["position", "team", "played", "wins", "draws", "losses", "points"]
        ].head(20)
        display_df.columns = [
            "Pos",
            "Equipo",
            "PJ",
            "G",
            "E",
            "P",
            "Pts",
        ]
        st.dataframe(display_df, use_container_width=True)


def main():
    """Función principal."""
    initialize_session_state()

    # Header
    st.markdown("# ⚽ Predictor de Quiniela - LaLiga")
    st.markdown("*Predicciones basadas en Machine Learning*")

    # Sidebar
    with st.sidebar:
        st.header("🎛️ Control")

        if st.button("📥 Cargar Datos", use_container_width=True):
            load_data()

        if st.session_state.data_loaded:
            if st.button("🧠 Entrenar Modelo", use_container_width=True):
                train_model()

        if st.session_state.model_trained and st.session_state.next_matchday is not None:
            if st.button("🔮 Generar Predicciones", use_container_width=True):
                generate_predictions()

        st.divider()

        # Estado
        st.subheader("📊 Estado")
        col1, col2, col3 = st.columns(3)
        with col1:
            status = "✅" if st.session_state.data_loaded else "⏳"
            st.caption(f"{status} Datos")
        with col2:
            status = "✅" if st.session_state.model_trained else "⏳"
            st.caption(f"{status} Modelo")
        with col3:
            status = "✅" if st.session_state.predictions is not None else "⏳"
            st.caption(f"{status} Predicciones")

    # Tabs principales
    tab1, tab2, tab3, tab4 = st.tabs(
        ["🎯 Predicciones", "📊 Histórico", "🏆 Clasificación", "ℹ️ Info"]
    )

    with tab1:
        st.subheader("Predicciones para Próxima Jornada")
        if st.session_state.predictions is not None:
            generate_predictions()
        else:
            st.info(
                "Carga datos → Entrena modelo → Genera predicciones"
            )

    with tab2:
        show_historical_data()

    with tab3:
        show_standings()

    with tab4:
        st.markdown(
            """
        ### ℹ️ Sobre esta Herramienta

        **Funcionalidad:**
        - Descarga datos reales de LaLiga desde football-data.org
        - Entrena modelo ML (Random Forest) con últimas 5 jornadas
        - Predice resultados de próxima jornada
        - Genera quinielas con 3 estrategias diferentes

        **Features del Modelo:**
        - Forma reciente (últimos 5 partidos)
        - Promedio de goles a favor/contra
        - Diferencia de puntos
        - Racha de victorias

        **Estrategias de Quiniela:**
        - **Conservadora**: Solo apuesta si confianza > 40%
        - **Arriesgada**: Solo si confianza > 55%
        - **Alto Nivel Confianza**: Solo si confianza > 60%

        ---
        *Disclaimer: Las predicciones son probabilísticas. No garantizan resultados.*
        """
        )


if __name__ == "__main__":
    main()
