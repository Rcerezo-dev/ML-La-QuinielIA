import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Header } from './components/Header'
import { KPICards } from './components/KPICards'
import { apiClient } from './api/client'
import './styles/tokens.css'

const Dashboard = () => {
  const [activePage, setActivePage] = useState('dashboard')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      // Check API health
      await apiClient.health()
      console.log('✅ API conectada correctamente')
    } catch (err) {
      setError('No se puede conectar al backend. Asegúrate de que está ejecutándose en http://localhost:8000')
      console.error(err)
    }
    setLoading(false)
  }

  return (
    <div>
      <Header activePage={activePage} onNavigate={setActivePage} />

      <main style={styles.main}>
        <div style={styles.container}>
          {error && (
            <div style={styles.errorBanner}>
              <strong>⚠️ Error:</strong> {error}
            </div>
          )}

          {activePage === 'dashboard' && (
            <DashboardPage loading={loading} />
          )}

          {activePage === 'predictions' && (
            <PredictionsPage />
          )}

          {activePage === 'results' && (
            <ResultsPage />
          )}

          {activePage === 'history' && (
            <HistoryPage />
          )}

          {activePage === 'settings' && (
            <SettingsPage />
          )}
        </div>
      </main>
    </div>
  )
}

const DashboardPage = ({ loading }) => {
  return (
    <div>
      <h1 style={styles.pageTitle}>Dashboard</h1>
      <p style={styles.pageSubtitle}>
        Visualización general del modelo ML y próximas predicciones
      </p>

      <div style={styles.section}>
        <KPICards
          stats={{
            accuracy: 58,
            accuracyDelta: '+5%',
            matches: 20,
            jornada: 28,
            confidence: 72,
            confidenceLevel: 'Alto',
            hits: 11,
            hitsTotal: 20,
          }}
        />
      </div>

      <div style={styles.section}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Próximas Predicciones</h2>
          <p style={styles.cardText}>
            Carga datos y entrena el modelo para ver las predicciones de la próxima jornada
          </p>
          <button className="lq-btn-primary" style={{ marginTop: 16 }}>
            Generar Predicciones
          </button>
        </div>
      </div>
    </div>
  )
}

const PredictionsPage = () => {
  return (
    <div>
      <h1 style={styles.pageTitle}>Predicciones</h1>
      <div style={styles.section}>
        <div style={styles.card}>
          <p style={styles.cardText}>
            Predicciones detalladas para la próxima jornada con probabilidades y confianza
          </p>
        </div>
      </div>
    </div>
  )
}

const ResultsPage = () => {
  return (
    <div>
      <h1 style={styles.pageTitle}>Resultados</h1>
      <div style={styles.section}>
        <div style={styles.card}>
          <p style={styles.cardText}>Historial de resultados y aciertos del modelo</p>
        </div>
      </div>
    </div>
  )
}

const HistoryPage = () => {
  return (
    <div>
      <h1 style={styles.pageTitle}>Historial</h1>
      <div style={styles.section}>
        <div style={styles.card}>
          <p style={styles.cardText}>Historial completo de jornadas predichas</p>
        </div>
      </div>
    </div>
  )
}

const SettingsPage = () => {
  return (
    <div>
      <h1 style={styles.pageTitle}>Ajustes</h1>
      <div style={styles.section}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Configuración del Modelo</h2>
          <div style={styles.settingsForm}>
            <div style={styles.formGroup}>
              <label style={styles.label}>API Key</label>
              <input
                type="password"
                placeholder="Tu API key de football-data.org"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Liga</label>
              <select style={styles.input} defaultValue="PD">
                <option value="PD">La Liga (España)</option>
                <option value="PL">Premier League (Inglaterra)</option>
                <option value="SA">Serie A (Italia)</option>
                <option value="BL1">Bundesliga (Alemania)</option>
              </select>
            </div>
            <button className="lq-btn-primary" style={{ marginTop: 16 }}>
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  main: {
    minHeight: 'calc(100vh - 60px)',
    background: 'linear-gradient(180deg, #0f172a 0%, #1a1f3a 100%)',
    padding: '40px 24px',
  },
  container: {
    maxWidth: 1280,
    margin: '0 auto',
  },
  errorBanner: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.4)',
    borderRadius: 12,
    padding: '16px 20px',
    marginBottom: 24,
    color: '#fca5a5',
    fontSize: 14,
  },
  pageTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 36,
    fontWeight: 700,
    color: '#f1f5f9',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 15,
    color: '#94a3b8',
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  card: {
    background: '#1E293B',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
  },
  cardTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 18,
    fontWeight: 700,
    color: '#f1f5f9',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 1.6,
  },
  settingsForm: {
    marginTop: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#64748b',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 8,
    color: '#f1f5f9',
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    transition: 'all 150ms',
  },
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
)
