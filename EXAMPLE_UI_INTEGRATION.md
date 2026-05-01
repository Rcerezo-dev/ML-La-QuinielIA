# 🎨 Ejemplos de Integración UI

**Cómo conectar tu interfaz con el backend**

---

## 🚀 Vanilla JavaScript

### HTML + JS Mínimo

```html
<!DOCTYPE html>
<html>
<head>
    <title>LaLiga Predictor</title>
    <style>
        body { font-family: Arial; margin: 20px; }
        button { padding: 10px 20px; margin: 5px; cursor: pointer; }
        .result { margin-top: 20px; white-space: pre-wrap; }
    </style>
</head>
<body>
    <h1>⚽ LaLiga Predictor</h1>
    
    <div>
        <button onclick="loadData()">📥 Cargar Datos</button>
        <button onclick="trainModel()">🧠 Entrenar Modelo</button>
        <button onclick="predict()">🔮 Generar Predicciones</button>
        <button onclick="quiniela('balanced')">📊 Quiniela Conservadora</button>
        <button onclick="quiniela('aggressive')">⚡ Quiniela Arriesgada</button>
        <button onclick="quiniela('high_confidence')">🏆 Quiniela Segura</button>
    </div>
    
    <div id="status"></div>
    <div id="result" class="result"></div>
    
    <script>
        const API = 'http://localhost:8000';
        
        const updateStatus = (msg) => {
            document.getElementById('status').innerHTML = `<p><strong>${msg}</strong></p>`;
        };
        
        const displayResult = (title, data) => {
            const result = document.getElementById('result');
            result.innerHTML = `<h3>${title}</h3><code>${JSON.stringify(data, null, 2)}</code>`;
        };
        
        const loadData = async () => {
            updateStatus('⏳ Cargando datos...');
            try {
                const res = await fetch(`${API}/data/load`, { method: 'POST' });
                const data = await res.json();
                displayResult('✅ Datos Cargados', data);
                updateStatus('✓ Datos listos');
            } catch (e) {
                displayResult('❌ Error', e.message);
            }
        };
        
        const trainModel = async () => {
            updateStatus('⏳ Entrenando modelo...');
            try {
                const res = await fetch(`${API}/model/train`, { method: 'POST' });
                const data = await res.json();
                displayResult('✅ Modelo Entrenado', {
                    accuracy: `${(data.accuracy * 100).toFixed(1)}%`,
                    f1_score: data.f1_score.toFixed(4),
                    matches: data.total_matches
                });
                updateStatus(`✓ Modelo: ${(data.accuracy * 100).toFixed(1)}% accuracy`);
            } catch (e) {
                displayResult('❌ Error', e.message);
            }
        };
        
        const predict = async () => {
            updateStatus('⏳ Generando predicciones...');
            try {
                const res = await fetch(`${API}/predictions/generate`, { method: 'POST' });
                const data = await res.json();
                
                const predictions = data.predictions.map(p => ({
                    partido: `${p.home_team} vs ${p.away_team}`,
                    prediccion: p.prediction,
                    prob_1: `${(p.prob_local * 100).toFixed(1)}%`,
                    prob_x: `${(p.prob_draw * 100).toFixed(1)}%`,
                    prob_2: `${(p.prob_away * 100).toFixed(1)}%`,
                    confianza: `${(p.confidence * 100).toFixed(1)}%`
                }));
                
                displayResult('🔮 Predicciones', predictions);
                updateStatus('✓ Predicciones generadas');
            } catch (e) {
                displayResult('❌ Error', e.message);
            }
        };
        
        const quiniela = async (strategy) => {
            updateStatus(`⏳ Generando quiniela (${strategy})...`);
            try {
                const res = await fetch(`${API}/quiniela/generate?strategy=${strategy}`, { 
                    method: 'POST' 
                });
                const data = await res.json();
                displayResult(`🎲 Quiniela (${data.strategy})`, {
                    resultado: data.quiniela,
                    bets: data.bets,
                    estadisticas: data.stats
                });
                updateStatus(`✓ Quiniela: ${data.quiniela}`);
            } catch (e) {
                displayResult('❌ Error', e.message);
            }
        };
    </script>
</body>
</html>
```

