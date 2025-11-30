
# Employee Attendance System

Lightweight attendance tracking application with a React + Vite frontend and a Node/Express TypeScript backend using Postgres.

This repository contains two main apps:
- `frontend/` — Vite + React single-page app
- `backend/` — Express + TypeScript API

This root README provides an overview and quick start. For detailed per-app instructions see `frontend/README.md` and `backend/README.md`.

## Architecture overview
- Frontend: SPA that handles authentication and UI. Communicates with the backend using `VITE_API_URL`.
- Backend: REST API with JWT-based authentication and attendance endpoints. Connects to Postgres.

## Quick start (local)

Prereqs: Node 18+, npm, and Postgres (local or remote).

1) Start the backend

```bash
cd backend
npm install
# create backend/.env (see backend/README.md for variables)
npm run dev
```

2) Start the frontend

```bash
cd frontend
npm install
# create frontend/.env with VITE_API_URL pointing to your backend, e.g.:
# VITE_API_URL=http://localhost:4000/api
npm run dev
```

Open the frontend dev URL shown in the console (usually `http://localhost:5173`).

## Tests & linting
- If the repo contains tests or lint scripts, run them from the corresponding package folders (e.g., `cd backend && npm test`).

## Deploying to Render (summary)

1. Create or provision a Postgres database in Render and copy the `DATABASE_URL`.
2. Create a Web Service in Render for the backend (root: `backend`).
   - Build: `npm run build`
   - Start: `npm start`
   - Env: `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`, `NODE_ENV=production`
3. Create a Static Site in Render for the frontend (root: `frontend`).
   - Build: `npm run build`
   - Publish dir: `dist`
   - Env: `VITE_API_URL` (pointing to the backend URL)

## Next steps I can do for you
- Add `backend/.env.example` and `frontend/.env.example` with safe defaults
- Create a `render.yaml` to codify Render services for reproducible deploys
- Remove `.env` from git history (destructive) if secrets were committed — I can provide steps if needed

If you'd like, tell me which README(s) you'd like even more detail in (API reference, ERD, Docker instructions, or deployment automation), and I'll add that content next.
