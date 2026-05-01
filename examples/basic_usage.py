"""
Ejemplos de uso básico de la librería quiniela-predictor.
Estos ejemplos muestran cómo usar los módulos de forma programática.
"""

import sys
from pathlib import Path

# Setup path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.scraper import LaLigaScraper, scrape_all_data
from src.trainer import train_complete_model
from src.predictor import Predictor
from src.utils import create_directories

# ============================================================================
# EJEMPLO 1: Pipeline completo básico
# ============================================================================
def example_1_basic_pipeline():
    """Ejemplo más simple: descarga, entrena, predice."""
    print("\n" + "="*60)
    print("EJEMPLO 1: Pipeline Básico")
    print("="*60)

    # 1. Descargar datos
    print("\n1. Descargando datos...")
    last_5, next_matchday, standings = scrape_all_data()

    print(f"   ✓ {len(last_5)} partidos históricos")
    print(f"   ✓ {len(next_matchday)} partidos próxima jornada")

    # 2. Entrenar modelo
    print("\n2. Entrenando modelo...")
    trainer, metrics = train_complete_model(last_5)

    print(f"   ✓ Accuracy: {metrics['accuracy']:.2%}")
    print(f"   ✓ F1 Score: {metrics['f1_score']:.4f}")

    # 3. Predecir
    print("\n3. Generando predicciones...")
    predictor = Predictor(trainer, last_5)
    predictions = predictor.predict_matchday(next_matchday)

    print(f"   ✓ {len(predictions)} predicciones generadas")

    # 4. Mostrar resultados
    print("\n4. Resultados:")
    for _, pred in predictions.iterrows():
        print(f"   {pred['home_team']} vs {pred['away_team']}")
        print(f"      Predicción: {pred['prediction_label']} | Confianza: {pred['confidence']:.1%}")


# ============================================================================
# EJEMPLO 2: Acceso a datos en pasos
# ============================================================================
def example_2_step_by_step():
    """Ejemplo avanzado: control granular sobre cada paso."""
    print("\n" + "="*60)
    print("EJEMPLO 2: Paso a Paso")
    print("="*60)

    # Setup
    create_directories()

    # Instancia scraper
    scraper = LaLigaScraper()

    # Obtiene datos
    print("\n1. Obteniendo datos...")
    standings = scraper.get_standings()
    print(f"   ✓ Clasificación: {standings.iloc[0]['team']} lidera con {standings.iloc[0]['points']} pts")

    # Últimas jornadas
    last_5 = scraper.get_last_n_matchdays(n=5)
    print(f"   ✓ Últimas 5 jornadas: {len(last_5)} partidos")

    # Próxima jornada
    next_matchday = scraper.get_next_matchday()
    if next_matchday is not None:
        print(f"   ✓ Próxima jornada: {len(next_matchday)} partidos programados")

    # Guarda datos
    scraper.save_data(standings, "standings.csv")
    scraper.save_data(last_5, "matches_history.csv")


# ============================================================================
# EJEMPLO 3: Múltiples estrategias
# ============================================================================
def example_3_multiple_strategies():
    """Ejemplo: Compara múltiples estrategias de quiniela."""
    print("\n" + "="*60)
    print("EJEMPLO 3: Múltiples Estrategias")
    print("="*60)

    # Obtén datos
    last_5, next_matchday, _ = scrape_all_data()

    # Entrena
    trainer, _ = train_complete_model(last_5)

    # Predice
    predictor = Predictor(trainer, last_5)
    predictions = predictor.predict_matchday(next_matchday)

    # Compara estrategias
    strategies = ["balanced", "aggressive", "high_confidence"]

    print("\nComparación de estrategias:")
    for strategy in strategies:
        quiniela = predictor.generate_quiniela(predictions, strategy=strategy)
        bets = quiniela["bet"].tolist()
        print(f"\n{strategy.upper()}:")
        print(f"   Quiniela: {','.join(bets)}")
        print(f"   Confianza promedio: {predictions['confidence'].mean():.1%}")


# ============================================================================
# EJEMPLO 4: Análisis de modelo
# ============================================================================
def example_4_model_analysis():
    """Ejemplo: Analiza características del modelo."""
    print("\n" + "="*60)
    print("EJEMPLO 4: Análisis del Modelo")
    print("="*60)

    last_5, _, _ = scrape_all_data()
    trainer, metrics = train_complete_model(last_5)

    # Features importantes
    print("\nTop 10 Features más importantes:")
    importance = trainer.get_feature_importance(top_n=10)

    for i, (feature, imp) in enumerate(importance.items(), 1):
        bar = "█" * int(imp * 100)
        print(f"{i:2d}. {feature:<30s} {bar} {imp:.4f}")

    # Métricas
    print("\nMétricas de Evaluación:")
    metrics_eval = trainer.get_metrics()
    print(f"   Accuracy:         {metrics_eval['accuracy']:.2%}")
    print(f"   F1 Score:         {metrics_eval['f1_score']:.4f}")


