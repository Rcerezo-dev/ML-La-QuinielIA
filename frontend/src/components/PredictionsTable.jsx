import React, { useState } from 'react'

const PickBadge = ({ pick }) => {
  const styles = {
    '1': { bg: 'rgba(20,184,166,0.15)', color: '#2dd4bf', border: 'rgba(20,184,166,0.3)' },
    'X': { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
    '2': { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: 'rgba(59,130,246,0.3)' },
  }
  const s = styles[pick] || styles['X']
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        borderRadius: 7,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 14,
        fontWeight: 700,
      }}
    >
      {pick}
    </span>
  )
}

const ProbBar = ({ value, color }) => (
  <div style={{ minWidth: 60 }}>
    <div style={{ fontSize: 13, fontWeight: 500, color: '#f1f5f9', marginBottom: 3 }}>
      {value}%
    </div>
    <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
      <div
        style={{
          height: '100%',
          width: `${value}%`,
          background: color,
          borderRadius: 2,
          transition: 'width 600ms cubic-bezier(0.16,1,0.3,1)',
        }}
      />
    </div>
  </div>
)

const ConfidenceDot = ({ value }) => {
  const color = value >= 60 ? '#4ade80' : value >= 45 ? '#fbbf24' : '#94a3b8'
  return (
    <span style={{ color, fontWeight: 600, fontSize: 13 }}>
      {value}%
    </span>
  )
}

const MOCK_PREDICTIONS = [
  { home: 'Real Madrid', away: 'FC Barcelona', p1: 65, px: 20, p2: 15, pick: '1', conf: 65 },
  { home: 'Atlético Madrid', away: 'Sevilla FC', p1: 42, px: 35, p2: 23, pick: 'X', conf: 42 },
  { home: 'Valencia CF', away: 'Real Betis', p1: 28, px: 30, p2: 42, pick: '2', conf: 42 },
  { home: 'Athletic Club', away: 'Villarreal CF', p1: 55, px: 25, p2: 20, pick: '1', conf: 55 },
  { home: 'Real Sociedad', away: 'Osasuna', p1: 60, px: 22, p2: 18, pick: '1', conf: 60 },
  { home: 'Celta Vigo', away: 'Rayo Vallecano', p1: 38, px: 34, p2: 28, pick: 'X', conf: 38 },
  { home: 'Girona FC', away: 'Getafe CF', p1: 48, px: 28, p2: 24, pick: '1', conf: 48 },
  { home: 'Las Palmas', away: 'Alavés', p1: 44, px: 31, p2: 25, pick: '1', conf: 44 },
  { home: 'Mallorca', away: 'Espanyol', p1: 46, px: 29, p2: 25, pick: '1', conf: 46 },
  { home: 'Cádiz CF', away: 'Granada CF', p1: 35, px: 32, p2: 33, pick: 'X', conf: 35 },
]

