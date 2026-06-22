from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .auth import router as auth_router
from .database import Base, engine


def create_app() -> FastAPI:
    app = FastAPI(title="Auth Backend", version="1.0.0")

    # CORS - allow localhost by default
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Create tables on startup
    Base.metadata.create_all(bind=engine)

    # Routers (API only; React will handle UI)
    app.include_router(auth_router)

    @app.get("/health")
    def health():
        return {"status": "ok"}

    @app.get("/")
    def root_status():
        return {
            "service": "auth-backend",
            "status": "ok",
            "message": "React app should call /auth/* endpoints",
        }

    return app


app = create_app()
