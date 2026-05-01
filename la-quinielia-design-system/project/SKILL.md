---
name: la-quinielia-design
description: Use this skill to generate well-branded interfaces and assets for La QuinielIA, an AI-powered football prediction platform for Spain's LaLiga. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Key brand facts (quick reference)
- Primary: #14B8A6 (teal) · Accent: #F59E0B (gold) · Success: #22C55E · Danger: #EF4444
- Background: #0F172A (deep navy) · Surface: #1E293B
- Fonts: Space Grotesk (display/numbers), Inter (body/UI), JetBrains Mono (data/code)
- Icons: Lucide (CDN: https://unpkg.com/lucide@latest/dist/umd/lucide.min.js)
- Dark-first UI — never use white backgrounds for the main app
- Language: Spanish UI copy ("Jornada", "Quiniela", "Confianza", "Predicción")
- The 3 pick outcomes are always displayed as: 1 (local), X (empate), 2 (visitante)
- Quiniela strategies: Conservadora / Equilibrada / Arriesgada

## File index
- README.md — full brand guidelines
- colors_and_type.css — all CSS variables + utility classes
- assets/logo.svg — primary logo (dark bg)
- assets/logo-light.svg — logo for light backgrounds
- assets/favicon.svg — icon mark / favicon
- preview/ — design system card previews (register with register_assets)
- ui_kits/webapp/index.html — full interactive dashboard prototype
- ui_kits/webapp/*.jsx — React components (Header, KPICards, PredictionsTable, QuinielaSelector, ModelInsights)
