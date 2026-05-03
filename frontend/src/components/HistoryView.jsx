import React, { useState, useEffect, useMemo } from 'react'
import { apiClient } from '../api/client'

const PickBadge = ({ pick, size = 28 }) => {
  if (!pick) {
    return (
      <span style={{ ...styles.badge, ...styles.badgeNeutral, width: size, height: size }}>–</span>
    )
  }
  const palette = { '1': styles.badge1, X: styles.badgeX, '2': styles.badge2 }
  return (
    <span style={{ ...styles.badge, ...(palette[pick] || styles.badgeNeutral), width: size, height: size }}>
      {pick}
    </span>
  )
}

const formatDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d)) return ''
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

const formatMatchTime = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d)) return ''
  return d.toLocaleString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const computeMetrics = (entry) => {
  if (!entry) return null
  const preds = entry.predictions || []
  const total = preds.length
  const finished = preds.filter((p) => p.actual != null).length
  const pending = total - finished
  const hits = preds.filter((p) => p.hit === true).length

  const accuracy = finished > 0 ? hits / finished : null

  const confidences = preds.map((p) => p.confidence).filter((c) => typeof c === 'number')
  const avgConfidence =
    confidences.length > 0 ? confidences.reduce((a, b) => a + b, 0) / confidences.length : null

  const finishedPreds = preds.filter((p) => p.actual != null && typeof p.confidence === 'number')
  const hitConfs = finishedPreds.filter((p) => p.hit).map((p) => p.confidence)
  const missConfs = finishedPreds.filter((p) => !p.hit).map((p) => p.confidence)
  const avgConfHits = hitConfs.length > 0 ? hitConfs.reduce((a, b) => a + b, 0) / hitConfs.length : null
  const avgConfMisses = missConfs.length > 0 ? missConfs.reduce((a, b) => a + b, 0) / missConfs.length : null

  const distribution = { '1': 0, X: 0, '2': 0 }
  preds.forEach((p) => {
    if (p.prediction in distribution) distribution[p.prediction] += 1
  })

  const actualDistribution = { '1': 0, X: 0, '2': 0 }
  preds.forEach((p) => {
    if (p.actual && p.actual in actualDistribution) actualDistribution[p.actual] += 1
  })

  return {
    total,
    finished,
    pending,
    hits,
    accuracy,
    avgConfidence,
    avgConfHits,
    avgConfMisses,
    distribution,
    actualDistribution,
  }
}

