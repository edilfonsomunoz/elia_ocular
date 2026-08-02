from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.api.v1.api import api_router
from app.core.config import settings
from app.db.session import engine


def _run_migrations() -> None:
    """Agrega columnas nuevas a tablas existentes de forma idempotente."""
    try:
        with engine.connect() as conn:
            check = conn.execute(
                text("SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'patients' AND COLUMN_NAME = 'doctor_id'")
            ).scalar()
            if not check:
                conn.execute(text("ALTER TABLE patients ADD COLUMN doctor_id BIGINT NULL, ADD CONSTRAINT fk_patients_doctor_id FOREIGN KEY (doctor_id) REFERENCES doctors(id)"))
                conn.commit()
                print("[OK] Columna 'doctor_id' agregada a la tabla patients.")
            else:
                print("[INFO] Columna 'doctor_id' ya existe en la tabla patients.")
    except Exception as e:
        print(f"[ERROR] No se pudo agregar la columna doctor_id: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    _run_migrations()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Configurar CORS
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/", tags=["Health"])
def root():
    return {
        "status": "online",
        "message": f"Bienvenido a la API de {settings.PROJECT_NAME}",
        "docs": "/docs"
    }