---

## ⚛️ React Hook

```jsx
import { useState } from 'react';

const API = 'http://localhost:8000';

function QuinielaApp() {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [predictions, setPredictions] = useState(null);

  const loadData = async () => {
    setStatus('loading');
    try {
      const res = await fetch(`${API}/data/load`, { method: 'POST' });
      const result = await res.json();
      setData(result);
      setStatus('data_loaded');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const trainModel = async () => {
    setStatus('training');
    try {
      const res = await fetch(`${API}/model/train`, { method: 'POST' });
      const result = await res.json();
      setData(prev => ({ ...prev, metrics: result }));
      setStatus('trained');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const predict = async () => {
    setStatus('predicting');
    try {
      const res = await fetch(`${API}/predictions/generate`, { method: 'POST' });
      const result = await res.json();
      setPredictions(result.predictions);
      setStatus('predicted');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const generateQuiniela = async (strategy) => {
    setStatus('generating_quiniela');
    try {
      const res = await fetch(`${API}/quiniela/generate?strategy=${strategy}`, { 
        method: 'POST' 
      });
      const result = await res.json();
      setData(prev => ({ ...prev, quiniela: result }));
      setStatus('quiniela_ready');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div>
      <h1>⚽ LaLiga Predictor</h1>
      
      <div>
        <button onClick={loadData}>📥 Cargar Datos</button>
        <button onClick={trainModel} disabled={status !== 'data_loaded'}>
          🧠 Entrenar
        </button>
        <button onClick={predict} disabled={status !== 'trained'}>
          🔮 Predecir
        </button>
      </div>

      {predictions && (
        <div>
          <h2>Predicciones</h2>
          <table>
            <thead>
              <tr>
                <th>Partido</th>
                <th>Predicción</th>
                <th>P(1)</th>
                <th>P(X)</th>
                <th>P(2)</th>
                <th>Confianza</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((p, i) => (
                <tr key={i}>
                  <td>{p.home_team} vs {p.away_team}</td>
                  <td>{p.prediction}</td>
                  <td>{(p.prob_local * 100).toFixed(1)}%</td>
                  <td>{(p.prob_draw * 100).toFixed(1)}%</td>
                  <td>{(p.prob_away * 100).toFixed(1)}%</td>
                  <td>{(p.confidence * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data?.quiniela && (
        <div>
          <h2>Quiniela: {data.quiniela.quiniela}</h2>
        </div>
      )}

      <p>Estado: {status}</p>
    </div>
  );
}

export default QuinielaApp;
```

---

## 🖖 Vue 3 Composition API

