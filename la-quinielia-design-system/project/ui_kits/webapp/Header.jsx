// Header.jsx — La QuinielIA top navigation bar
'use strict';

const Header = ({ activePage, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
    { id: 'predictions', label: 'Predicciones', icon: 'target' },
    { id: 'results', label: 'Resultados', icon: 'flag' },
    { id: 'history', label: 'Historial', icon: 'history' },
    { id: 'settings', label: 'Ajustes', icon: 'settings' },
  ];

  return (
    <header style={headerStyles.root}>
      <div style={headerStyles.inner}>
        {/* Logo */}
        <div style={headerStyles.logo} onClick={() => onNavigate('dashboard')}>
          <div style={headerStyles.logoMark}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="15" fill="#0F172A"/>
              <circle cx="16" cy="16" r="13" stroke="url(#hg)" strokeWidth="1.2" fill="none"/>
              <polygon points="16,8 21,12 19.5,18 12.5,18 11,12" fill="url(#hg)" opacity="0.7"/>
              <circle cx="16" cy="4"  r="2" fill="#14B8A6"/>
              <circle cx="27" cy="11" r="2" fill="#14B8A6"/>
              <circle cx="24" cy="25" r="2" fill="#3B82F6"/>
              <circle cx="8"  cy="25" r="2" fill="#3B82F6"/>
              <circle cx="5"  cy="11" r="2" fill="#14B8A6"/>
              <line x1="16" y1="16" x2="16" y2="4"  stroke="#14B8A6" strokeWidth="0.8" opacity="0.6"/>
              <line x1="16" y1="16" x2="27" y2="11" stroke="#14B8A6" strokeWidth="0.8" opacity="0.6"/>
              <line x1="16" y1="16" x2="24" y2="25" stroke="#3B82F6" strokeWidth="0.8" opacity="0.6"/>
              <line x1="16" y1="16" x2="8"  y2="25" stroke="#3B82F6" strokeWidth="0.8" opacity="0.6"/>
              <line x1="16" y1="16" x2="5"  y2="11" stroke="#14B8A6" strokeWidth="0.8" opacity="0.6"/>
              <circle cx="16" cy="16" r="2.5" fill="url(#hg)"/>
              <defs>
                <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#14B8A6"/>
                  <stop offset="100%" stopColor="#3B82F6"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div style={headerStyles.logoText}>
            <span style={headerStyles.logoLA}>LA</span>
            <span style={headerStyles.logoQ}>QuinielIA</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={headerStyles.nav}>
          {navItems.map(item => (
            <button
              key={item.id}
              style={{
                ...headerStyles.navItem,
                ...(activePage === item.id ? headerStyles.navItemActive : {}),
              }}
              onClick={() => onNavigate(item.id)}
            >
              <i data-lucide={item.icon} width="16" height="16"></i>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div style={headerStyles.actions}>
          <button style={headerStyles.btnSecondary}>
            <i data-lucide="download-cloud" width="15" height="15"></i>
            Cargar Datos
          </button>
          <button style={headerStyles.btnPrimary}>
            <i data-lucide="sparkles" width="15" height="15"></i>
            Generar Quiniela
          </button>
        </div>
      </div>
    </header>
  );
};

const headerStyles = {
  root: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(15,23,42,0.92)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  inner: {
    maxWidth: 1280, margin: '0 auto',
    padding: '0 24px',
    height: 60,
    display: 'flex', alignItems: 'center', gap: 32,
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 10,
    cursor: 'pointer', textDecoration: 'none', flexShrink: 0,
  },
  logoMark: { display: 'flex', alignItems: 'center' },
  logoText: { display: 'flex', flexDirection: 'column', lineHeight: 1 },
  logoLA: {
    fontSize: 9, fontWeight: 700, letterSpacing: '0.14em',
    color: '#64748b', fontFamily: "'Space Grotesk', sans-serif",
    textTransform: 'uppercase',
  },
  logoQ: {
    fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em',
    background: 'linear-gradient(90deg, #14B8A6 0%, #f1f5f9 60%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    fontFamily: "'Space Grotesk', sans-serif",
  },
  nav: { display: 'flex', alignItems: 'center', gap: 2, flex: 1 },
  navItem: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '7px 14px', borderRadius: 8,
    fontSize: 13, fontWeight: 500, color: '#94a3b8',
    background: 'transparent', border: 'none', cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    transition: 'all 150ms cubic-bezier(0.16,1,0.3,1)',
  },
  navItemActive: {
    color: '#f1f5f9', background: 'rgba(255,255,255,0.07)',
  },
  actions: { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 },
  btnSecondary: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '7px 14px', borderRadius: 8,
    fontSize: 13, fontWeight: 500, color: '#cbd5e1',
    background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
    cursor: 'pointer', fontFamily: "'Inter', sans-serif",
    transition: 'all 150ms',
  },
  btnPrimary: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '7px 16px', borderRadius: 8,
    fontSize: 13, fontWeight: 600, color: '#0f172a',
    background: '#14B8A6', border: 'none',
    cursor: 'pointer', fontFamily: "'Inter', sans-serif",
    transition: 'all 150ms',
  },
};

Object.assign(window, { Header });