export const HistoryView = () => {
  const [history, setHistory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRound, setSelectedRound] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.getHistory()
      setHistory(data)
      if (data.entries && data.entries.length > 0) {
        // Mantén la jornada seleccionada si sigue existiendo, si no, la más reciente
        const stillExists = data.entries.find((e) => e.round === selectedRound)
        if (!stillExists) {
          setSelectedRound(data.entries[0].round)
        }
      } else {
        setSelectedRound(null)
      }
    } catch (err) {
      setError(err.message || 'Error desconocido')
    }
    setLoading(false)
  }

  const refreshResults = async () => {
    setRefreshing(true)
    setError(null)
    try {
      await apiClient.loadData()
      await load()
    } catch (err) {
      setError('Error al refrescar resultados: ' + (err.message || ''))
    }
    setRefreshing(false)
  }

  const removeEntry = async (round) => {
    if (!confirm(`¿Borrar la quiniela de la jornada ${round} del histórico?`)) return
    setDeleting(true)
    try {
      await apiClient.deleteHistoryEntry(round)
      await load()
    } catch (err) {
      setError(err.message || 'Error al borrar')
    }
    setDeleting(false)
  }

  const selectedEntry = useMemo(() => {
    if (!history || !history.entries) return null
    return history.entries.find((e) => e.round === selectedRound) || null
  }, [history, selectedRound])

  const metrics = useMemo(() => computeMetrics(selectedEntry), [selectedEntry])

  if (loading) {
    return <div style={styles.empty}>Cargando histórico...</div>
  }

  if (error) {
    return (
      <div>
        <div style={styles.error}>⚠️ {error}</div>
        <button style={styles.btnPrimary} onClick={load}>Reintentar</button>
      </div>
    )
  }

  if (!history || !history.entries || history.entries.length === 0) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon}>📊</div>
        <p style={styles.emptyTitle}>Aún no hay quinielas guardadas</p>
        <p style={styles.emptySub}>
          Genera predicciones para una jornada y se guardarán automáticamente aquí.
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Resumen global */}
      <div style={styles.globalSummary}>
        <div style={styles.globalLabel}>Resumen global</div>
        <div style={styles.globalValues}>
          <div>
            <span style={styles.globalNum}>{history.total_quinielas}</span>{' '}
            <span style={styles.globalUnit}>quinielas</span>
          </div>
          <div style={styles.globalDot}>·</div>
          <div>
            <span style={styles.globalNum}>{history.overall_hits}</span>
            <span style={styles.globalUnit}> / {history.overall_finished || 0} aciertos</span>
          </div>
          <div style={styles.globalDot}>·</div>
          <div>
            <span style={styles.globalNum}>
              {history.overall_accuracy != null
                ? `${Math.round(history.overall_accuracy * 100)}%`
                : '—'}
            </span>
            <span style={styles.globalUnit}> accuracy</span>
          </div>
        </div>
        <button
          onClick={refreshResults}
          disabled={refreshing}
          className="lq-btn-primary"
          style={styles.refreshBtn}
        >
          {refreshing ? 'Actualizando...' : '↻ Actualizar resultados'}
        </button>
      </div>

      {/* Selector de jornadas */}
      <div style={styles.selectorWrap}>
        <div style={styles.selectorLabel}>Jornadas con quiniela guardada</div>
        <div style={styles.chips}>
          {history.entries
            .slice()
            .sort((a, b) => a.round - b.round)
            .map((e) => {
              const isSelected = e.round === selectedRound
              const accPct = e.accuracy != null ? Math.round(e.accuracy * 100) : null
              return (
                <button
                  key={e.round}
                  onClick={() => setSelectedRound(e.round)}
                  style={{
                    ...styles.chip,
                    ...(isSelected ? styles.chipActive : {}),
                  }}
                >
                  <span style={styles.chipRound}>J{e.round}</span>
                  {e.pending === 0 && accPct != null && (
                    <span
                      style={{
                        ...styles.chipPill,
                        ...(accPct >= 60
                          ? styles.accGood
                          : accPct >= 40
                          ? styles.accMid
                          : styles.accBad),
                      }}
                    >
                      {accPct}%
                    </span>
                  )}
                  {e.pending > 0 && (
                    <span style={{ ...styles.chipPill, ...styles.chipPending }}>
                      {e.pending} pte
                    </span>
                  )}
                </button>
              )
            })}
        </div>
      </div>

      {selectedEntry && (
        <>
          {/* Cabecera de la jornada */}
          <div style={styles.entryHead}>
            <div>
              <h2 style={styles.entryTitle}>Jornada {selectedEntry.round}</h2>
              <p style={styles.entrySub}>
                Predicha el {formatDate(selectedEntry.predicted_at)} · {selectedEntry.total} partidos
              </p>
            </div>
            <button style={styles.deleteBtn} onClick={() => removeEntry(selectedEntry.round)} disabled={deleting}>
              Borrar quiniela
            </button>
          </div>

          {/* Panel de métricas */}
          <MetricsPanel metrics={metrics} entry={selectedEntry} />

          {/* Tabla de partidos */}
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>Partido</th>
                  <th style={styles.thCenter}>Predicción</th>
                  <th style={styles.thCenter}>Confianza</th>
                  <th style={styles.thCenter}>Resultado</th>
                  <th style={styles.thCenter}>Real</th>
                  <th style={styles.thCenter}>Acierto</th>
                </tr>
              </thead>
              <tbody>
                {selectedEntry.predictions.map((p, i) => (
                  <tr key={i} style={i % 2 === 1 ? styles.trOdd : null}>
                    <td style={styles.td}>
                      <div style={styles.matchCell}>
                        <span style={styles.matchTeams}>
                          {p.home_team} <span style={styles.vs}>vs</span> {p.away_team}
                        </span>
                        {p.date && <span style={styles.matchDate}>{formatMatchTime(p.date)}</span>}
                      </div>
                    </td>
                    <td style={styles.tdCenter}>
                      <PickBadge pick={p.prediction} />
                    </td>
                    <td style={styles.tdCenter}>
                      {typeof p.confidence === 'number'
                        ? `${Math.round(p.confidence * 100)}%`
                        : '—'}
                    </td>
                    <td style={styles.tdCenter}>
                      {p.home_goals != null && p.away_goals != null
                        ? `${p.home_goals} - ${p.away_goals}`
                        : '—'}
                    </td>
                    <td style={styles.tdCenter}>
                      <PickBadge pick={p.actual} />
                    </td>
                    <td style={styles.tdCenter}>
                      {p.hit == null ? (
                        <span style={styles.muted}>—</span>
                      ) : p.hit ? (
                        <span style={styles.hit}>✓</span>
                      ) : (
                        <span style={styles.miss}>✗</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

const MetricsPanel = ({ metrics, entry }) => {
  if (!metrics) return null

  const accPct = metrics.accuracy != null ? Math.round(metrics.accuracy * 100) : null
  const accColor =
    accPct == null
      ? '#94a3b8'
      : accPct >= 60
      ? '#4ade80'
      : accPct >= 40
      ? '#fbbf24'
      : '#fca5a5'

  const Stat = ({ label, value, sub, color }) => (
    <div style={styles.stat}>
      <div style={styles.statLabel}>{label}</div>
      <div style={{ ...styles.statValue, color: color || '#f1f5f9' }}>{value}</div>
      {sub && <div style={styles.statSub}>{sub}</div>}
    </div>
  )

  return (
    <div>
      <div style={styles.metricsRow}>
        <Stat
          label="Aciertos"
          value={`${metrics.hits}/${metrics.finished || 0}`}
          sub={metrics.pending > 0 ? `${metrics.pending} pendientes` : 'Jornada completa'}
        />
        <Stat
          label="Accuracy"
          value={accPct != null ? `${accPct}%` : '—'}
          sub={accPct == null ? 'Sin resultados aún' : null}
          color={accColor}
        />
        <Stat
          label="Confianza media"
          value={metrics.avgConfidence != null ? `${Math.round(metrics.avgConfidence * 100)}%` : '—'}
          sub="Sobre todos los picks"
        />
        <Stat
          label="Conf. en aciertos"
          value={metrics.avgConfHits != null ? `${Math.round(metrics.avgConfHits * 100)}%` : '—'}
          sub={
            metrics.avgConfMisses != null
              ? `vs ${Math.round(metrics.avgConfMisses * 100)}% en fallos`
              : null
          }
          color="#2dd4bf"
        />
      </div>

      <div style={styles.distRow}>
        <DistBar
          title="Predicciones del modelo"
          dist={metrics.distribution}
          total={metrics.total}
        />
        <DistBar
          title="Resultados reales"
          dist={metrics.actualDistribution}
          total={metrics.finished}
          empty={metrics.finished === 0 ? 'Sin resultados aún' : null}
        />
      </div>
    </div>
  )
}

const DistBar = ({ title, dist, total, empty }) => {
  const pct = (n) => (total > 0 ? Math.round((n / total) * 100) : 0)
  return (
    <div style={styles.distCard}>
      <div style={styles.distTitle}>{title}</div>
      {empty ? (
        <div style={styles.distEmpty}>{empty}</div>
      ) : (
        <div style={styles.distBars}>
          <DistRow label="1" value={dist['1']} pct={pct(dist['1'])} color="#2dd4bf" />
          <DistRow label="X" value={dist.X} pct={pct(dist.X)} color="#fbbf24" />
          <DistRow label="2" value={dist['2']} pct={pct(dist['2'])} color="#60a5fa" />
        </div>
      )}
    </div>
  )
}

const DistRow = ({ label, value, pct, color }) => (
  <div style={styles.distRowItem}>
    <span style={styles.distLabel}>{label}</span>
    <div style={styles.distTrack}>
      <div style={{ ...styles.distFill, width: `${pct}%`, background: color }} />
    </div>
    <span style={styles.distValue}>
      {value} <span style={styles.distPct}>({pct}%)</span>
    </span>
  </div>
)

const styles = {
  empty: {
    background: '#1E293B',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 40,
    textAlign: 'center',
    color: '#cbd5e1',
  },
  emptyIcon: { fontSize: 36, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: 600, marginBottom: 8 },
  emptySub: { fontSize: 13, color: '#64748b' },
  error: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 12,
    padding: 16,
    color: '#fca5a5',
    marginBottom: 12,
  },
  btnPrimary: {
    padding: '10px 18px',
    border: 'none',
    borderRadius: 8,
    background: '#14b8a6',
    color: '#0f172a',
    fontWeight: 600,
    cursor: 'pointer',
  },

  globalSummary: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    background: '#1E293B',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: '14px 20px',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  globalLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#64748b',
  },
  globalValues: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    flexWrap: 'wrap',
  },
  globalNum: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 18,
    fontWeight: 700,
    color: '#f1f5f9',
  },
  globalUnit: { fontSize: 12, color: '#94a3b8' },
  globalDot: { color: '#475569' },
  refreshBtn: { fontSize: 13 },

  selectorWrap: {
    background: '#1E293B',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: '14px 18px',
    marginBottom: 18,
  },
  selectorLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#64748b',
    marginBottom: 12,
  },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 12px',
    borderRadius: 9999,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.03)',
    color: '#cbd5e1',
    fontSize: 13,
    cursor: 'pointer',
    transition: 'all 150ms',
  },
  chipActive: {
    border: '1px solid rgba(20,184,166,0.5)',
    background: 'rgba(20,184,166,0.15)',
    color: '#2dd4bf',
  },
  chipRound: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
  },
  chipPill: {
    fontSize: 10,
    fontWeight: 700,
    padding: '2px 7px',
    borderRadius: 9999,
  },
  chipPending: { background: 'rgba(245,158,11,0.18)', color: '#fbbf24' },
  accGood: { background: 'rgba(74,222,128,0.18)', color: '#4ade80' },
  accMid: { background: 'rgba(245,158,11,0.18)', color: '#fbbf24' },
  accBad: { background: 'rgba(239,68,68,0.18)', color: '#fca5a5' },

  entryHead: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 16,
  },
  entryTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 24,
    fontWeight: 700,
    color: '#f1f5f9',
    margin: 0,
  },
  entrySub: { fontSize: 13, color: '#94a3b8', marginTop: 4 },
  deleteBtn: {
    background: 'transparent',
    border: '1px solid rgba(239,68,68,0.3)',
    color: '#fca5a5',
    padding: '8px 14px',
    borderRadius: 8,
    fontSize: 12,
    cursor: 'pointer',
  },

  metricsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 12,
    marginBottom: 16,
  },
  stat: {
    background: '#1E293B',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: '14px 18px',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#64748b',
    marginBottom: 6,
  },
  statValue: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 26,
    fontWeight: 700,
  },
  statSub: { fontSize: 11, color: '#64748b', marginTop: 4 },

  distRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 12,
    marginBottom: 18,
  },
  distCard: {
    background: '#1E293B',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 16,
  },
  distTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: '#cbd5e1',
    marginBottom: 12,
  },
  distEmpty: { fontSize: 12, color: '#64748b', fontStyle: 'italic' },
  distBars: { display: 'flex', flexDirection: 'column', gap: 8 },
  distRowItem: {
    display: 'grid',
    gridTemplateColumns: '24px 1fr 80px',
    gap: 10,
    alignItems: 'center',
  },
  distLabel: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    color: '#cbd5e1',
    textAlign: 'center',
  },
  distTrack: {
    height: 8,
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  distFill: { height: '100%', borderRadius: 4, transition: 'width 400ms ease' },
  distValue: { fontSize: 12, color: '#cbd5e1', textAlign: 'right' },
  distPct: { color: '#64748b' },

  tableWrap: {
    background: '#1E293B',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 14,
    overflow: 'hidden',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: 'rgba(20,184,166,0.04)' },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#64748b',
  },
  thCenter: {
    padding: '12px 16px',
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#64748b',
  },
  trOdd: { background: 'rgba(255,255,255,0.015)' },
  td: {
    padding: '12px 16px',
    fontSize: 13,
    color: '#e2e8f0',
    borderBottom: '1px solid rgba(255,255,255,0.03)',
  },
  tdCenter: {
    padding: '12px 16px',
    fontSize: 13,
    color: '#e2e8f0',
    textAlign: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.03)',
  },
  matchCell: { display: 'flex', flexDirection: 'column', gap: 3 },
  matchTeams: { fontWeight: 600 },
  vs: { color: '#64748b', fontWeight: 400 },
  matchDate: { fontSize: 11, color: '#64748b' },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 13,
    fontWeight: 700,
  },
  badge1: {
    background: 'rgba(20,184,166,0.15)',
    color: '#2dd4bf',
    border: '1px solid rgba(20,184,166,0.3)',
  },
  badgeX: {
    background: 'rgba(245,158,11,0.15)',
    color: '#fbbf24',
    border: '1px solid rgba(245,158,11,0.3)',
  },
  badge2: {
    background: 'rgba(59,130,246,0.15)',
    color: '#60a5fa',
    border: '1px solid rgba(59,130,246,0.3)',
  },
  badgeNeutral: {
    background: 'rgba(148,163,184,0.1)',
    color: '#64748b',
    border: '1px solid rgba(148,163,184,0.2)',
  },
  hit: { color: '#4ade80', fontWeight: 700, fontSize: 18 },
  miss: { color: '#fca5a5', fontWeight: 700, fontSize: 18 },
  muted: { color: '#475569' },
}
