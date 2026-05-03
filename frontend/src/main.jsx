import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Header } from './components/Header'
import { KPICards } from './components/KPICards'
import { PredictionsTable } from './components/PredictionsTable'
import { QuinielaSelector } from './components/QuinielaSelector'
import { ModelInsights } from './components/ModelInsights'
import { MatchdaySelector } from './components/MatchdaySelector'
import { HistoryView } from './components/HistoryView'
import { apiClient } from './api/client'
import './styles/tokens.css'

const Dashboard = () => {
  const [activePage, setActivePage] = useState('dashboard')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [predictions, setPredictions] = useState(null)
  const [selectedMatchday, setSelectedMatchday] = useState(null)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [modelTrained, setModelTrained] = useState(false)

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
            <DashboardPage
              loading={loading}
              predictions={predictions}
              setPredictions={setPredictions}
              selectedMatchday={selectedMatchday}
              setSelectedMatchday={setSelectedMatchday}
              dataLoaded={dataLoaded}
              setDataLoaded={setDataLoaded}
              modelTrained={modelTrained}
              setModelTrained={setModelTrained}
            />
          )}

          {activePage === 'predictions' && (
            <PredictionsPage predictions={predictions} selectedMatchday={selectedMatchday} />
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

const DashboardPage = ({
  loading,
  predictions,
  setPredictions,
  selectedMatchday,
  setSelectedMatchday,
  dataLoaded,
  setDataLoaded,
  modelTrained,
  setModelTrained,
}) => {
  const [generatingPredictions, setGeneratingPredictions] = useState(false)
  const [showSelector, setShowSelector] = useState(false)

  const handleGeneratePredictions = async () => {
    setGeneratingPredictions(true)
    try {
      // 1. Load data first
      if (!dataLoaded) {
        console.log('Cargando datos...')
        await apiClient.loadData()
        setDataLoaded(true)
      }
      setShowSelector(true)
    } catch (err) {
      console.error('❌ Error cargando datos:', err)
      alert('Error al cargar datos: ' + err.message)
    }
    setGeneratingPredictions(false)
  }

  const handleSelectMatchday = async (matchday) => {
    setGeneratingPredictions(true)
    setShowSelector(false)
    try {
      // 1. Load data
      if (!dataLoaded) {
        console.log('Cargando datos...')
        await apiClient.loadData()
        setDataLoaded(true)
      }

      // 2. Train model
      if (!modelTrained) {
        console.log('Entrenando modelo...')
        await apiClient.trainModel()
        setModelTrained(true)
      }

      // 3. Generate predictions for the selected round
      console.log(`Generando predicciones para jornada ${matchday.round}...`)
      const result = await apiClient.generatePredictions(matchday.round)

      // Transform API response to component format
      const transformedPredictions = result.predictions.map(pred => ({
        home: pred.home_team,
        away: pred.away_team,
        p1: Math.round(pred.prob_local * 100),
        px: Math.round(pred.prob_draw * 100),
        p2: Math.round(pred.prob_away * 100),
        pick: pred.prediction,
        conf: Math.round(pred.confidence * 100),
      }))

      setPredictions(transformedPredictions)
      setSelectedMatchday(matchday)
      console.log('✅ Predicciones generadas', transformedPredictions)
    } catch (err) {
      console.error('❌ Error generando predicciones:', err)
      alert('Error: ' + err.message)
    }
    setGeneratingPredictions(false)
  }

  return (
    <div>
      {showSelector && (
        <MatchdaySelector
          onSelect={handleSelectMatchday}
          onClose={() => setShowSelector(false)}
        />
      )}

      <h1 style={styles.pageTitle}>Dashboard</h1>
      <p style={styles.pageSubtitle}>
        Visualización general del modelo ML y próximas predicciones
      </p>

      {selectedMatchday && (
        <div style={styles.section}>
          <KPICards
            stats={{
              accuracy: 58,
              accuracyDelta: '+5%',
              matches: selectedMatchday.total || 0,
              jornada: `Jornada ${selectedMatchday.round}${selectedMatchday.dateRange ? ` · ${selectedMatchday.dateRange}` : ''}`,
              confidence: 72,
              confidenceLevel: 'Alto',
              hits: 11,
              hitsTotal: 20,
            }}
          />
        </div>
      )}

      <div style={styles.section}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Predicciones</h2>
          <p style={styles.cardText}>
            {generatingPredictions
              ? '⏳ Cargando datos, entrenando modelo y generando predicciones...'
              : predictions && selectedMatchday
              ? `✅ Predicciones generadas para Jornada ${selectedMatchday.round}`
              : 'Selecciona una jornada y genera predicciones'}
          </p>
          <button
            className="lq-btn-primary"
            style={{ marginTop: 16 }}
            onClick={handleGeneratePredictions}
            disabled={generatingPredictions}
          >
            {generatingPredictions ? 'Generando...' : 'Generar Predicciones'}
          </button>
        </div>
      </div>

      {predictions && selectedMatchday && (
        <div style={styles.section}>
          <PredictionsTable
            predictions={predictions}
            jornada={selectedMatchday.round}
            dateRange={selectedMatchday.dateRange}
          />
        </div>
      )}
    </div>
  )
}

const PredictionsPage = ({ predictions, selectedMatchday }) => {
  if (!predictions || !selectedMatchday) {
    return (
      <div>
        <h1 style={styles.pageTitle}>Predicciones</h1>
        <p style={styles.pageSubtitle}>
          Análisis detallado de predicciones con probabilidades y confianza
        </p>
        <div style={styles.section}>
          <div style={styles.card}>
            <p style={styles.cardText}>
              Primero genera predicciones en el Dashboard seleccionando una jornada
            </p>
          </div>
        </div>
      </div>
    )
  }

  const title = `Jornada ${selectedMatchday.round}${selectedMatchday.dateRange ? ` · ${selectedMatchday.dateRange}` : ''}`

  return (
    <div>
      <h1 style={styles.pageTitle}>Predicciones - {title}</h1>
      <p style={styles.pageSubtitle}>
        Análisis detallado de predicciones con probabilidades y confianza
      </p>

      <div style={styles.section}>
        <PredictionsTable predictions={predictions} jornada={selectedMatchday.round} dateRange={selectedMatchday.dateRange} />
      </div>

      <div style={styles.section}>
        <QuinielaSelector />
      </div>
    </div>
  )
}

const ResultsPage = () => {
  return (
    <div>
      <h1 style={styles.pageTitle}>Resultados & Análisis</h1>
      <p style={styles.pageSubtitle}>
        Rendimiento del modelo con métricas detalladas
      </p>

      <div style={styles.section}>
        <ModelInsights />
      </div>
    </div>
  )
}

const HistoryPage = () => {
  return (
    <div>
      <h1 style={styles.pageTitle}>Historial</h1>
      <p style={styles.pageSubtitle}>
        Quinielas guardadas con sus predicciones y aciertos según los resultados reales
      </p>
      <div style={styles.section}>
        <HistoryView />
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
