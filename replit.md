# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Project: LastMinute Tours

A web service for spontaneous travelers. Users enter their departure city and budget, and the service finds the top 3 cheapest tours departing within 7 days, with AI-generated descriptions for each.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **AI**: OpenAI gpt-5-mini via Replit AI Integrations
- **Frontend**: React 18 + Vite + TailwindCSS + TanStack Query
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── lastminute/         # React + Vite frontend (preview path: /)
│   └── api-server/         # Express API server (preview path: /api)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── README.md               # Project description
├── REFERENCES.md           # Market research and literature review
├── ANALYSIS.md             # Target audience analysis
├── TESTS.md                # Testing results (technical + user)
├── IMPROVEMENTS.md         # Improvements based on feedback
└── LICENSE                 # MIT License
```

## API Endpoints

- `GET /api/healthz` — Health check
- `GET /api/tours/cities` — List departure cities
- `POST /api/tours/search` — Search tours (body: {departureCity, budget, adults})

## Key Files

- `artifacts/api-server/src/routes/tours/leveltravel.ts` — Tour generation logic + OpenAI descriptions
- `artifacts/api-server/src/routes/tours/search.ts` — Search route handler
- `artifacts/api-server/src/routes/tours/cities.ts` — Cities list
- `artifacts/lastminute/src/pages/home.tsx` — Main page
- `artifacts/lastminute/src/components/home/` — Search form, tour cards, results
- `lib/api-spec/openapi.yaml` — OpenAPI contract