# ============================================================================
# EJEMPLO 5: Predicción manual de partido
# ============================================================================
def example_5_single_match():
    """Ejemplo: Predice un partido específico."""
    print("\n" + "="*60)
    print("EJEMPLO 5: Predicción de Partido Individual")
    print("="*60)

    import pandas as pd

    last_5, _, _ = scrape_all_data()
    trainer, _ = train_complete_model(last_5)

    predictor = Predictor(trainer, last_5)

    # Predicción de partido específico
    home_team = "Real Madrid"
    away_team = "Barcelona"
    match_date = pd.Timestamp.now()

    print(f"\nPredicción: {home_team} vs {away_team}")

    pred = predictor.predict_match(home_team, away_team, match_date)

    if pred:
        print(f"\n   Resultado esperado: {pred['prediction_label']}")
        print(f"   Probabilidad Local (1): {pred['prob_local']:.1%}")
        print(f"   Probabilidad Empate (X): {pred['prob_draw']:.1%}")
        print(f"   Probabilidad Visitante (2): {pred['prob_away']:.1%}")
        print(f"   Confianza: {pred['confidence']:.1%}")


# ============================================================================
# EJEMPLO 6: Trabajar con datos cargados
# ============================================================================
def example_6_work_with_saved_data():
    """Ejemplo: Carga datos guardados y entrena modelo."""
    print("\n" + "="*60)
    print("EJEMPLO 6: Trabajar con Datos Guardados")
    print("="*60)

    scraper = LaLigaScraper()

    # Carga datos guardados localmente
    matches = scraper.load_data("last_5_matchdays.csv")

    if matches is not None:
        print(f"\n✓ Datos cargados: {len(matches)} partidos")

        trainer, metrics = train_complete_model(matches)
        print(f"✓ Modelo entrenado con accuracy: {metrics['accuracy']:.2%}")
    else:
        print("❌ Datos no encontrados. Ejecuta primero scrape_all_data()")


# ============================================================================
# EJEMPLO 7: Exportar predicciones
# ============================================================================
def example_7_export_predictions():
    """Ejemplo: Exporta predicciones a diferentes formatos."""
    print("\n" + "="*60)
    print("EJEMPLO 7: Exportar Predicciones")
    print("="*60)

    last_5, next_matchday, _ = scrape_all_data()
    trainer, _ = train_complete_model(last_5)

    predictor = Predictor(trainer, last_5)
    predictions = predictor.predict_matchday(next_matchday)

    # CSV
    csv_path = "predictions.csv"
    predictions.to_csv(csv_path, index=False)
    print(f"\n✓ Predicciones exportadas a: {csv_path}")

    # JSON
    json_path = "predictions.json"
    predictions.to_json(json_path, orient="records", indent=2)
    print(f"✓ Predicciones exportadas a: {json_path}")

    # HTML
    html_path = "predictions.html"
    predictions.to_html(html_path)
    print(f"✓ Predicciones exportadas a: {html_path}")


# ============================================================================
# Main
# ============================================================================
if __name__ == "__main__":
    import sys

    examples = {
        "1": ("Pipeline Básico", example_1_basic_pipeline),
        "2": ("Paso a Paso", example_2_step_by_step),
        "3": ("Múltiples Estrategias", example_3_multiple_strategies),
        "4": ("Análisis del Modelo", example_4_model_analysis),
        "5": ("Predicción Individual", example_5_single_match),
        "6": ("Datos Guardados", example_6_work_with_saved_data),
        "7": ("Exportar Predicciones", example_7_export_predictions),
    }

    print("\n" + "=" * 60)
    print("EJEMPLOS DE USO - QUINIELA PREDICTOR")
    print("=" * 60)

    for key, (name, _) in examples.items():
        print(f"{key}. {name}")

    if len(sys.argv) > 1 and sys.argv[1] in examples:
        _, func = examples[sys.argv[1]]
        func()
    else:
        print("\nUso: python examples/basic_usage.py [1-7]")
        print("Ejemplo: python examples/basic_usage.py 1")