export const PredictionsTable = ({ predictions, jornada, dateRange }) => {
  const [hoveredRow, setHoveredRow] = useState(null)
  const [hoveredHeader, setHoveredHeader] = useState(null)
  const data = predictions || MOCK_PREDICTIONS

  const columnHelp = {
    partido: 'Equipos enfrentados',
    p1: 'Probabilidad de victoria local',
    px: 'Probabilidad de empate',
    p2: 'Probabilidad de victoria visitante',
    pick: 'Predicción del modelo (resultado más probable)',
    conf: 'Confianza en la predicción (0-100%)',
  }

  const getSubtitle = () => {
    const parts = [`Jornada ${jornada || 28}`]
    if (dateRange) parts.push(dateRange)
    parts.push('LaLiga')
    parts.push(`${data.length} partidos`)
    return parts.join(' · ')
  }

  return (
    <div style={tableStyles.wrap}>
      <div style={tableStyles.header}>
        <div>
          <div style={tableStyles.title}>Predicciones</div>
          <div style={tableStyles.subtitle}>
            {getSubtitle()}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={tableStyles.tag}>Random Forest</span>
          <span style={tableStyles.tag}>80/20 split</span>
        </div>
      </div>

      <div style={tableStyles.legend}>
        <div style={tableStyles.legendTitle}>📊 Leyenda:</div>
        <div style={tableStyles.legendItems}>
          <span style={tableStyles.legendItem}><strong>P(1)</strong> = Victoria Local</span>
          <span style={tableStyles.legendItem}><strong>P(X)</strong> = Empate</span>
          <span style={tableStyles.legendItem}><strong>P(2)</strong> = Victoria Visitante</span>
          <span style={tableStyles.legendItem}><strong>Pick</strong> = Predicción más probable</span>
          <span style={tableStyles.legendItem}><strong>Conf.</strong> = Confianza (mayor % = más seguro)</span>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyles.table}>
          <thead>
            <tr style={tableStyles.thead}>
              <th style={{ ...tableStyles.th, width: 220 }}>Partido</th>
              <th
                style={tableStyles.th}
                onMouseEnter={() => setHoveredHeader('p1')}
                onMouseLeave={() => setHoveredHeader(null)}
                title={columnHelp.p1}
              >
                P(1) ℹ️
              </th>
              <th
                style={tableStyles.th}
                onMouseEnter={() => setHoveredHeader('px')}
                onMouseLeave={() => setHoveredHeader(null)}
                title={columnHelp.px}
              >
                P(X) ℹ️
              </th>
              <th
                style={tableStyles.th}
                onMouseEnter={() => setHoveredHeader('p2')}
                onMouseLeave={() => setHoveredHeader(null)}
                title={columnHelp.p2}
              >
                P(2) ℹ️
              </th>
              <th
                style={tableStyles.th}
                onMouseEnter={() => setHoveredHeader('pick')}
                onMouseLeave={() => setHoveredHeader(null)}
                title={columnHelp.pick}
              >
                Pick ℹ️
              </th>
              <th
                style={tableStyles.th}
                onMouseEnter={() => setHoveredHeader('conf')}
                onMouseLeave={() => setHoveredHeader(null)}
                title={columnHelp.conf}
              >
                Conf. ℹ️
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={i}
                style={{
                  ...tableStyles.tr,
                  ...(i % 2 === 1 ? tableStyles.trOdd : {}),
                  ...(hoveredRow === i ? tableStyles.trHover : {}),
                }}
                onMouseEnter={() => setHoveredRow(i)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td style={tableStyles.td}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#f1f5f9' }}>
                    {row.home} <span style={{ color: '#64748b', fontWeight: 400 }}>vs</span> {row.away}
                  </div>
                </td>
                <td style={tableStyles.td}>
                  <ProbBar value={row.p1} color="linear-gradient(90deg,#14b8a6,#3b82f6)" />
                </td>
                <td style={tableStyles.td}>
                  <ProbBar value={row.px} color="#94a3b8" />
                </td>
                <td style={tableStyles.td}>
                  <ProbBar value={row.p2} color="#60a5fa" />
                </td>
                <td style={tableStyles.td}>
                  <PickBadge pick={row.pick} />
                </td>
                <td style={tableStyles.td}>
                  <ConfidenceDot value={row.conf} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const tableStyles = {
  wrap: {
    background: '#1E293B',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  legend: {
    padding: '12px 24px',
    background: 'rgba(20,184,166,0.05)',
    borderBottom: '1px solid rgba(20,184,166,0.1)',
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: '#2dd4bf',
    marginBottom: 8,
  },
  legendItems: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 16,
    fontSize: 12,
    color: '#94a3b8',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 18,
    fontWeight: 700,
    color: '#f1f5f9',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    fontFamily: "'Inter', sans-serif",
  },
  tag: {
    padding: '3px 10px',
    borderRadius: 9999,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.06)',
    fontSize: 11,
    color: '#64748b',
    fontFamily: "'Inter', sans-serif",
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: 'rgba(20,184,166,0.05)' },
  th: {
    padding: '10px 16px',
    textAlign: 'left',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#64748b',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    fontFamily: "'Inter', sans-serif",
  },
  tr: { transition: 'background 100ms' },
  trOdd: { background: 'rgba(255,255,255,0.015)' },
  trHover: { background: 'rgba(20,184,166,0.05)' },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.03)',
    fontFamily: "'Inter', sans-serif",
    verticalAlign: 'middle',
  },
}
