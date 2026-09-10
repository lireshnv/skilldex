# SkillDex API

Express/TypeScript backend for SkillDex. Serves the platform's seeded data
(students, companies, colleges, faculty, jobs, assessments, applications,
notifications, skills) over REST, deterministically generated from the same
seeded PRNG the frontend originally used locally (`src/data/seed.ts`), so the
data is identical to what the app previously rendered from static imports.

## Endpoints

- `GET /health` — health check (used by Railway)
- `GET /api/bootstrap` — everything in one payload (what the frontend uses on load)
- `GET /api/students`, `GET /api/students/:id`, `GET /api/students/:id/projects`,
  `GET /api/students/:id/assessment-results`, `GET /api/students/:id/applications`
- `GET /api/colleges`, `GET /api/colleges/:id`
- `GET /api/companies`, `GET /api/companies/:id`
- `GET /api/faculty`, `GET /api/faculty/:id`
- `GET /api/alumni`, `GET /api/alumni/:id`
- `GET /api/jobs`, `GET /api/jobs/:id`, `GET /api/jobs/:id/applications`
- `GET /api/assessments`, `GET /api/assessments/:id`, `GET /api/assessments/:id/questions`
- `GET /api/applications`
- `GET /api/skills`, `GET /api/skills/:id`
- `GET /api/notifications?audience=student|faculty|placement|recruiter|company`

## Local development

```bash
npm install
cp .env.example .env
npm run dev        # http://localhost:4000
```

## Deploying to Railway

1. Push this repo to GitHub (the `backend/` folder can live alongside the
   Next.js frontend — Railway lets you set a custom root directory).
2. At [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**.
3. Set the service's **Root Directory** to `backend`.
4. Railway auto-detects Node via Nixpacks and uses `railway.toml`
   (`npm run build` / `npm start`). No Dockerfile needed.
5. Set the environment variable `FRONTEND_ORIGIN` to your Vercel URL(s), e.g.
   `https://skilldex.vercel.app,http://localhost:3000`.
6. Deploy. Railway assigns `PORT` automatically. Copy the generated public
   URL (e.g. `https://skilldex-api-production.up.railway.app`) — the frontend
   needs it as `NEXT_PUBLIC_API_URL`.

CLI alternative:

```bash
npm i -g @railway/cli
railway login
cd backend
railway init
railway up
railway variables set FRONTEND_ORIGIN=https://skilldex.vercel.app
railway domain   # generates/shows the public URL
```
