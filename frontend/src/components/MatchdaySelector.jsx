import React, { useState, useEffect } from 'react'
import { apiClient } from '../api/client'

export const MatchdaySelector = ({ onSelect, onClose }) => {
  const [matchdays, setMatchdays] = useState([])
  const [selectedRound, setSelectedRound] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadMatchdays()
  }, [])

  const loadMatchdays = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.getMatchdays()

      const cleaned = (data.matchdays || [])
        .filter(m => m && m.round && m.matches && m.matches.length > 0)
        .map(m => ({
          ...m,
          matches: [...m.matches].sort((a, b) => new Date(a.date) - new Date(b.date)),
        }))
        .sort((a, b) => a.round - b.round)

      setMatchdays(cleaned)

      if (cleaned.length > 0) {
        // Por defecto: primera jornada futura (sin resultados); si no hay, la última disponible.
        const upcoming = cleaned.find(m => !m.completed)
        setSelectedRound((upcoming || cleaned[cleaned.length - 1]).round)
      } else {
        setError('No hay jornadas disponibles. Asegúrate de haber cargado datos.')
      }
    } catch (err) {
      console.error('Error loading matchdays:', err)
      setError('Error al cargar jornadas: ' + (err.message || 'Error desconocido'))
    }
    setLoading(false)
  }

  const formatRange = (matches) => {
    if (!matches || matches.length === 0) return ''
    const dates = matches
      .map(m => new Date(m.date))
      .filter(d => !isNaN(d))
      .sort((a, b) => a - b)
    if (dates.length === 0) return ''
    const first = dates[0]
    const last = dates[dates.length - 1]
    const sameDay = first.toDateString() === last.toDateString()
    const opts = { day: 'numeric', month: 'short' }
    return sameDay
      ? first.toLocaleDateString('es-ES', opts)
      : `${first.toLocaleDateString('es-ES', opts)} – ${last.toLocaleDateString('es-ES', opts)}`
  }

  const handleSelect = () => {
    if (selectedRound == null) return
    const matchday = matchdays.find(m => m.round === selectedRound)
    if (!matchday) return
    onSelect({
      round: matchday.round,
      matches: matchday.matches,
      total: matchday.matches.length,
      completed: matchday.completed,
      dateRange: formatRange(matchday.matches),
    })
  }

  const selected = matchdays.find(m => m.round === selectedRound)

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <h2 style={styles.title}>Selecciona una Jornada</h2>
        <p style={styles.subtitle}>
          Una Quiniela = una Jornada completa. Elige la jornada para generar las predicciones.
        </p>

        {loading && <p style={styles.loading}>Cargando jornadas...</p>}
        {error && <p style={styles.error}>⚠️ {error}</p>}

        {!loading && matchdays.length > 0 && (
          <>
            <div style={styles.matchdaysList}>
              {matchdays.map((md) => {
                const isSelected = selectedRound === md.round
                const hasResults = md.completed === true
                return (
                  <button
                    key={md.round}
                    onClick={() => setSelectedRound(md.round)}
                    style={{
                      ...styles.matchdayCard,
                      ...(isSelected ? styles.matchdayCardActive : {}),
                      ...(hasResults ? styles.matchdayCardPassed : {}),
                    }}
                  >
                    <div style={styles.matchdayCardHeader}>
                      <span style={styles.matchdayNumber}>Jornada {md.round}</span>
                      {hasResults && <span style={styles.badge}>✓</span>}
                    </div>
                    <div style={styles.matchdayCardDate}>{formatRange(md.matches)}</div>
                    <div style={styles.matchdayCardMatches}>{md.matches.length} partidos</div>
                  </button>
                )
              })}
            </div>

            {selected && (
              <div style={styles.matchesPreview}>
                <h3 style={styles.previewTitle}>
                  Jornada {selected.round} · {formatRange(selected.matches)} · {selected.matches.length} partidos
                </h3>
                <div style={styles.matchesList}>
                  {selected.matches.map((match, i) => {
                    const hasResult = match.home_goals !== null && match.home_goals !== undefined
                    const d = match.date ? new Date(match.date) : null
                    return (
                      <div key={i} style={{ ...styles.matchItem, ...(hasResult ? styles.matchItemWithResult : {}) }}>
                        <div style={{ ...styles.teams, minWidth: 0 }}>
                          {d && (
                            <div style={styles.matchDateSmall}>
                              {d.toLocaleDateString('es-ES', { weekday: 'short', month: 'short', day: 'numeric' })}{' '}
                              {d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          )}
                          <span style={styles.team}>{match.home_team}</span>
                          <span style={styles.vs}>vs</span>
                          <span style={styles.team}>{match.away_team}</span>
                        </div>
                        {hasResult ? (
                          <div style={styles.result}>
                            {match.home_goals} - {match.away_goals}
                          </div>
                        ) : (
                          <div style={styles.dateTime}>Pendiente</div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div style={styles.actions}>
              <button onClick={handleSelect} className="lq-btn-primary" style={styles.button}>
                Generar Predicciones
              </button>
              <button onClick={onClose} style={{ ...styles.button, ...styles.buttonSecondary }}>
                Cancelar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: '#1E293B',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 32,
    maxWidth: 720,
    width: '90%',
    maxHeight: '85vh',
    overflowY: 'auto',
    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
  },
  title: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 24,
    fontWeight: 700,
    color: '#f1f5f9',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 24,
  },
  loading: { color: '#94a3b8', textAlign: 'center' },
  error: {
    color: '#fca5a5',
    textAlign: 'center',
    background: 'rgba(239,68,68,0.1)',
    padding: '12px 16px',
    borderRadius: 8,
    marginBottom: 16,
  },
  matchdaysList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: 12,
    marginBottom: 24,
  },
  matchdayCard: {
    padding: '14px 12px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10,
    cursor: 'pointer',
    transition: 'all 200ms',
    textAlign: 'left',
    color: '#cbd5e1',
    fontSize: 13,
  },
  matchdayCardActive: {
    background: 'rgba(20,184,166,0.15)',
    border: '1px solid rgba(20,184,166,0.4)',
    color: '#2dd4bf',
  },
  matchdayCardPassed: {
    background: 'rgba(74,222,128,0.1)',
    borderColor: 'rgba(74,222,128,0.2)',
  },
  matchdayCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchdayNumber: { fontWeight: 600, color: '#f1f5f9' },
  badge: {
    fontSize: 10,
    background: 'rgba(74,222,128,0.2)',
    color: '#4ade80',
    padding: '2px 6px',
    borderRadius: 4,
  },
  matchdayCardDate: { fontSize: 11, color: '#94a3b8', marginBottom: 4 },
  matchdayCardMatches: { fontSize: 11, color: '#64748b' },
  matchesPreview: { marginBottom: 24 },
  previewTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#e2e8f0',
    marginBottom: 12,
  },
  matchesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    maxHeight: 350,
    overflowY: 'auto',
  },
  matchItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.03)',
    borderRadius: 8,
    fontSize: 13,
    color: '#cbd5e1',
  },
  matchItemWithResult: {
    background: 'rgba(74,222,128,0.08)',
    borderColor: 'rgba(74,222,128,0.15)',
  },
  dateTime: { fontSize: 12, color: '#94a3b8' },
  teams: { display: 'flex', alignItems: 'center', gap: 8, flex: 1, flexWrap: 'wrap' },
  matchDateSmall: { width: '100%', fontSize: 10, color: '#64748b', marginBottom: 4 },
  team: { color: '#f1f5f9', fontWeight: 500 },
  vs: { color: '#64748b', fontSize: 11 },
  result: { fontWeight: 600, color: '#4ade80', fontSize: 12 },
  actions: { display: 'flex', gap: 12 },
  button: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: 8,
    border: 'none',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  buttonSecondary: {
    background: 'rgba(255,255,255,0.05)',
    color: '#cbd5e1',
    border: '1px solid rgba(255,255,255,0.06)',
  },
}
