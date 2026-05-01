import React from 'react'
import {
  LayoutDashboard,
  Target,
  Flag,
  History,
  Settings,
  Download,
  Sparkles,
} from 'lucide-react'

export const Header = ({ activePage, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'predictions', label: 'Predicciones', icon: Target },
    { id: 'results', label: 'Resultados', icon: Flag },
    { id: 'history', label: 'Historial', icon: History },
    { id: 'settings', label: 'Ajustes', icon: Settings },
  ]

  return (
    <header style={styles.root}>
      <div style={styles.inner}>
        {/* Logo */}
        <div style={styles.logo} onClick={() => onNavigate('dashboard')}>
          <div style={styles.logoMark}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="15" fill="#0F172A" />
              <circle
                cx="16"
                cy="16"
                r="13"
                stroke="url(#hg)"
                strokeWidth="1.2"
                fill="none"
              />
              <polygon points="16,8 21,12 19.5,18 12.5,18 11,12" fill="url(#hg)" opacity="0.7" />
              <circle cx="16" cy="4" r="2" fill="#14B8A6" />
              <circle cx="27" cy="11" r="2" fill="#14B8A6" />
              <circle cx="24" cy="25" r="2" fill="#3B82F6" />
              <circle cx="8" cy="25" r="2" fill="#3B82F6" />
              <circle cx="5" cy="11" r="2" fill="#14B8A6" />
              <line x1="16" y1="16" x2="16" y2="4" stroke="#14B8A6" strokeWidth="0.8" opacity="0.6" />
              <line x1="16" y1="16" x2="27" y2="11" stroke="#14B8A6" strokeWidth="0.8" opacity="0.6" />
              <line x1="16" y1="16" x2="24" y2="25" stroke="#3B82F6" strokeWidth="0.8" opacity="0.6" />
              <line x1="16" y1="16" x2="8" y2="25" stroke="#3B82F6" strokeWidth="0.8" opacity="0.6" />
              <line x1="16" y1="16" x2="5" y2="11" stroke="#14B8A6" strokeWidth="0.8" opacity="0.6" />
              <circle cx="16" cy="16" r="2.5" fill="url(#hg)" />
              <defs>
                <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#14B8A6" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div style={styles.logoText}>
            <span style={styles.logoLA}>LA</span>
            <span style={styles.logoQ}>QuinielIA</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                style={{
                  ...styles.navItem,
                  ...(activePage === item.id ? styles.navItemActive : {}),
                }}
                onClick={() => onNavigate(item.id)}
              >
                <Icon width="16" height="16" />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Actions */}
        <div style={styles.actions}>
          <button className="lq-btn-secondary" style={styles.btnCompact}>
            <Download width="15" height="15" />
            Cargar Datos
          </button>
          <button className="lq-btn-primary" style={styles.btnCompact}>
            <Sparkles width="15" height="15" />
            Generar Quiniela
          </button>
        </div>
      </div>
    </header>
  )
}

const styles = {
  root: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(15,23,42,0.92)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  inner: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '0 24px',
    height: 60,
    display: 'flex',
    alignItems: 'center',
    gap: 32,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer',
    textDecoration: 'none',
    flexShrink: 0,
  },
  logoMark: { display: 'flex', alignItems: 'center' },
  logoText: { display: 'flex', flexDirection: 'column', lineHeight: 1 },
  logoLA: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: '0.14em',
    color: '#64748b',
    fontFamily: "'Space Grotesk', sans-serif",
    textTransform: 'uppercase',
  },
  logoQ: {
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: '-0.01em',
    background: 'linear-gradient(90deg, #14B8A6 0%, #f1f5f9 60%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontFamily: "'Space Grotesk', sans-serif",
  },
  nav: { display: 'flex', alignItems: 'center', gap: 2, flex: 1 },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '7px 14px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    color: '#94a3b8',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    transition: 'all 150ms cubic-bezier(0.16,1,0.3,1)',
  },
  navItemActive: {
    color: '#f1f5f9',
    background: 'rgba(255,255,255,0.07)',
  },
  actions: { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 },
  btnCompact: {
    padding: '7px 14px',
    fontSize: 12,
  },
}
