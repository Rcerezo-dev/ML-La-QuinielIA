# La QuinielIA — Design System

## Overview

**La QuinielIA** is an AI-powered football prediction platform focused on Spain's LaLiga. It blends Spanish football culture with machine learning to generate probabilistic predictions and "quiniela" (betting slip) suggestions. The product targets football enthusiasts and ML learners who want data-driven insights on upcoming match days.

### Products / Surfaces

| Surface | Description |
|---------|-------------|
| **Web App (Streamlit → Custom)** | Primary dashboard: load data, train ML model, view predictions, generate quinielas |
| **REST API** | FastAPI backend exposing `/data/load`, `/model/train`, `/predictions/generate`, `/quiniela/generate` |
| **CLI** | Terminal script (`scripts/predict.py`) for quick prediction output |

### Source Materials

- **GitHub Repo**: `https://github.com/Rcerezo-dev/ML-La-QuinielIA` (main branch)
- **Key files read**: `app.py`, `ARCHITECTURE.md`, `EXAMPLE_UI_INTEGRATION.md`, `src/config.py`, `DELIVERABLES.md`, `README.md`
- No Figma design file was provided — design system is derived from the product spec and brand description

---

## CONTENT FUNDAMENTALS

### Language & Tone
- **Primary language**: Spanish — all UI copy is in Spanish (e.g. "Cargar Datos", "Entrenar Modelo", "Generar Quiniela")
- **Tone**: Confident, data-driven, slightly playful — like a smart friend who loves football
- **Voice**: Direct and action-oriented. Short imperative CTAs ("Predecir", "Entrenar", "Generar")
- **Register**: Semi-casual. Not formal. Uses emoji in original Streamlit UI (⚽ 🧠 🔮 🎯) — the custom design system reduces emoji, favoring clean iconography

### Key Terms & Vocabulary
| Spanish | English | Context |
|---------|---------|---------|
| Jornada | Matchday | "Próxima Jornada" = Next Matchday |
| Quiniela | Betting slip | The 1X2 prediction coupon |
| Local | Home | Home team |
| Visitante | Away | Away team |
| Confianza | Confidence | Model confidence % |
| Entrenamiento | Training | ML model training |
| Predicción | Prediction | Match outcome prediction |

### Copy Style
- Short, punchy section headers: "Predicciones", "Clasificación", "Modelo"
- Metric labels are short: "Accuracy", "F1 Score", "Partidos" — NOT verbose
- Status messages are friendly: "Datos cargados ✓", "Modelo listo"
- Strategies named evocatively: Conservadora / Arriesgada / Alto Nivel Confianza
- Disclaimer always present: "Las predicciones son probabilísticas. No garantizan resultados."

### Emoji Usage
- **In original app**: Heavy emoji use (⚽ 🧠 🔮 ✅ ❌)
- **In design system**: Emoji is reduced; use purpose-built icons instead. Emoji only in informal contexts (status badges, inline hints)

---

## VISUAL FOUNDATIONS

### Color System

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#14B8A6` | Teal — primary actions, active states, highlights |
| `--color-secondary` | `#0F172A` | Deep navy — main app background |
| `--color-accent` | `#F59E0B` | Gold — confidence highlights, prediction badges |
| `--color-success` | `#22C55E` | Green — correct picks, winning outcomes |
| `--color-danger` | `#EF4444` | Red — wrong picks, losses, errors |
| `--color-neutral-light` | `#E5E7EB` | Light grey — borders, disabled states |
| `--color-neutral-dark` | `#1E293B` | Dark slate — card backgrounds, secondary panels |
| `--color-surface` | `#1E293B` | Card surfaces on dark background |
| `--color-surface-elevated` | `#263348` | Elevated card (hover/focus) |
| `--color-text-primary` | `#F1F5F9` | Main text on dark bg |
| `--color-text-secondary` | `#94A3B8` | Secondary/muted text |
| `--color-gradient` | `linear-gradient(135deg, #14B8A6 0%, #3B82F6 100%)` | Gradient — hero accent, logo fills |

### Typography
- **Display / Hero**: Space Grotesk — bold geometric, numbers render crisply (critical for % and odds)
- **Body / UI**: Inter — clean, readable, excellent at small sizes
- **Mono / Data**: JetBrains Mono — code blocks, raw probability values, API examples
- **Scale**: 12px min / 14px body / 16px UI / 20px subheads / 28px section heads / 40px hero / 56px+ display

### Backgrounds
- Main app background: `#0F172A` (deep navy) — never white
- Cards sit on `#1E293B` — a subtle lift from the background
- No full-bleed photography — this is a data app
- Optional: very subtle grid/dot pattern overlay at low opacity for futuristic feel
- Gradient accent bar used sparingly in hero/header sections

### Spacing System
- Base unit: 4px
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96
- Card padding: 24px standard
- Section gaps: 32–40px
- Component gaps (between KPI cards): 16–20px

### Corner Radii
- `--radius-sm`: 6px — tags, badges, small inputs
- `--radius-md`: 10px — buttons, small cards
- `--radius-lg`: 16px — main cards, panels
- `--radius-xl`: 24px — hero panels, modals

