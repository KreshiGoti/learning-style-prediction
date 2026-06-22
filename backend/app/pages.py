from fastapi import APIRouter, Depends, Form, status, Request
from fastapi.responses import RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from pydantic import EmailStr
from jose import jwt, JWTError
from pathlib import Path

from .deps import get_db
from .models import User
from .auth import get_password_hash, verify_password, create_access_token
from .config import get_settings

router = APIRouter(include_in_schema=False)

# Resolve templates directory relative to project root so it works regardless of CWD
PROJECT_ROOT = Path(__file__).resolve().parents[2]
TEMPLATES_DIR = PROJECT_ROOT / "frontend" / "templates"
templates = Jinja2Templates(directory=str(TEMPLATES_DIR))
settings = get_settings()


def _get_user_from_cookie(request: Request, db: Session) -> User | None:
    token = request.cookies.get("access_token")
    if not token:
        return None
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        sub = payload.get("sub")
        if sub is None:
            return None
        user = db.query(User).filter(User.id == int(sub)).first()
        return user
    except (JWTError, ValueError):
        return None


@router.get("/signup")
def signup_page(request: Request):
    return templates.TemplateResponse("signup.html", {"request": request})


@router.post("/signup")
def signup_submit(
    request: Request,
    name: str = Form(...),
    email: EmailStr = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db),
):
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        # Re-render with error
        return templates.TemplateResponse(
            "signup.html",
            {"request": request, "error": "Email already registered.", "name": name, "email": email},
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    user = User(name=name, email=email, hashed_password=get_password_hash(password))
    db.add(user)
    db.commit()

    # Redirect to login page after successful signup
    return RedirectResponse(url="/login", status_code=status.HTTP_303_SEE_OTHER)


@router.get("/login")
async def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})


@router.post("/login")
async def login_submit(
    request: Request,
    email: EmailStr = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        return templates.TemplateResponse(
            "login.html",
            {"request": request, "error": "Invalid email or password.", "email": email},
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    # Create token and set as HttpOnly cookie, then redirect to quiz
    token = create_access_token({"sub": str(user.id), "email": user.email})
    response = RedirectResponse(url="/quiz", status_code=status.HTTP_303_SEE_OTHER)
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,  # set True when using HTTPS
        max_age=60 * 60,  # 1 hour
    )
    return response


@router.get("/quiz")
def quiz_page(request: Request, db: Session = Depends(get_db)):
    user = _get_user_from_cookie(request, db)
    if not user:
        return RedirectResponse(url="/login", status_code=status.HTTP_303_SEE_OTHER)
    return templates.TemplateResponse("quiz.html", {"request": request, "user": user})


@router.get("/logout")
def logout():
    response = RedirectResponse(url="/login", status_code=status.HTTP_303_SEE_OTHER)
    response.delete_cookie("access_token")
    return response