```vue
<template>
  <div class="app">
    <h1>⚽ LaLiga Predictor</h1>
    
    <div class="controls">
      <button @click="loadData" :disabled="loading">📥 Cargar Datos</button>
      <button @click="trainModel" :disabled="loading || !dataLoaded">🧠 Entrenar</button>
      <button @click="predict" :disabled="loading || !modelTrained">🔮 Predecir</button>
      <button @click="quiniela('balanced')" :disabled="loading || !predictions">📊 Conservadora</button>
      <button @click="quiniela('aggressive')" :disabled="loading || !predictions">⚡ Arriesgada</button>
    </div>

    <div v-if="loading" class="spinner">Cargando...</div>

    <div v-if="metrics" class="metrics">
      <h2>Métricas Modelo</h2>
      <p>Accuracy: {{ (metrics.accuracy * 100).toFixed(1) }}%</p>
      <p>F1 Score: {{ metrics.f1_score.toFixed(4) }}</p>
    </div>

    <div v-if="predictions" class="predictions">
      <h2>Predicciones</h2>
      <table>
        <thead>
          <tr>
            <th>Partido</th>
            <th>Predicción</th>
            <th>Confianza</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(pred, i) in predictions" :key="i">
            <td>{{ pred.home_team }} vs {{ pred.away_team }}</td>
            <td>{{ pred.prediction }}</td>
            <td>{{ (pred.confidence * 100).toFixed(1) }}%</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="quinielaResult" class="quiniela">
      <h2>Quiniela</h2>
      <p><strong>{{ quinielaResult.quiniela }}</strong></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const API = 'http://localhost:8000';
const loading = ref(false);
const dataLoaded = ref(false);
const modelTrained = ref(false);
const metrics = ref(null);
const predictions = ref(null);
const quinielaResult = ref(null);

const loadData = async () => {
  loading.value = true;
  try {
    const res = await fetch(`${API}/data/load`, { method: 'POST' });
    const data = await res.json();
    dataLoaded.value = true;
  } finally {
    loading.value = false;
  }
};

const trainModel = async () => {
  loading.value = true;
  try {
    const res = await fetch(`${API}/model/train`, { method: 'POST' });
    const data = await res.json();
    metrics.value = data;
    modelTrained.value = true;
  } finally {
    loading.value = false;
  }
};

const predict = async () => {
  loading.value = true;
  try {
    const res = await fetch(`${API}/predictions/generate`, { method: 'POST' });
    const data = await res.json();
    predictions.value = data.predictions;
  } finally {
    loading.value = false;
  }
};

const quiniela = async (strategy) => {
  loading.value = true;
  try {
    const res = await fetch(`${API}/quiniela/generate?strategy=${strategy}`, { 
      method: 'POST' 
    });
    const data = await res.json();
    quinielaResult.value = data;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.app { padding: 20px; font-family: Arial; }
button { padding: 10px 20px; margin: 5px; cursor: pointer; }
button:disabled { opacity: 0.5; cursor: not-allowed; }
table { width: 100%; border-collapse: collapse; margin-top: 20px; }
th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
th { background-color: #f0f0f0; }
</style>
```

---

## 🐍 Python (Tkinter Desktop)

```python
import tkinter as tk
from tkinter import ttk, messagebox
import requests
import threading

API = 'http://localhost:8000'

class QuinielaApp:
    def __init__(self, root):
        self.root = root
        self.root.title("⚽ LaLiga Predictor")
        self.root.geometry("800x600")
        
        # Buttons
        btn_frame = ttk.Frame(root)
        btn_frame.pack(pady=10)
        
        ttk.Button(btn_frame, text="📥 Cargar Datos", command=self.load_data).pack(side="left", padx=5)
        ttk.Button(btn_frame, text="🧠 Entrenar", command=self.train).pack(side="left", padx=5)
        ttk.Button(btn_frame, text="🔮 Predecir", command=self.predict).pack(side="left", padx=5)
        ttk.Button(btn_frame, text="📊 Quiniela", command=self.quiniela).pack(side="left", padx=5)
        
        # Text area
        self.text = tk.Text(root, height=30, width=90)
        self.text.pack(padx=10, pady=10)
        
        # Status
        self.status = tk.Label(root, text="Listo", fg="green")
        self.status.pack()
    
    def update_status(self, msg, color="blue"):
        self.status.config(text=msg, fg=color)
        self.root.update()
    
    def log(self, msg):
        self.text.insert(tk.END, msg + "\n")
        self.text.see(tk.END)
        self.root.update()
    
    def load_data(self):
        def run():
            self.update_status("⏳ Cargando datos...", "blue")
            try:
                res = requests.post(f'{API}/data/load')
                data = res.json()
                self.log(f"✅ {data['message']}")
                self.update_status("✓ Datos cargados", "green")
            except Exception as e:
                self.log(f"❌ Error: {e}")
                self.update_status("Error", "red")
        
        threading.Thread(target=run).start()
    
    def train(self):
        def run():
            self.update_status("⏳ Entrenando...", "blue")
            try:
                res = requests.post(f'{API}/model/train')
                data = res.json()
                self.log(f"✅ Accuracy: {data['accuracy']:.2%}")
                self.update_status("✓ Modelo entrenado", "green")
            except Exception as e:
                self.log(f"❌ Error: {e}")
                self.update_status("Error", "red")
        
        threading.Thread(target=run).start()
    
    def predict(self):
        def run():
            self.update_status("⏳ Prediciendo...", "blue")
            try:
                res = requests.post(f'{API}/predictions/generate')
                data = res.json()
                for p in data['predictions']:
                    self.log(f"{p['home_team']} vs {p['away_team']}: {p['prediction']} ({p['confidence']:.0%})")
                self.update_status("✓ Predicciones listas", "green")
            except Exception as e:
                self.log(f"❌ Error: {e}")
                self.update_status("Error", "red")
        
        threading.Thread(target=run).start()
    
    def quiniela(self):
        def run():
            self.update_status("⏳ Generando quiniela...", "blue")
            try:
                res = requests.post(f'{API}/quiniela/generate?strategy=balanced')
                data = res.json()
                self.log(f"🎲 Quiniela: {data['quiniela']}")
                self.log(f"Estadísticas: {data['stats']}")
                self.update_status("✓ Quiniela lista", "green")
            except Exception as e:
                self.log(f"❌ Error: {e}")
                self.update_status("Error", "red")
        
        threading.Thread(target=run).start()

if __name__ == "__main__":
    root = tk.Tk()
    app = QuinielaApp(root)
    root.mainloop()
```

