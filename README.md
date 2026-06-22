# FastAPI Auth Backend

A minimal authentication backend using FastAPI, JWT, SQLite (SQLAlchemy), and Passlib for hashing.

## Features
- Signup: `POST /auth/signup`
- Login: `POST /auth/login`
- Me (protected): `GET /auth/me` with `Authorization: Bearer <token>`
- Health check: `GET /health`

## Setup

1. Create and activate a virtual environment (Windows PowerShell):
```
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Install dependencies:
```
pip install -r requirements.txt
```

3. Create a `.env` file based on `.env.example`:
```
copy .env.example .env
```
Edit `.env` to set a strong `SECRET_KEY`.

4. Run the dev server:
```
uvicorn app.main:app --reload
```

The API will be available at http://127.0.0.1:8000

## Example Requests

- Signup
```
curl -X POST http://127.0.0.1:8000/auth/signup -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"secret123"}'
```

- Login
```
curl -X POST http://127.0.0.1:8000/auth/login -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"secret123"}'
```

- Me
```
curl http://127.0.0.1:8000/auth/me -H "Authorization: Bearer <TOKEN>"
```

## Notes
- Database file `auth.db` will be created in the project root (configurable via `DATABASE_URL`).
- Default CORS allows all origins for easier local development; tighten this for production.
- Token expiry defaults to 60 minutes; adjust via `ACCESS_TOKEN_EXPIRE_MINUTES`.
