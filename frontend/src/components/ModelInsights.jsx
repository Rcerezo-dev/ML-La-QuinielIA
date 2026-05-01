import React from 'react'

const SimpleChart = ({ data, title }) => {
  const maxValue = Math.max(...data.map((d) => d.value))
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div style={styles.chartCard}>
      <h3 style={styles.chartTitle}>{title}</h3>
      <div style={styles.chartContent}>
        {data.map((item) => (
          <div key={item.label} style={styles.barContainer}>
            <div style={styles.barLabel}>
              <span style={styles.label}>{item.label}</span>
              <span style={styles.value}>{item.value}%</span>
            </div>
            <div style={styles.barBackground}>
              <div
                style={{
                  ...styles.bar,
                  width: `${(item.value / maxValue) * 100}%`,
                  background: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const ConfusionMatrix = ({ data }) => {
  return (
    <div style={styles.chartCard}>
      <h3 style={styles.chartTitle}>Matriz de Confusión</h3>
      <div style={styles.matrixContainer}>
        <table style={styles.matrix}>
          <thead>
            <tr>
              <th style={styles.matrixHeader} />
              <th style={styles.matrixHeader}>Pred: 1</th>
              <th style={styles.matrixHeader}>Pred: X</th>
              <th style={styles.matrixHeader}>Pred: 2</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <td style={{ ...styles.matrixHeader, fontWeight: 600 }}>
                  {['Real: 1', 'Real: X', 'Real: 2'][i]}
                </td>
                {row.map((cell, j) => (
                  <td
                    key={j}
                    style={{
                      ...styles.matrixCell,
                      background:
                        i === j ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.08)',
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const MetricsGrid = ({ metrics }) => {
  return (
    <div style={styles.metricsGrid}>
      {metrics.map((metric, i) => (
        <div key={i} style={styles.metricCard}>
          <div style={styles.metricLabel}>{metric.label}</div>
          <div
            style={{
              ...styles.metricValue,
              color: metric.color || '#f1f5f9',
            }}
          >
            {metric.value}
          </div>
          {metric.change && (
            <div style={{ ...styles.metricChange, color: metric.changeColor }}>
              {metric.change}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export const ModelInsights = ({ modelData }) => {
  const defaultData = {
    outcomeDistribution: [
      { label: 'Local (1)', value: 42, color: '#14b8a6' },
      { label: 'Empate (X)', value: 28, color: '#f59e0b' },
      { label: 'Visitante (2)', value: 30, color: '#3b82f6' },
    ],
    confidenceDistribution: [
      { label: 'Alto (>60%)', value: 45, color: '#22c55e' },
      { label: 'Medio (45-60%)', value: 35, color: '#f59e0b' },
      { label: 'Bajo (<45%)', value: 20, color: '#ef4444' },
    ],
    confusionMatrix: [
      [8, 1, 1],
      [2, 5, 3],
      [1, 2, 7],
    ],
    metrics: [
      { label: 'Accuracy', value: '58%', color: '#14b8a6' },
      { label: 'F1 Score', value: '0.562', color: '#3b82f6' },
      { label: 'Precision', value: '62%', color: '#22c55e', change: '+5%', changeColor: '#22c55e' },
      { label: 'Recall', value: '55%', color: '#f59e0b', change: '-2%', changeColor: '#ef4444' },
    ],
  }

  const data = modelData || defaultData

  return (
    <div style={styles.root}>
      {/* Key Metrics */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Métricas Principales</h2>
        <MetricsGrid metrics={data.metrics} />
      </div>

      {/* Charts Grid */}
      <div style={styles.chartsGrid}>
        <SimpleChart
          data={data.outcomeDistribution}
          title="Distribución de Predicciones"
        />
        <SimpleChart
          data={data.confidenceDistribution}
          title="Distribución de Confianza"
        />
      </div>

      {/* Confusion Matrix */}
      <div style={styles.section}>
        <ConfusionMatrix data={data.confusionMatrix} />
      </div>

      {/* Analysis Text */}
      <div style={styles.analysisCard}>
        <h3 style={styles.analysisTitle}>📊 Análisis</h3>
        <p style={styles.analysisText}>
          El modelo muestra una <strong>buena capacidad predictiva</strong> con un accuracy de 58%,
          superior al baseline (33.3% para 3 clases). Los aciertos se distribuyen bien en todas
          las categorías. El F1 Score ponderado de 0.562 indica un buen balance entre precision y recall.
        </p>
        <p style={styles.analysisText}>
          <strong>Puntos fuertes:</strong> El modelo predice bien los resultados locales (8/10 aciertos).
          <strong>Áreas de mejora:</strong> El empate es más difícil de predecir (solo 5/10).
        </p>
      </div>
    </div>
  )
}

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  sectionTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 18,
    fontWeight: 700,
    color: '#f1f5f9',
    margin: 0,
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: 12,
  },
  metricCard: {
    background: '#1E293B',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: '16px',
    textAlign: 'center',
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#64748b',
    marginBottom: 8,
  },
  metricValue: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 4,
  },
  metricChange: {
    fontSize: 12,
    fontWeight: 600,
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 16,
  },
  chartCard: {
    background: '#1E293B',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
  },
  chartTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 15,
    fontWeight: 700,
    color: '#f1f5f9',
    marginBottom: 16,
    margin: 0,
  },
  chartContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  barContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  barLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: 500,
  },
  value: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 13,
    fontWeight: 700,
    color: '#f1f5f9',
  },
  barBackground: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 4,
    height: 6,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 600ms cubic-bezier(0.16,1,0.3,1)',
  },
  matrixContainer: {
    overflowX: 'auto',
  },
  matrix: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 12,
  },
  matrixHeader: {
    padding: '10px 12px',
    textAlign: 'center',
    background: 'rgba(20,184,166,0.05)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    color: '#94a3b8',
    fontWeight: 600,
  },
  matrixCell: {
    padding: '10px 12px',
    textAlign: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    color: '#f1f5f9',
    fontWeight: 600,
  },
  analysisCard: {
    background: 'rgba(59,130,246,0.08)',
    border: '1px solid rgba(59,130,246,0.3)',
    borderRadius: 12,
    padding: 20,
  },
  analysisTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 15,
    fontWeight: 700,
    color: '#f1f5f9',
    margin: '0 0 12px 0',
  },
  analysisText: {
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 1.6,
    margin: '0 0 10px 0',
  },
}
