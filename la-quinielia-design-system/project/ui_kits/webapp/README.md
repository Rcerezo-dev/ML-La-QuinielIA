# La QuinielIA — Web App UI Kit

High-fidelity interactive prototype of the La QuinielIA dashboard web application.

## Design Width
1280px desktop-first (responsive down to 768px tablet)

## Screens / Flows
1. **Dashboard** (default) — KPI cards, predictions table, quiniela mode selector
2. **Predictions** — Full matchday table with probability bars
3. **History** — Past jornadas and accuracy tracking
4. **Settings** — API key, league config, model params

## Components
- `Header.jsx` — Top nav with logo, nav links, action buttons
- `KPICards.jsx` — 4-card stat row (accuracy, matches, confidence, hits)
- `PredictionsTable.jsx` — Matchday predictions table with progress bars
- `QuinielaSelector.jsx` — Strategy tabs + quiniela output display
- `ModelInsights.jsx` — Small charts for home/draw/away distribution

## Usage
Open `index.html` in a browser. Click nav links to switch screens.
All data is mocked — no API connection required.

## Icon System
Uses Lucide Icons via CDN (unpkg.com/lucide@latest).
Stroke width: 1.5px, size: 20px default.

## Font Stack
- Display: Space Grotesk (Google Fonts)
- Body: Inter (Google Fonts)
- Mono: JetBrains Mono (Google Fonts)
