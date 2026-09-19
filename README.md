# PurePaw Product Feedback Dashboard

Premium customer-feedback dashboard for **PurePaw Dog Food Powder** product testing.

> **DEMO DATA** is enabled by default. Toggle Demo Mode off in Settings when connecting real responses. Demo data is for development only and does not represent actual customer results.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- Recharts
- Lucide React
- React Router

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite (typically `http://localhost:5173`).

## Other scripts

```bash
npm run build    # Typecheck + production build
npm run preview  # Preview production build
npm run lint     # Oxlint
```

## Pages

| Route | Page |
|-------|------|
| `/` | Dashboard — KPIs, acceptance score, charts |
| `/responses` | Searchable response table + detail panel + CSV export |
| `/insights` | Product development themes & signals |
| `/feedback` | Written customer comment cards |
| `/settings` | Demo Mode toggle & data-source notes |

## Data layer

- Demo dataset: `src/data/demoResponses.ts`
- Service API: `src/services/dataService.ts` (`getResponses`, `getResponseById`, `getDashboardMetrics`, `getProductInsights`)
- Google Sheets integration points are documented as comments inside `dataService.ts`

## Product-safety note

The dashboard presents **customer-reported observations**, not proven product effects. Acceptance Score is an internal feedback metric only.
