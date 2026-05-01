/**
 * API Client para conectar con el backend FastAPI
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

class APIClient {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API error:', error)
      throw error
    }
  }

  // Data endpoints
  async loadData() {
    return this.request('/data/load', { method: 'POST' })
  }

  async getHistoricalMatches() {
    return this.request('/data/history')
  }

  async getNextMatchday() {
    return this.request('/data/next-matchday')
  }

  // Model endpoints
  async trainModel() {
    return this.request('/model/train', { method: 'POST' })
  }

  async getModelMetrics() {
    return this.request('/model/metrics')
  }

  async getFeatureImportance() {
    return this.request('/model/features')
  }

  // Predictions endpoints
  async generatePredictions() {
    return this.request('/predictions/generate', { method: 'POST' })
  }

  async getLatestPredictions() {
    return this.request('/predictions/latest')
  }

  // Quiniela endpoints
  async generateQuiniela(strategy = 'balanced') {
    return this.request('/quiniela/generate', {
      method: 'POST',
      body: JSON.stringify({ strategy }),
    })
  }

  // Standings
  async getStandings() {
    return this.request('/standings')
  }

  // Health check
  async health() {
    return this.request('/health')
  }
}

export const apiClient = new APIClient()
