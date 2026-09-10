This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

**Live:** frontend on [Vercel](https://skilldex-delta.vercel.app) · backend on [Railway](https://skilldex-api-production.up.railway.app/health)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Architecture: frontend (Vercel) + backend (Railway)

This repo now ships as two deployable pieces:

- **Frontend** (this Next.js app, repo root) → deploy to **Vercel**.
- **Backend** (`backend/`, an Express/TypeScript API serving the platform's
  student/company/college/job/assessment data) → deploy to **Railway**.

The frontend generates its own local seed data by default (zero-config,
works standalone). When `NEXT_PUBLIC_API_URL` is set, it also fetches the
same data from the backend on load and swaps it in — see
[`src/lib/data/hydrate.ts`](src/lib/data/hydrate.ts). See
[`backend/README.md`](backend/README.md) for the API and Railway deploy
steps.

### Deploy steps

1. **Backend → Railway**: follow [`backend/README.md`](backend/README.md).
   Note the public URL Railway gives you (e.g.
   `https://skilldex-api-production.up.railway.app`).
2. **Frontend → Vercel**:
   ```bash
   npm i -g vercel
   vercel login
   vercel        # link/create the project (root directory = repo root)
   vercel env add NEXT_PUBLIC_API_URL production   # paste the Railway URL
   vercel --prod
   ```
   Or via the dashboard: [vercel.com/new](https://vercel.com/new) → import
   this repo → add `NEXT_PUBLIC_API_URL` under Project Settings →
   Environment Variables → deploy.
3. Back on Railway, set `FRONTEND_ORIGIN` to your Vercel URL so CORS allows
   it (see `backend/.env.example`).

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