---

## 📱 Svelte

```svelte
<script>
  const API = 'http://localhost:8000';
  
  let status = 'idle';
  let predictions = [];
  let metrics = null;
  
  async function loadData() {
    status = 'loading';
    try {
      const res = await fetch(`${API}/data/load`, { method: 'POST' });
      const data = await res.json();
      status = data.success ? 'data_loaded' : 'error';
    } catch (e) {
      status = 'error';
    }
  }
  
  async function train() {
    status = 'training';
    try {
      const res = await fetch(`${API}/model/train`, { method: 'POST' });
      const data = await res.json();
      metrics = data;
      status = 'trained';
    } catch (e) {
      status = 'error';
    }
  }
  
  async function predict() {
    status = 'predicting';
    try {
      const res = await fetch(`${API}/predictions/generate`, { method: 'POST' });
      const data = await res.json();
      predictions = data.predictions;
      status = 'predicted';
    } catch (e) {
      status = 'error';
    }
  }
</script>

<main>
  <h1>⚽ LaLiga Predictor</h1>
  
  <div class="controls">
    <button on:click={loadData}>📥 Cargar</button>
    <button on:click={train} disabled={status !== 'data_loaded'}>🧠 Entrenar</button>
    <button on:click={predict} disabled={status !== 'trained'}>🔮 Predecir</button>
  </div>
  
  {#if metrics}
    <div class="metrics">
      <h2>Métricas</h2>
      <p>Accuracy: {(metrics.accuracy * 100).toFixed(1)}%</p>
    </div>
  {/if}
  
  {#if predictions.length > 0}
    <div class="predictions">
      <h2>Predicciones</h2>
      {#each predictions as pred}
        <div class="match">
          <strong>{pred.home_team} vs {pred.away_team}</strong>
          <p>Predicción: {pred.prediction} ({(pred.confidence * 100).toFixed(1)}%)</p>
        </div>
      {/each}
    </div>
  {/if}
  
  <p>Estado: {status}</p>
</main>

<style>
  main { padding: 20px; font-family: Arial; }
  button { padding: 10px 20px; margin: 5px; }
  button:disabled { opacity: 0.5; }
  .match { border: 1px solid #ddd; padding: 10px; margin: 5px 0; }
</style>
```

---

## ✨ Tips de Integración

### 1. **CORS Setup**
Si tu UI está en dominio diferente, configura CORS en `api.py`:

```python
allow_origins=["http://localhost:3000", "https://tudominio.com"]
```

### 2. **Error Handling**
```javascript
try {
  const res = await fetch(...);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
} catch (error) {
  console.error('API Error:', error);
}
```

### 3. **Loading States**
Siempre usa loading/spinner durante las llamadas:
```javascript
setLoading(true);
try {
  // ... API call
} finally {
  setLoading(false);
}
```

### 4. **Validación**
```javascript
if (!data.data_loaded) {
  showError('Primero carga datos');
  return;
}
```

---

**¡Elige tu framework y empieza!** 🎨

Ver `API_DOCS.md` para documentación completa de endpoints.