### Shadows & Elevation
- Level 0 (flat): no shadow
- Level 1 (card): `0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)`
- Level 2 (elevated card): `0 4px 16px rgba(0,0,0,0.4)`
- Level 3 (modal/popover): `0 20px 60px rgba(0,0,0,0.6)`
- Glow (active/focused): `0 0 0 3px rgba(20,184,166,0.3)` (teal glow)
- Accent glow: `0 0 20px rgba(20,184,166,0.15)` on hero cards

### Borders
- Default: `1px solid rgba(255,255,255,0.06)` — very subtle on dark
- Active/hover: `1px solid rgba(20,184,166,0.4)` — teal tint
- Danger: `1px solid rgba(239,68,68,0.4)`
- Success: `1px solid rgba(34,197,94,0.3)`

### Glassmorphism
- Used **lightly** only on hero panels and modal overlays
- Pattern: `background: rgba(30,41,59,0.7); backdrop-filter: blur(12px);`
- Not used on tables or data-dense areas (legibility priority)

### Animation
- Principle: **fast and purposeful** — never decorative
- Duration: 150ms for micro (hover, state toggle), 250ms for transitions, 400ms for panel reveals
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` — snappy ease-out
- Hover: cards lift `translateY(-2px)` + subtle shadow increase
- Button press: `scale(0.97)` brief shrink
- Progress bars: animate width on load with ease-out
- No looping animations except loading spinners

### Hover & Press States
- Buttons: background lightens 10% + `translateY(-1px)` + glow
- Cards: `translateY(-2px)` + brighter border
- Table rows: `background: rgba(20,184,166,0.05)` teal tint
- Links: underline slides in from left
- Press: `scale(0.97)` + shadow collapses

### Cards
- Background: `#1E293B`
- Border: `1px solid rgba(255,255,255,0.06)`
- Border-radius: 16px
- Padding: 24px
- Shadow: Level 1 at rest, Level 2 on hover
- KPI cards: accent top-border in primary color (3px)

### Tables
- Background: transparent (inherits section bg)
- Header row: `#1E293B` with `rgba(20,184,166,0.1)` tint
- Alternate rows: `rgba(255,255,255,0.02)` striping
- Hover row: `rgba(20,184,166,0.06)`
- No outer border — use inner row separators only (`border-bottom: 1px solid rgba(255,255,255,0.04)`)

### Imagery
- No photography in UI
- Data visualizations: Plotly-style dark theme charts (bg transparent, grid `rgba(255,255,255,0.05)`)
- Chart accent colors: primary teal `#14B8A6`, gold `#F59E0B`, blue `#3B82F6`
- Logo: geometric SVG — flat, dual-mode (light/dark)

---

## ICONOGRAPHY

### Approach
- No icon font bundled in original codebase (Streamlit-based, emoji-heavy)
- **Design system uses**: [Lucide Icons](https://lucide.dev/) via CDN — `https://unpkg.com/lucide@latest`
- Lucide matches the brand: thin-stroke, geometric, clean, tech-forward
- Icon size: 16px (inline), 20px (UI controls), 24px (primary actions), 32px (feature icons)
- Stroke width: 1.5px (default Lucide) — do not use filled icons
- Color: `currentColor` — inherit from text

### Key Icons Used
| Context | Lucide Icon |
|---------|-------------|
| Load Data | `download-cloud` |
| Train Model | `cpu` |
| Generate Predictions | `sparkles` |
| Generate Quiniela | `list-checks` |
| Dashboard | `layout-dashboard` |
| Predictions | `target` |
| History | `history` |
| Settings | `settings` |
| Accuracy | `percent` |
| Confidence | `shield-check` |
| Home win (1) | `home` |
| Draw (X) | `equal` |
| Away win (2) | `plane` |
| Success/Win | `check-circle` |
| Danger/Loss | `x-circle` |
| Warning | `alert-triangle` |

### Logo Assets
- Primary logo SVG: `assets/logo.svg` (dark background version)
- Logo light: `assets/logo-light.svg` (for light contexts)
- Favicon: `assets/favicon.svg`
- See `assets/` folder for all visual assets

---

## FILE INDEX

```
/
├── README.md                    ← This file
├── SKILL.md                     ← Agent skill definition
├── colors_and_type.css          ← CSS variables (colors, type, spacing, shadows)
│
├── assets/
│   ├── logo.svg                 ← Primary logo (dark bg)
│   ├── logo-light.svg           ← Logo (light bg)  
│   └── favicon.svg              ← Favicon / icon mark
│
├── preview/                     ← Design system card previews
│   ├── colors-primary.html
│   ├── colors-semantic.html
│   ├── colors-neutrals.html
│   ├── type-scale.html
│   ├── type-specimens.html
│   ├── spacing-tokens.html
│   ├── shadow-elevation.html
│   ├── radius-borders.html
│   ├── components-buttons.html
│   ├── components-cards.html
│   ├── components-badges.html
│   ├── components-table.html
│   ├── components-inputs.html
│   ├── brand-logo.html
│   └── brand-icons.html
│
└── ui_kits/
    └── webapp/
        ├── README.md
        ├── index.html            ← Full interactive dashboard prototype
        ├── Header.jsx
        ├── KPICards.jsx
        ├── PredictionsTable.jsx
        ├── QuinielaSelector.jsx
        └── ModelInsights.jsx
```
