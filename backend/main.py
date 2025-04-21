from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from routes import query
from itsdangerous import Signer
import uuid

app = FastAPI()

signer = Signer("super-secret-session-key")  # 🔐 use env var in prod

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # change for prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_session_id(request: Request, call_next):
    session_cookie = request.cookies.get("session_id")

    if session_cookie:
        try:
            session_id = signer.unsign(session_cookie).decode()
        except Exception:
            session_id = str(uuid.uuid4())
    else:
        session_id = str(uuid.uuid4())

    # Attach session_id to request state
    request.state.session_id = session_id

    response: Response = await call_next(request)

    if not session_cookie:
        # Set cookie with signed session ID
        signed_session = signer.sign(session_id).decode()
        response.set_cookie("session_id", signed_session, httponly=True, samesite="Lax")

    return response


app.include_router(query.router, prefix="/api")