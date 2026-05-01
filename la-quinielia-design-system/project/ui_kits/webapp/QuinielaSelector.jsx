// QuinielaSelector.jsx — Strategy tabs + quiniela output
'use strict';

const STRATEGY_DATA = {
  conservative: {
    label: 'Conservadora',
    desc: 'Apuesta si confianza > 40%',
    threshold: 40,
    color: '#14B8A6',
    picks: ['1','X','2','1','1','X','1','1','1','X'],
  },
  balanced: {
    label: 'Equilibrada',
    desc: 'Apuesta si confianza > 50%',
    threshold: 50,
    color: '#3B82F6',
    picks: ['1','1','2','1','1','1','1','1','1','1'],
  },
  risky: {
    label: 'Arriesgada',
    desc: 'Apuesta si confianza > 60%',
    threshold: 60,
    color: '#F59E0B',
    picks: ['1','1','2','1','1','1','1','1','1','X'],
  },
};

const MATCHES = [
  'R.Madrid–Barça','Atleti–Sevilla','Valencia–Betis','Athletic–Villarreal',
  'R.Sociedad–Osasuna','Celta–Rayo','Girona–Getafe','Las Palmas–Alavés','Mallorca–Espanyol','Cádiz–Granada'
];

const PickChip = ({ pick, index }) => {
  const colors = {
    '1': { bg: 'rgba(20,184,166,0.15)', color: '#2dd4bf', border: 'rgba(20,184,166,0.3)' },
    'X': { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
    '2': { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: 'rgba(59,130,246,0.3)' },
  };
  const c = colors[pick];
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 10, color: '#475569', marginBottom: 3, fontFamily: "'Inter',sans-serif" }}>{index+1}</div>
      <div style={{
        width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: c.bg, color: c.color, border: `1px solid ${c.border}`,
        fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 700,
      }}>{pick}</div>
    </div>
  );
};

