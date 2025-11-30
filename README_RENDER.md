# Deploying to Render — quick reference

This file explains the one-time steps to deploy this repository to Render using the included `render.yaml` manifest.

1) Connect the repo
- Go to https://dashboard.render.com and connect your GitHub/GitLab/Bitbucket repo that contains this project.

2) Import from the `render.yaml` manifest
- When you import the repo, Render will detect `render.yaml` and offer to create the services defined there (backend web service, frontend static site, and a Postgres database).

3) Set environment variables / secrets (required)
- After the services are created, open the backend service (employee-attendance-backend) and set the following environment variables in the Render dashboard:
  - `DATABASE_URL` — Postgres connection string (Render's managed DB will provide this if you created the DB via the manifest)
  - `JWT_SECRET` — a long random string used to sign JWTs
  - `CLIENT_URL` — your frontend origin (e.g. `https://employee-attendance-frontend.onrender.com`)
  - `NODE_ENV=production`

- For the frontend static site (employee-attendance-frontend) set:
  - `VITE_API_URL` — the backend URL with `/api` (for example: `https://employee-attendance-backend.onrender.com/api`)

Security: do NOT paste secrets into the repo. Use Render's dashboard to store variables.

4) Configure build & start commands (if not already set)
- Backend (root: `backend`):
  - Build: `npm run build`
  - Start: `npm start`
  - Health check: `/api/health`

- Frontend (root: `frontend`):
  - Build: `npm run build`
  - Publish directory: `dist`

5) One-time DB setup (if applicable)
- If your project requires schema migrations, run migration steps manually after DB creation. There is no automatic migration in this repo unless you added a migration tool. If you use Prisma or another migration tool, run the appropriate commands in the backend after connecting to the DB.

6) After deploy
- Visit the frontend URL Render provides and confirm the app connects to the backend.
- If CORS errors appear, ensure `CLIENT_URL` matches the frontend origin in the backend's CORS config.

Helpful commands (local)

Build and run the backend as production locally:
```bash
cd backend
npm ci
npm run build
PORT=5000 npm start
```

Build and preview the frontend locally:
```bash
cd frontend
npm ci
npm run build
npm run preview
```

If you want, I can also add a short `render-setup.sh` script to automate the Render API calls for creating services and secrets (requires a Render API key). Ask if you want that.