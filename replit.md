# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Project: LastMinute Tours

A web service for spontaneous travelers. Users enter their departure city and budget, and the service finds the top 3 cheapest tours departing within 7 days, with AI-generated descriptions for each tour.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **AI (primary)**: GigaChat Pro (Sber) via OAuth2 — key stored in DB
- **AI (fallback)**: OpenAI gpt-5-mini via Replit AI Integrations
- **Frontend**: React 19 + Vite + TailwindCSS v4 + TanStack Query + framer-motion
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **Database**: PostgreSQL via Drizzle ORM (`lib/db`)
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Tests**: Vitest (api-server)

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

## Pages

- `/` — Main landing page (hero, search form, results, benefits, steps, reviews, CTA)
- `/help` — Help center (FAQ, step-by-step guide, AI explanation, contact)
- `/admin/settings` — Admin panel to set GigaChat Pro key and Level.Travel token

## API Endpoints

- `GET /api/healthz` — Health check
- `GET /api/tours/cities` — List departure cities
- `POST /api/tours/search` — Search tours (body: {departureCity, budget, adults})
- `GET /api/admin/settings` — List settings (masked)
- `PUT /api/admin/settings/:key` — Update a setting (keys: GIGACHAT_KEY, LEVEL_TRAVEL_TOKEN)
- `DELETE /api/admin/settings/:key` — Delete a setting
- `GET /api/admin/settings/status` — Check which integrations are configured

## DB Schema

- `settings` table: key (PK), value, updatedAt — stores GigaChat and Level.Travel tokens

## Key Files

- `artifacts/api-server/src/lib/gigachat.ts` — GigaChat Pro OAuth2 client
- `artifacts/api-server/src/routes/tours/leveltravel.ts` — Tour search + AI description generation
- `artifacts/api-server/src/routes/tours/search.ts` — Search route handler
- `artifacts/api-server/src/routes/admin/settings.ts` — Admin settings CRUD
- `artifacts/api-server/src/tests/api.test.ts` — API integration tests (16 tests)
- `artifacts/lastminute/src/pages/home.tsx` — Main page (selling, benefits, reviews)
- `artifacts/lastminute/src/pages/help.tsx` — Help center
- `artifacts/lastminute/src/pages/admin/settings.tsx` — Admin settings UI
- `artifacts/lastminute/src/components/home/` — Search form, tour cards, results
- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)

## AI Priority Chain

1. **GigaChat-Pro** — if GIGACHAT_KEY is set in DB settings table
2. **OpenAI gpt-5-mini** — if AI_INTEGRATIONS_OPENAI_BASE_URL env var is set
3. **Static fallback** — pre-written description if both AI providers fail

## Running Tests

```bash
cd artifacts/api-server && pnpm test
```

## DB Operations

```bash
# Push schema changes
pnpm --filter @workspace/db run push

# Codegen after spec changes
pnpm --filter @workspace/api-spec run codegen
```
