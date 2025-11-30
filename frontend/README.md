# Employee Attendance Frontend

This is a minimal React + TypeScript frontend scaffold for the Employee Attendance System.

Tech stack
- React 18 + TypeScript
- Vite
- Redux Toolkit
- Axios

Setup

1. From the `frontend/` directory, install dependencies:

```bash
cd frontend
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. The app defaults to `http://localhost:5173`.

Environment
- To point the frontend at your backend, set `VITE_API_URL` in an `.env` file in `frontend/`:

```
VITE_API_URL=http://localhost:4000/api
```

What is included
- Login / Register pages
- Employee dashboard with quick links
- Check In / Check Out page (calls `POST /api/attendance/checkin` and `POST /api/attendance/checkout`)
- My History and My Summary pages (call `GET /api/attendance/my-history` and `GET /api/attendance/my-summary`)
- Manager pages: Manager Dashboard and All Attendance (calls `GET /api/attendance/all`)
- Simple Redux Toolkit `auth` slice for login/register

Notes



