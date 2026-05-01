"""
Script para mostrar métricas del modelo ML.
Uso: python scripts/model_metrics.py
"""

import sys
from pathlib import Path
import numpy as np

sys.path.insert(0, str(Path(__file__).parent.parent))

from src.scraper import scrape_all_data
from src.trainer import train_complete_model


def print_section(title: str):
    """Imprime sección con decoración."""
    print("\n" + "=" * 70)
    print(f"  {title}")
    print("=" * 70)


def print_metrics():
    """Calcula y muestra métricas detalladas del modelo."""

    print_section("⚽ EVALUACIÓN DEL MODELO ML - LaLiga")

    # Descarga datos
    print("\n📥 Descargando últimos 20 partidos...")
    last_20, _, standings = scrape_all_data()

    if last_20 is None or len(last_20) == 0:
        print("❌ Error al descargar datos")
        return

    print(f"✅ {len(last_20)} partidos cargados")

    # Entrena modelo
    print("\n🔧 Entrenando modelo...")
    trainer, metrics = train_complete_model(last_20)
    print("✅ Modelo entrenado")

    # Muestra métricas principales
    print_section("📊 MÉTRICAS PRINCIPALES")

    accuracy = metrics["accuracy"]
    f1 = metrics["f1_score"]

    print(f"\n  Accuracy (Precisión general):  {accuracy:>7.2%}")
    print(f"  F1 Score (Balance P/R):        {f1:>7.4f}")

    # Confusion Matrix
    print_section("🎯 MATRIZ DE CONFUSIÓN")

    conf_matrix = np.array(metrics["confusion_matrix"])
    print("\n  Predicción vs Real:")
    print(f"  {'':12s} {'Local(0)':>10s} {'Empate(1)':>12s} {'Visit(2)':>10s} {'Total':>8s}")
    print(f"  {'-' * 60}")

    for i, label in enumerate(["Local(0)", "Empate(1)", "Visit(2)"]):
        row_total = conf_matrix[i].sum()
        print(
            f"  {label:<12s} {conf_matrix[i][0]:>10d} {conf_matrix[i][1]:>12d} "
            f"{conf_matrix[i][2]:>10d} {int(row_total):>8d}"
        )

    totals = conf_matrix.sum(axis=0)
    print(f"  {'-' * 60}")
    print(f"  {'Total':<12s} {int(totals[0]):>10d} {int(totals[1]):>12d} {int(totals[2]):>10d}")

    # Métricas por clase
    print_section("📈 MÉTRICAS POR CLASE (RESULTADO)")

    report = metrics["report"]

    print(f"\n  {'Clase':<15s} {'Precision':>12s} {'Recall':>12s} {'F1-Score':>12s} {'Support':>10s}")
    print(f"  {'-' * 65}")

    for class_idx, class_name in enumerate(["Local (1)", "Empate (X)", "Visitante (2)"]):
        class_str = str(class_idx)
        if class_str in report:
            p = report[class_str]["precision"]
            r = report[class_str]["recall"]
            f = report[class_str]["f1-score"]
            s = int(report[class_str]["support"])
            print(f"  {class_name:<15s} {p:>12.3f} {r:>12.3f} {f:>12.3f} {s:>10d}")

    # Weighted averages
    if "weighted avg" in report:
        wav = report["weighted avg"]
        print(f"  {'-' * 65}")
        print(
            f"  {'Weighted Avg':<15s} {wav['precision']:>12.3f} {wav['recall']:>12.3f} "
            f"{wav['f1-score']:>12.3f}"
        )

    # Feature importance
    print_section("⭐ TOP 10 FEATURES MÁS IMPORTANTES")

    importance = trainer.get_feature_importance(top_n=10)

    max_name_len = max(len(name) for name in importance.keys())

    for i, (feature, imp) in enumerate(importance.items(), 1):
        bar_length = int(imp * 100)
        bar = "█" * bar_length + "░" * (50 - bar_length)
        print(f"  {i:2d}. {feature:<{max_name_len}s} {bar} {imp:.4f}")

    # Resumen
    print_section("✅ RESUMEN")

    print(f"\n  ✓ Datos de entrenamiento:    {len(last_20)} partidos")
    print(f"  ✓ Algoritmo:                 Random Forest (100 árboles, max_depth=15)")
    print(f"  ✓ Split entrenamiento/test:  80/20")
    print(f"  ✓ Clases:                    3 (Local, Empate, Visitante)")
    print(f"  ✓ Features:                  {len(trainer.feature_cols)} variables predictivas")
    print(f"\n  📊 Accuracy Final:           {accuracy:.2%}")
    print(f"  📊 F1 Score Ponderado:       {f1:.4f}")

    # Interpretación
    print_section("💡 INTERPRETACIÓN")

    if accuracy >= 0.50:
        print("\n  ✅ El modelo muestra mejor que chance (33.3%)")
    else:
        print("\n  ⚠️  El modelo está cerca del baseline")

    if accuracy >= 0.60:
        print("  ✅ Buena capacidad predictiva")

    if accuracy >= 0.70:
        print("  ✅ Muy buena capacidad predictiva")

    print(f"\n  El F1 Score de {f1:.4f} indica balance entre precision y recall")

    # Notas
    print_section("📝 NOTAS")
    print("""
  • Estos son datos de ENTRENAMIENTO. Las predicciones en producción
    pueden variar.

  • El modelo tiene acceso a información histórica de los últimos 20
    partidos de cada equipo.

  • La predicción de fútbol es inherentemente incierta. Incluso modelos
    con >60% accuracy son considerados muy buenos en este dominio.

  • Usa las predicciones como herramienta de análisis, no como verdad
    absoluta.
    """)

    print("\n" + "=" * 70)
    print("  ✅ Evaluación completada")
    print("=" * 70 + "\n")


if __name__ == "__main__":
    print_metrics()
