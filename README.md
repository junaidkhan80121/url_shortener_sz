# Sub-Zero URL Shortener

Sub-Zero is a React + MUI frontend with a Flask backend for generating and resolving short URLs.

## Environment Setup

Frontend:

1. Copy `.env.example` to `.env`.
2. Set `REACT_APP_API_BASE_URL` to your backend base URL.

Backend:

1. Copy `backend/.env.example` to `backend/.env`.
2. Set `APP_BASE_URL` to the public base URL used in generated short links.
3. Set `SECRET_KEY`.
4. Set either `MONGO_URI` or the split Mongo values.
5. Set `CORS_ALLOWED_ORIGINS` to the frontend origin.

## Frontend Config

Frontend env values are mapped in [env.js](/home/khan/Desktop/github_plots/url_shortener_sz/src/config/env.js).

- `REACT_APP_APP_NAME`
- `REACT_APP_API_BASE_URL`

## Backend Config

Backend env values are mapped in [config.py](/home/khan/Desktop/github_plots/url_shortener_sz/backend/config.py).

- `APP_BASE_URL`
- `SECRET_KEY`
- `MONGO_URI`
- `MONGO_USERNAME`
- `MONGO_PASSWORD`
- `MONGO_CLUSTER`
- `MONGO_OPTIONS`
- `MONGO_DATABASE_NAME`
- `MONGO_COLLECTION_NAME`
- `CORS_ALLOWED_ORIGINS`
- `DEFAULT_RATE_LIMITS`
- `SHORTEN_RATE_LIMIT`

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
