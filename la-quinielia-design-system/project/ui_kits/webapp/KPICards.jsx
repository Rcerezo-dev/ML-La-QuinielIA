// KPICards.jsx — La QuinielIA KPI stat cards row
'use strict';

const KPICards = ({ stats }) => {
  const defaultStats = {
    accuracy: 52,
    accuracyDelta: '+3%',
    matches: 10,
    jornada: 28,
    confidence: 67,
    confidenceLevel: 'Alto',
    hits: 7,
    hitsTotal: 10,
  };
  const s = stats || defaultStats;

  const cards = [
    {
      label: 'Model Accuracy',
      value: `${s.accuracy}%`,
      delta: s.accuracyDelta + ' vs anterior',
      deltaPositive: true,
      accent: '#14B8A6',
      icon: 'percent',
    },
    {
      label: 'Partidos Predichos',
      value: s.matches,
      delta: `Jornada ${s.jornada}`,
      deltaPositive: null,
      accent: '#F59E0B',
      icon: 'calendar',
    },
    {
      label: 'Confianza Media',
      value: `${s.confidence}%`,
      delta: s.confidenceLevel + ' · en rango',
      deltaPositive: true,
      accent: '#22C55E',
      icon: 'shield-check',
    },
    {
      label: 'Aciertos Jornada',
      value: `${s.hits}/${s.hitsTotal}`,
      delta: 'Última jornada',
      deltaPositive: s.hits >= 6,
      accent: '#3B82F6',
      icon: 'list-checks',
    },
  ];

  return (
    <div style={kpiStyles.grid}>
      {cards.map((card, i) => (
        <KPICard key={i} {...card} />
      ))}
    </div>
  );
};

const KPICard = ({ label, value, delta, deltaPositive, accent, icon }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      style={{
        ...kpiStyles.card,
        borderTopColor: accent,
        ...(hovered ? kpiStyles.cardHover : {}),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={kpiStyles.cardTop}>
        <div style={kpiStyles.label}>{label}</div>
        <div style={{ ...kpiStyles.iconWrap, background: accent + '18', color: accent }}>
          <i data-lucide={icon} width="16" height="16"></i>
        </div>
      </div>
      <div style={kpiStyles.value}>{value}</div>
      <div style={{
        ...kpiStyles.delta,
        color: deltaPositive === true ? '#4ade80' : deltaPositive === false ? '#f87171' : '#94a3b8',
      }}>
        {deltaPositive === true && '↑ '}
        {deltaPositive === false && '↓ '}
        {delta}
      </div>
    </div>
  );
};

const kpiStyles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
  },
  card: {
    background: '#1E293B',
    border: '1px solid rgba(255,255,255,0.06)',
    borderTop: '3px solid #14B8A6',
    borderRadius: 16,
    padding: '20px 24px',
    cursor: 'default',
    transition: 'all 250ms cubic-bezier(0.16,1,0.3,1)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
  },
  cardHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(20,184,166,0.15)',
    borderColor: 'rgba(20,184,166,0.2)',
  },
  cardTop: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
    textTransform: 'uppercase', color: '#64748b',
    fontFamily: "'Inter', sans-serif",
  },
  iconWrap: {
    width: 32, height: 32, borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  value: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 34, fontWeight: 700, letterSpacing: '-0.02em',
    color: '#f1f5f9', lineHeight: 1, marginBottom: 8,
  },
  delta: {
    fontSize: 12, fontFamily: "'Inter', sans-serif",
  },
};

Object.assign(window, { KPICards, KPICard });
