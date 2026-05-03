import React, { useState } from 'react'

const STRATEGIES = [
  {
    id: 'conservadora',
    name: 'Conservadora 🛡️',
    description: 'Solo apuestas con confianza > 70% (seguras, pocas apuestas)',
    icon: '🛡️',
    color: '#10b981',
  },
  {
    id: 'arriesgada',
    name: 'Arriesgada ⚡',
    description: 'Apuestas con confianza > 45% (más atrevida, más apuestas)',
    icon: '⚡',
    color: '#f59e0b',
  },
  {
    id: 'alto_nivel',
    name: 'Alto Nivel 🎯',
    description: 'Solo apuestas con confianza > 75% (muy selectiva)',
    icon: '🎯',
    color: '#3b82f6',
  },
]

const MOCK_QUINIELA = '1,X,1,2,1,X,1,1,1,X'

export const QuinielaSelector = ({ onStrategyChange, quiniela, stats }) => {
  const [selectedStrategy, setSelectedStrategy] = useState('conservadora')
  const [copied, setCopied] = useState(false)

  const handleStrategyChange = (strategyId) => {
    setSelectedStrategy(strategyId)
    if (onStrategyChange) {
      onStrategyChange(strategyId)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(quiniela || MOCK_QUINIELA)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const currentQuiniela = quiniela || MOCK_QUINIELA
  const bets = currentQuiniela.split(',')

  return (
    <div style={styles.root}>
      {/* Strategy Tabs */}
      <div style={styles.tabsContainer}>
        {STRATEGIES.map((strategy) => (
          <button
            key={strategy.id}
            style={{
              ...styles.tab,
              ...(selectedStrategy === strategy.id ? styles.tabActive : {}),
            }}
            onClick={() => handleStrategyChange(strategy.id)}
          >
            <span style={styles.tabIcon}>{strategy.icon}</span>
            <div style={styles.tabContent}>
              <div style={styles.tabName}>{strategy.name}</div>
              <div style={styles.tabDesc}>{strategy.description}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Quiniela Output */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div>
            <h3 style={styles.cardTitle}>Tu Quiniela</h3>
            <div style={styles.cardSubtitle}>
              Estrategia: <strong>{STRATEGIES.find(s => s.id === selectedStrategy)?.name}</strong>
            </div>
          </div>
          <button style={styles.copyBtn} onClick={handleCopy}>
            {copied ? '✓ Copiado' : '📋 Copiar'}
          </button>
        </div>

        {stats && (
          <div style={styles.statsBox}>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Total partidos:</span>
              <span style={styles.statValue}>{stats.total_partidos}</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Apuestas realizadas:</span>
              <span style={styles.statValue}>{stats.apuestas_realizadas}</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Confianza promedio:</span>
              <span style={styles.statValue}>{stats.confidence_promedio?.toFixed(0)}%</span>
            </div>
          </div>
        )}

        {/* Quiniela Tickets */}
        <div style={styles.ticketsContainer}>
          {bets.map((bet, i) => (
            <div key={i} style={styles.ticket}>
              <div style={styles.ticketNum}>{i + 1}</div>
              <div
                style={{
                  ...styles.ticketBet,
                  ...(bet === '1'
                    ? { background: 'rgba(20,184,166,0.15)', color: '#2dd4bf' }
                    : bet === 'X'
                      ? { background: 'rgba(245,158,11,0.15)', color: '#fbbf24' }
                      : bet === '2'
                        ? { background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }
                        : { background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }),
                }}
              >
                {bet || '-'}
              </div>
            </div>
          ))}
        </div>

        {/* Quiniela Code */}
        <div style={styles.codeContainer}>
          <code style={styles.code}>{currentQuiniela}</code>
        </div>

        {/* Legend */}
        <div style={styles.legend}>
          <div style={styles.legendItem}>
            <span style={{ ...styles.legendDot, background: '#2dd4bf' }} /> = Local Gana (1)
          </div>
          <div style={styles.legendItem}>
            <span style={{ ...styles.legendDot, background: '#fbbf24' }} /> = Empate (X)
          </div>
          <div style={styles.legendItem}>
            <span style={{ ...styles.legendDot, background: '#60a5fa' }} /> = Visitante Gana (2)
          </div>
        </div>

        {/* Disclaimer */}
        <div style={styles.disclaimer}>
          <div style={{ marginBottom: 8 }}>
            ℹ️ <strong>Estrategias explicadas:</strong>
          </div>
          <div style={{ fontSize: 11, lineHeight: 1.6, color: '#bfdbfe' }}>
            • <strong>Conservadora:</strong> Apuesta solo en partidos muy seguros (confianza &gt; 70%). Menos apuestas, mayor seguridad.<br/>
            • <strong>Arriesgada:</strong> Apuesta en más partidos (confianza &gt; 45%). Mayor riesgo, más variedad.<br/>
            • <strong>Alto Nivel:</strong> Las predicciones más seguras (confianza &gt; 75%). Muy selectiva.
          </div>
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(93,164,255,0.2)', fontSize: 11 }}>
            Las predicciones son probabilísticas. No garantizan resultados reales.
          </div>
        </div>
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
  tabsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 12,
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    background: '#1E293B',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 12,
    cursor: 'pointer',
    transition: 'all 200ms cubic-bezier(0.16,1,0.3,1)',
    fontFamily: "'Inter', sans-serif",
  },
  tabActive: {
    background: 'rgba(20,184,166,0.1)',
    borderColor: 'rgba(20,184,166,0.4)',
    transform: 'translateY(-2px)',
  },
  tabIcon: {
    fontSize: 24,
  },
  tabContent: {
    flex: 1,
    textAlign: 'left',
  },
  tabName: {
    fontWeight: 600,
    color: '#f1f5f9',
    fontSize: 13,
  },
  tabDesc: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  card: {
    background: '#1E293B',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 18,
    fontWeight: 700,
    color: '#f1f5f9',
    margin: 0,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  statsBox: {
    display: 'flex',
    gap: 16,
    padding: 12,
    background: 'rgba(20,184,166,0.05)',
    border: '1px solid rgba(20,184,166,0.1)',
    borderRadius: 8,
    marginBottom: 16,
  },
  statItem: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statValue: {
    fontSize: 13,
    fontWeight: 700,
    color: '#2dd4bf',
  },
  copyBtn: {
    padding: '8px 16px',
    background: 'rgba(20,184,166,0.1)',
    border: '1px solid rgba(20,184,166,0.3)',
    borderRadius: 8,
    color: '#14B8A6',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    transition: 'all 150ms',
  },
  ticketsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(50px, 1fr))',
    gap: 8,
    marginBottom: 20,
  },
  ticket: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  ticketNum: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: 600,
  },
  ticketBet: {
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: 14,
    border: '1px solid rgba(255,255,255,0.1)',
  },
  codeContainer: {
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    overflowX: 'auto',
  },
  code: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    color: '#2dd4bf',
    fontWeight: 500,
    letterSpacing: '0.05em',
  },
  legend: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
    padding: 12,
    background: 'rgba(255,255,255,0.02)',
    borderRadius: 8,
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 12,
    color: '#94a3b8',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
  },
  disclaimer: {
    background: 'rgba(59,130,246,0.1)',
    border: '1px solid rgba(59,130,246,0.3)',
    borderRadius: 8,
    padding: 12,
    fontSize: 12,
    color: '#93c5fd',
    lineHeight: 1.5,
  },
}
