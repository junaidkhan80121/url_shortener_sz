# Sub-Zero URL Shortener

Sub-Zero is a React + MUI frontend with a Flask backend for generating and resolving short URLs.
The current Render setup does not require MongoDB.
In "no DB" mode, short links are stored in-memory, so they will reset on redeploy/restart.

## Environment Setup

Frontend:

1. Copy `.env.example` to `.env`.
2. Set `REACT_APP_API_BASE_URL` to your backend base URL.

Backend:

1. Copy `backend/.env.example` to `backend/.env`.
2. Set `APP_BASE_URL` to the public base URL used in generated short links.
3. Set `SECRET_KEY`.
4. Set `CORS_ALLOWED_ORIGINS` to the frontend origin.

## Frontend Config

Frontend env values are mapped in [env.js](/home/khan/Desktop/github_plots/url_shortener_sz/src/config/env.js).

- `REACT_APP_APP_NAME`
- `REACT_APP_API_BASE_URL`

## Backend Config

Backend env values are mapped in [config.py](/home/khan/Desktop/github_plots/url_shortener_sz/backend/config.py).

- `APP_BASE_URL`
- `SECRET_KEY`
- `CORS_ALLOWED_ORIGINS`
- `DEFAULT_RATE_LIMITS`
- `SHORTEN_RATE_LIMIT`

## Render Values

Frontend:

```bash
REACT_APP_API_BASE_URL=https://urlsz.onrender.com
```

Backend:

```bash
APP_BASE_URL=https://urlsz.onrender.com
SECRET_KEY=replace-with-a-long-random-secret
CORS_ALLOWED_ORIGINS=https://url-sz.onrender.com
DEFAULT_RATE_LIMITS=200 per day,50 per hour
SHORTEN_RATE_LIMIT=10 per minute
SHORT_CODE_LENGTH=8
```

## Deploy On Render

Backend (Web Service):

- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `gunicorn --bind 0.0.0.0:$PORT app:app`
- Environment Variables: use the Backend values above

Frontend (Static Site):

- Root Directory: repo root
- Build Command: `npm install && npm run build`
- Publish Directory: `build`
- Environment Variables: `REACT_APP_API_BASE_URL=https://urlsz.onrender.com`

## Run Locally

Frontend:

```bash
npm install
npm start
```

Backend:

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Default local URLs:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## Build

```bash
npm run build
```
