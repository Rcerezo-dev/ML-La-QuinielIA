"""
Script CLI para predicción de quinielas LaLiga.
Uso: python scripts/predict.py
"""

import sys
from pathlib import Path

# Añade src al path
sys.path.insert(0, str(Path(__file__).parent.parent))

import pandas as pd
from src.scraper import scrape_all_data
from src.trainer import train_complete_model
from src.predictor import Predictor


def print_header(title: str):
    """Imprime header decorativo."""
    print("\n" + "=" * 60)
    print(f"  {title}")
    print("=" * 60 + "\n")


def print_matches(df: pd.DataFrame):
    """Imprime tabla de partidos."""
    for _, row in df.iterrows():
        print(f"  {row['home_team']:20s} vs {row['away_team']:20s}")


def print_predictions(predictions_df: pd.DataFrame):
    """Imprime predicciones formateadas."""
    print(f"{'Partido':<45} {'Pred':^8} {'1':>7} {'X':>7} {'2':>7} {'Conf':>6}")
    print("-" * 85)

    for _, row in predictions_df.iterrows():
        partido = f"{row['home_team']} vs {row['away_team']}"
        pred = row['prediction']
        prob1 = f"{row['prob_local']*100:.1f}%"
        probx = f"{row['prob_draw']*100:.1f}%"
        prob2 = f"{row['prob_away']*100:.1f}%"
        conf = f"{row['confidence']*100:.1f}%"

        print(f"{partido:<45} {pred:^8} {prob1:>7} {probx:>7} {prob2:>7} {conf:>6}")


def main():
    """Función principal."""

    print_header("⚽ PREDICTOR DE QUINIELA - LaLiga")

    # 1. Descarga datos
    print("1️⃣  DESCARGANDO DATOS...")
    print("   - Últimos 20 partidos")
    print("   - Próxima jornada")
    print("   - Clasificación actual")

    last_20, next_matchday, standings = scrape_all_data()

    if last_20 is None or len(last_20) == 0:
        print("\n❌ Error al descargar datos. Verifica tu API key en .env")
        return

    print(f"\n✅ Datos descargados:")
    print(f"   - {len(last_20)} partidos históricos")
    print(f"   - {len(next_matchday) if next_matchday is not None else 0} partidos próxima jornada")
    print(f"   - {len(standings) if standings is not None else 0} equipos en clasificación")

    # 2. Entrenamiento
    print_header("2️⃣  ENTRENANDO MODELO")
    print("   Algorithm: Random Forest (100 árboles, max_depth=15)")
    print("   Train/Test: 80/20")

    trainer, metrics = train_complete_model(last_20)

    print(f"\n✅ Modelo entrenado:")
    print(f"   - Accuracy:  {metrics['accuracy']:.2%}")
    print(f"   - F1 Score:  {metrics['f1_score']:.4f}")

    # Confusion matrix
    conf_matrix = metrics['confusion_matrix']
    print(f"\n📊 Confusion Matrix:")
    print(f"   {'':8s} {'Local(0)':>8s} {'Empate(1)':>10s} {'Visit(2)':>8s}")
    print(f"   Local:   {conf_matrix[0][0]:8d} {conf_matrix[0][1]:10d} {conf_matrix[0][2]:8d}")
    print(f"   Empate:  {conf_matrix[1][0]:8d} {conf_matrix[1][1]:10d} {conf_matrix[1][2]:8d}")
    print(f"   Visit:   {conf_matrix[2][0]:8d} {conf_matrix[2][1]:10d} {conf_matrix[2][2]:8d}")

    # Precision, recall, f1 por clase
    report = metrics['report']
    print(f"\n📈 Métricas por clase:")
    print(f"   {'Clase':<12s} {'Precision':>10s} {'Recall':>10s} {'F1-Score':>10s}")
    print(f"   Local:     {report['0']['precision']:10.3f} {report['0']['recall']:10.3f} {report['0']['f1-score']:10.3f}")
    print(f"   Empate:    {report['1']['precision']:10.3f} {report['1']['recall']:10.3f} {report['1']['f1-score']:10.3f}")
    print(f"   Visitante: {report['2']['precision']:10.3f} {report['2']['recall']:10.3f} {report['2']['f1-score']:10.3f}")

    # Features importantes
    print("\n📊 Top 5 Features:")
    importance = trainer.get_feature_importance(top_n=5)
    for i, (feature, imp) in enumerate(importance.items(), 1):
        print(f"   {i}. {feature:<30s} {imp:.4f}")

    # 3. Predicciones
    if next_matchday is None or len(next_matchday) == 0:
        print("\n⚠️  Próxima jornada no disponible. Fin.")
        return

    print_header("3️⃣  GENERANDO PREDICCIONES")
    print(f"   Jornada próxima: {len(next_matchday)} partidos\n")

    predictor = Predictor(trainer, last_20)
    predictions = predictor.predict_matchday(next_matchday)

    print_predictions(predictions)

    # 4. Estadísticas
    print_header("4️⃣  ESTADÍSTICAS")

    print("Promedio de probabilidades:")
    print(f"   Local (1): {predictions['prob_local'].mean()*100:.1f}%")
    print(f"   Empate (X): {predictions['prob_draw'].mean()*100:.1f}%")
    print(f"   Visitante (2): {predictions['prob_away'].mean()*100:.1f}%")

    print(f"\nConfianza media: {predictions['confidence'].mean()*100:.1f}%")
    print(f"Confianza máxima: {predictions['confidence'].max()*100:.1f}%")
    print(f"Confianza mínima: {predictions['confidence'].min()*100:.1f}%")

    # 5. Quinielas
    print_header("5️⃣  QUINIELAS GENERADAS")

    strategies = {
        "Conservadora (>40%)": "balanced",
        "Arriesgada (>55%)": "aggressive",
        "Alta Confianza (>60%)": "high_confidence",
    }

    for strategy_name, strategy_code in strategies.items():
        quiniela = predictor.generate_quiniela(predictions, strategy=strategy_code)
        apuestas = quiniela["bet"].tolist()
        print(f"\n📊 {strategy_name}:")
        print(f"   Quiniela: {','.join(apuestas)}")

    # Guarda predicciones en CSV
    output_path = Path(__file__).parent.parent / "data" / "processed" / "predictions.csv"
    predictions.to_csv(output_path, index=False)
    print(f"\n💾 Predicciones guardadas en: {output_path}")

    print_header("✅ PROCESO COMPLETADO")


if __name__ == "__main__":
    main()
