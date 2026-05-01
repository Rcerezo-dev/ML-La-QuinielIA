// ModelInsights.jsx — small insight charts for home/draw/away and confidence distribution
'use strict';

const DonutChart = ({ value, total, color, label, sublabel }) => {
  const r = 32;
  const circ = 2 * Math.PI * r;
  const pct = value / total;
  const dash = pct * circ;
  const gap  = circ - dash;

  return (
    <div style={miStyles.donutWrap}>
      <svg width="84" height="84" viewBox="0 0 84 84">
        <circle cx="42" cy="42" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/>
        <circle
          cx="42" cy="42" r={r} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${gap}`}
          strokeLinecap="round"
          transform="rotate(-90 42 42)"
          style={{ transition: 'stroke-dasharray 600ms cubic-bezier(0.16,1,0.3,1)' }}
        />
        <text x="42" y="38" textAnchor="middle" fill="#f1f5f9"
          fontSize="14" fontWeight="700" fontFamily="Space Grotesk, sans-serif">
          {Math.round(pct * 100)}%
        </text>
        <text x="42" y="52" textAnchor="middle" fill="#64748b"
          fontSize="9" fontFamily="Inter, sans-serif">
          {sublabel}
        </text>
      </svg>
      <div style={miStyles.donutLabel}>{label}</div>
    </div>
  );
};

const MiniBar = ({ label, value, color }) => (
  <div style={{ marginBottom: 10 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
      <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: "'Inter',sans-serif" }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: '#f1f5f9', fontFamily: "'Space Grotesk',sans-serif" }}>{value}%</span>
    </div>
    <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 3, transition: 'width 600ms cubic-bezier(0.16,1,0.3,1)' }}></div>
    </div>
  </div>
);

const ModelInsights = () => {
  return (
    <div style={miStyles.wrap}>
      <div style={miStyles.header}>
        <div style={miStyles.title}>Análisis del Modelo</div>
        <div style={miStyles.subtitle}>Distribución histórica · Últimas 5 jornadas</div>
      </div>

      <div style={miStyles.body}>
        {/* Donuts */}
        <div style={miStyles.donuts}>
          <DonutChart value={48} total={100} color="#14B8A6" label="Victoria Local" sublabel="Local"/>
          <DonutChart value={27} total={100} color="#F59E0B" label="Empates" sublabel="Empate"/>
          <DonutChart value={25} total={100} color="#3B82F6" label="Victoria Visitante" sublabel="Visitante"/>
        </div>

        {/* Divider */}
        <div style={{ width: 1, background: 'rgba(255,255,255,0.05)', margin: '0 4px' }}></div>

        {/* Feature importance bars */}
        <div style={miStyles.bars}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', marginBottom: 12, fontFamily: "'Inter',sans-serif" }}>Top Features</div>
          <MiniBar label="Forma reciente local" value={82} color="linear-gradient(90deg,#14b8a6,#3b82f6)"/>
          <MiniBar label="Goles favor (media)" value={71} color="linear-gradient(90deg,#14b8a6,#3b82f6)"/>
          <MiniBar label="Win rate visitante" value={64} color="linear-gradient(90deg,#14b8a6,#3b82f6)"/>
          <MiniBar label="Diferencia puntos" value={58} color="linear-gradient(90deg,#14b8a6,#3b82f6)"/>
          <MiniBar label="Goles contra (media)" value={49} color="#3b82f6"/>
          <MiniBar label="Goal diff comparativa" value={41} color="#3b82f6"/>
        </div>

        {/* Confidence distribution */}
        <div style={miStyles.confDist}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', marginBottom: 12, fontFamily: "'Inter',sans-serif" }}>Distribución Confianza</div>
          {[
            { range: '60–70%', count: 3, color: '#22c55e' },
            { range: '50–60%', count: 4, color: '#14B8A6' },
            { range: '40–50%', count: 2, color: '#F59E0B' },
            { range: '<40%',   count: 1, color: '#94a3b8' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 48, fontSize: 11, color: '#64748b', fontFamily: "'Inter',sans-serif", flexShrink: 0 }}>{row.range}</div>
              <div style={{ flex: 1, height: 16, background: 'rgba(255,255,255,0.04)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${row.count * 10}%`, background: row.color, borderRadius: 4, opacity: 0.8, transition: 'width 600ms cubic-bezier(0.16,1,0.3,1)' }}></div>
              </div>
              <div style={{ width: 16, fontSize: 12, fontWeight: 600, color: '#f1f5f9', textAlign: 'right', fontFamily: "'Space Grotesk',sans-serif" }}>{row.count}</div>
            </div>
          ))}
          <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: '#64748b', fontFamily: "'Inter',sans-serif" }}>Accuracy (test)</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#14B8A6', fontFamily: "'Space Grotesk',sans-serif" }}>52%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: '#64748b', fontFamily: "'Inter',sans-serif" }}>F1 Score</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', fontFamily: "'Space Grotesk',sans-serif" }}>0.487</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const miStyles = {
  wrap: {
    background: '#1E293B', border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
  },
  header: {
    padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  title: { fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: '#f1f5f9' },
  subtitle: { fontSize: 12, color: '#64748b', marginTop: 2, fontFamily: "'Inter',sans-serif" },
  body: {
    display: 'flex', gap: 0, padding: '20px 24px', flexWrap: 'wrap', gap: 24,
  },
  donuts: { display: 'flex', gap: 16, alignItems: 'flex-start', flexShrink: 0 },
  donutWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 },
  donutLabel: { fontSize: 11, color: '#94a3b8', textAlign: 'center', fontFamily: "'Inter',sans-serif", maxWidth: 72 },
  bars: { flex: 1, minWidth: 180 },
  confDist: { flex: 1, minWidth: 180 },
};

Object.assign(window, { ModelInsights });
