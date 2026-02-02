# Sypev EdTech MVP (SAT + USA Admissions)

Monorepo layout:
- `server/` Express API
- `web/` Vite React app
- `shared/` (reserved for shared types)

## Setup

```bash
npm install
npm --workspace server run db:migrate
npm --workspace server run import -- --universities ./server/data/sample/universities.csv --facts ./server/data/sample/facts.csv
```

## Env vars

Server (`server/.env` optional):
- `PORT` (default: 5000)
- `DB_PATH` (default: `./data/dev.sqlite`)
- `NODE_ENV` (`development` or `production`)
- `OPENAI_API_KEY` (optional; AI tutor uses mock when absent)

Postgres path: set `DATABASE_URL` in the future to swap SQLite for Postgres (documented; not wired yet).

## Dev

```bash
npm run dev
```

- API: `http://localhost:5000/api`
- Web: `http://localhost:5173`

## Build & start

```bash
npm run build
npm run start
```

## Import universities & facts

```bash
npm --workspace server run import -- --universities ./server/data/sample/universities.csv --facts ./server/data/sample/facts.csv
```

CSV format:
- Universities: `university_name,state,tuition_usd,aid_policy,sat_range_min,sat_range_max,english_req,application_deadline,description`
- Facts: `university_name,fact_text,source_url,tag,year`

## Deployment notes

- Configure your platform to expose the `server` service (PORT or 5000).
- SSL is handled by the hosting platform.
