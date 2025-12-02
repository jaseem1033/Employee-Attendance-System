# Backend — Employee Attendance API

This directory contains the backend API for the Employee Attendance System. It's an Express server written in TypeScript and uses Postgres for persistence.

## Goals
- Provide authentication (JWT) and user management
- Expose attendance endpoints (check-in, check-out, history)
- Provide manager endpoints (dashboard/summary, all attendance)

## Quick local setup

Prerequisites: Node 18+, npm, Postgres (local or remote).

1. Install deps and start in dev mode:

```bash
cd backend
npm install
# create a `.env` file (see below) or set env vars in your shell
npm run dev
```

The `dev` script runs the TypeScript sources with a watcher (via `ts-node-dev`). The server entrypoint is `src/server.ts`.

## Scripts
- `npm run dev` — Start development server with auto-reload
- `npm run build` — Compile TypeScript to `dist/`
- `npm start` — Run the compiled server (`node dist/server.js`)
- `npm test` — (if present) run tests

Check `package.json` for the exact script commands used in your project.

## Important endpoints (examples)
- `POST /api/auth/login` — login, returns JWT
- `POST /api/auth/register` — register user
- `GET /api/auth/me` — current user profile
- `POST /api/attendance/checkin` — check in for the day
- `POST /api/attendance/checkout` — check out for the day
- `GET /api/attendance/my-history` — current user's attendance history
- `GET /api/attendance/all` — (manager) all attendance rows
- `GET /api/dashboard/manager` — (manager) aggregated stats and weekly trend
- `GET /api/health` — healthcheck

These are the routes the frontend expects; check `src/routes` or `src/controllers` for precise implementations.

## Environment variables
The app supports two ways to configure the Postgres connection: a single `DATABASE_URL` connection string or individual DB values.

- `DATABASE_URL` (recommended in production): e.g. `postgres://user:pass@host:5432/dbname`
- `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`
- `JWT_SECRET` (required): secret used to sign JWT tokens.
- `JWT_EXPIRES_IN` (optional): token lifetime, e.g. `7d` (default configurable in code).
- `CLIENT_URL` (optional): frontend origin for CORS (e.g. `http://localhost:5173`)
- `NODE_ENV` (set to `production` in production)
- `PORT` (the app uses `process.env.PORT || 5000`)

### SSL note for managed Postgres
When `NODE_ENV === 'production'` the DB connector enables SSL with `rejectUnauthorized: false` for compatibility with many managed providers. Adjust that behavior in `src/utils/db.ts` if your provider enforces certificate verification.

## Database / Migrations
- If your project includes a migration tool (Prisma/knex/TypeORM), follow that tool's README. Otherwise, apply your SQL schema manually to your Postgres instance before running the app.

## Deploying to Render (recommended quick steps)
1. Create a Postgres instance in Render and copy the connection URL.
2. Create a Web Service on Render and set the root to the `backend` folder.
	- Build Command: `npm run build`
	- Start Command: `npm start`
	- Health check path: `/api/health`
3. Provide environment variables in Render's dashboard: `DATABASE_URL` (or the individual DB vars), `JWT_SECRET`, `CLIENT_URL`, and set `NODE_ENV=production`.

## Security
- Never commit `.env` files or plaintext secrets. Use Render (or your host) environment variables.
- If a secret has been accidentally committed or pushed, rotate it immediately (DB password, `JWT_SECRET`).

## Troubleshooting
- Port collisions: set `PORT` explicitly or ensure Render provides one.
- DB connection errors: verify `DATABASE_URL` or individual DB vars, and confirm your DB allows connections from Render (or your host).
- JWT/auth issues: check `JWT_SECRET` consistency between auth clients and server.

## Useful commands
Generate a secure `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Where to look in the code
- `src/utils/db.ts` — Postgres pool initialization
- `src/server.ts` — app bootstrap
- `src/routes` or `src/controllers` — API handlers

