# La QuinielIA — Frontend Web App

Modern React web application implementing the **La QuinielIA Design System**. Connects to the FastAPI backend for ML predictions and LaLiga match data.

## Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**
- **Backend API** running on `http://localhost:8000` (see root README)

### Installation

```bash
cd frontend
npm install
```

### Environment Setup

Copy the example env file:
```bash
cp .env.example .env
```

Edit `.env` if your backend is running on a different URL.

### Development Server

```bash
npm run dev
```

Opens the app at **http://localhost:3000** by default. The dev server proxies API calls to `http://localhost:8000`.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
frontend/
├── index.html                    Main HTML entry point
├── vite.config.js               Vite configuration
├── package.json                 Dependencies
├── .env.example                 Environment template
│
├── src/
│   ├── main.jsx                 App root component
│   │
│   ├── api/
│   │   └── client.js            API client for backend communication
│   │
│   ├── components/
│   │   ├── Header.jsx           Top navigation bar
│   │   ├── KPICards.jsx         Statistics cards row
│   │   ├── PredictionsTable.jsx Matchday predictions table (coming soon)
│   │   ├── QuinielaSelector.jsx Strategy selector (coming soon)
│   │   └── ModelInsights.jsx    Model analytics (coming soon)
│   │
│   └── styles/
│       └── tokens.css           Design system CSS variables
```

## Design System

The app implements the **La QuinielIA Design System** with:

- **Colors**: Teal primary (#14B8A6), Navy backgrounds, Gold accents
- **Typography**: Space Grotesk (display), Inter (body), JetBrains Mono (code)
- **Components**: Cards, buttons, inputs, tables, KPI cards
- **Animations**: Fast, purposeful transitions (150ms–400ms)
- **Icons**: Lucide React icons (thin-stroke, 1.5px)

All design tokens defined in `src/styles/tokens.css`.

## API Integration

The app communicates with the backend FastAPI at `http://localhost:8000`:

### Endpoints Used

- **Data Loading**
  - `POST /data/load` — Download LaLiga data
  - `GET /data/history` — Last 20 matches
  - `GET /data/next-matchday` — Upcoming matches

- **Model Training**
  - `POST /model/train` — Train ML model
  - `GET /model/metrics` — Accuracy, F1, confusion matrix
  - `GET /model/features` — Feature importance

- **Predictions**
  - `POST /predictions/generate` — Generate match predictions
  - `GET /predictions/latest` — Last cached predictions

- **Quiniela (Betting Slips)**
  - `POST /quiniela/generate` — Generate betting slips (strategy: balanced/aggressive/high_confidence)

- **League Standings**
  - `GET /standings` — Current classification

See `src/api/client.js` for implementation.

## Pages / Screens

### Dashboard (default)
- KPI cards (accuracy, matches, confidence, hits)
- Quick model status
- Action buttons

### Predicciones (Predictions)
- Detailed matchday predictions
- Probability bars for each outcome (1/X/2)
- Confidence indicators

### Resultados (Results)
- Historical results
- Prediction accuracy tracking
- Hits vs misses

### Historial (History)
- Past jornadas
- Model performance over time

### Ajustes (Settings)
- API key management
- League selection
- Model parameters

## Technologies

- **React 18** — UI framework
- **Vite 5** — Build tool & dev server
- **Lucide React** — Icon library
- **Axios** (optional, can use Fetch API)
- **CSS Variables** — Design token system

## Development

### Adding a New Component

1. Create file in `src/components/ComponentName.jsx`
2. Import design tokens from `src/styles/tokens.css`
3. Use CSS variables for colors, spacing, shadows
4. Export as named export

Example:
```jsx
export const MyComponent = ({ data }) => {
  return (
    <div style={{ color: 'var(--lq-text-primary)' }}>
      {data}
    </div>
  )
}
```

### Connecting to API

Use `apiClient` from `src/api/client.js`:

```jsx
import { apiClient } from '../api/client'

const MyComponent = () => {
  useEffect(() => {
    apiClient.generatePredictions()
      .then(data => console.log(data))
      .catch(err => console.error(err))
  }, [])
}
```

## Next Steps

- [ ] Implement PredictionsTable component
- [ ] Implement QuinielaSelector with strategy tabs
- [ ] Implement ModelInsights with charts
- [ ] Add loading states and error handling
- [ ] Add toast notifications
- [ ] Implement real data binding from API
- [ ] Add responsive design (tablet/mobile)
- [ ] Add dark mode toggle (optional)

## Troubleshooting

### API not connecting?
- Check backend is running: `python api.py`
- Verify backend is on `http://localhost:8000`
- Check browser console for CORS errors

### Styles not loading?
- Make sure `src/styles/tokens.css` is imported in `src/main.jsx`
- Clear cache: `npm run dev` and hard refresh browser

### Port 3000 already in use?
```bash
npm run dev -- --port 3001
```

## License

MIT — See LICENSE file in root directory