const QuinielaSelector = () => {
  const [active, setActive] = React.useState('conservative');
  const [copied, setCopied] = React.useState(false);
  const [exported, setExported] = React.useState(false);
  const strategy = STRATEGY_DATA[active];

  const quinielaCode = strategy.picks.join(' · ');
  const quinielaSimple = strategy.picks.join('');

  const handleCopy = () => {
    const text = `LA QUINIELIA — Jornada 28\nEstrategia: ${strategy.label}\n\n${MATCHES.map((m,i) => `${i+1}. ${m}: ${strategy.picks[i]}`).join('\n')}\n\nCódigo: ${quinielaSimple}`;
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const lines = [
      '╔══════════════════════════════════════╗',
      '║       LA QUINIELIA — Jornada 28      ║',
      `║  Estrategia: ${strategy.label.padEnd(24)}║`,
      '╠══════════════════════════════════════╣',
      ...MATCHES.map((m, i) => {
        const line = `${String(i+1).padStart(2)}. ${m}`;
        return `║  ${line.padEnd(32)}${strategy.picks[i]}  ║`;
      }),
      '╠══════════════════════════════════════╣',
      `║  Código: ${quinielaSimple.padEnd(29)}║`,
      `║  1s:${strategy.picks.filter(p=>p==='1').length}  Xs:${strategy.picks.filter(p=>p==='X').length}  2s:${strategy.picks.filter(p=>p==='2').length}                          ║`,
      '╠══════════════════════════════════════╣',
      '║  Generado por La QuinielIA · AI      ║',
      '║  Las predicciones son probabilísticas║',
      '╚══════════════════════════════════════╝',
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `quiniela-j28-${active}.txt`; a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  return (
    <div style={qsStyles.wrap}>
      {/* Header */}
      <div style={qsStyles.header}>
        <div>
          <div style={qsStyles.title}>Modo Quiniela</div>
          <div style={qsStyles.subtitle}>Selecciona tu estrategia de predicción</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px', background: 'rgba(255,255,255,0.04)', borderRadius: 10 }}>
          {Object.entries(STRATEGY_DATA).map(([key, s]) => (
            <button key={key} onClick={() => setActive(key)} style={{
              ...qsStyles.tab,
              ...(active === key ? { ...qsStyles.tabActive, color: s.color, borderColor: s.color + '40' } : {}),
            }}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Strategy info */}
      <div style={qsStyles.infoBar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: strategy.color }}></div>
          <span style={{ fontSize: 13, color: '#94a3b8', fontFamily: "'Inter',sans-serif" }}>{strategy.desc}</span>
        </div>
        <span style={{ fontSize: 12, color: '#64748b', fontFamily: "'Inter',sans-serif" }}>
          Jornada 28 · {strategy.picks.length} partidos
        </span>
      </div>

      {/* Picks row */}
      <div style={qsStyles.picksRow}>
        {strategy.picks.map((pick, i) => (
          <PickChip key={`${active}-${i}`} pick={pick} index={i} />
        ))}
      </div>

      {/* Match labels */}
      <div style={qsStyles.matchLabels}>
        {MATCHES.map((m, i) => (
          <div key={i} style={{ width: 36, fontSize: 9, color: '#475569', textAlign: 'center', lineHeight: 1.2, fontFamily: "'Inter',sans-serif" }}>
            {m.split('–')[0]}
          </div>
        ))}
      </div>

      {/* String output + actions */}
      <div style={qsStyles.stringWrap}>
        <span style={qsStyles.stringLabel}>Código:</span>
        <code style={qsStyles.string}>{quinielaCode}</code>
        <button onClick={handleCopy} style={{
          ...qsStyles.actionBtn,
          ...(copied ? { color: '#4ade80', borderColor: 'rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.08)' } : {}),
        }}>
          <i data-lucide={copied ? 'check' : 'copy'} width="13" height="13"></i>
          {copied ? '¡Copiado!' : 'Copiar'}
        </button>
        <button onClick={handleExport} style={{
          ...qsStyles.actionBtn,
          ...(exported ? { color: '#4ade80', borderColor: 'rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.08)' } : { color: '#14B8A6', borderColor: 'rgba(20,184,166,0.3)', background: 'rgba(20,184,166,0.08)' }),
        }}>
          <i data-lucide={exported ? 'check' : 'download'} width="13" height="13"></i>
          {exported ? '¡Descargado!' : 'Exportar .txt'}
        </button>
      </div>

      {/* Stats */}
      <div style={qsStyles.stats}>
        {[
          { label: 'Victorias locales', value: strategy.picks.filter(p=>p==='1').length, color: '#14B8A6' },
          { label: 'Empates', value: strategy.picks.filter(p=>p==='X').length, color: '#F59E0B' },
          { label: 'Victorias visitante', value: strategy.picks.filter(p=>p==='2').length, color: '#3B82F6' },
        ].map((stat, i) => (
          <div key={i} style={qsStyles.statItem}>
            <div style={{ fontSize: 22, fontWeight: 700, color: stat.color, fontFamily: "'Space Grotesk',sans-serif" }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: '#64748b', fontFamily: "'Inter',sans-serif" }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const qsStyles = {
  wrap: {
    background: '#1E293B', border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)',
    flexWrap: 'wrap', gap: 12,
  },
  title: { fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: '#f1f5f9' },
  subtitle: { fontSize: 12, color: '#64748b', marginTop: 2, fontFamily: "'Inter',sans-serif" },
  tab: {
    padding: '7px 14px', borderRadius: 7, fontSize: 13, fontWeight: 500,
    color: '#64748b', background: 'transparent', border: '1px solid transparent',
    cursor: 'pointer', fontFamily: "'Inter',sans-serif", transition: 'all 150ms',
  },
  tabActive: {
    background: 'rgba(255,255,255,0.06)', fontWeight: 600,
  },
  infoBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 24px', background: 'rgba(255,255,255,0.02)',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  picksRow: {
    display: 'flex', gap: 8, padding: '20px 24px 8px', flexWrap: 'wrap',
  },
  matchLabels: {
    display: 'flex', gap: 8, padding: '0 24px 16px', flexWrap: 'wrap',
  },
  stringWrap: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '14px 24px', background: 'rgba(0,0,0,0.2)',
    borderTop: '1px solid rgba(255,255,255,0.04)',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    flexWrap: 'wrap',
  },
  stringLabel: { fontSize: 11, color: '#64748b', fontFamily: "'Inter',sans-serif", flexShrink: 0 },
  string: {
    flex: 1, fontFamily: "'JetBrains Mono',monospace", fontSize: 13,
    color: '#14B8A6', letterSpacing: '0.04em', minWidth: 0,
  },
  actionBtn: {
    display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
    padding: '6px 12px', borderRadius: 7, fontSize: 12, fontWeight: 600,
    color: '#94a3b8', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer',
    fontFamily: "'Inter',sans-serif", transition: 'all 150ms',
  },
  stats: {
    display: 'flex', gap: 0, padding: '16px 24px',
  },
  statItem: {
    flex: 1, textAlign: 'center',
    borderRight: '1px solid rgba(255,255,255,0.04)',
    paddingRight: 16, marginRight: 16,
  },
};

Object.assign(window, { QuinielaSelector });
