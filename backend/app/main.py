from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.api.v1.api import api_router
from app.core.config import settings
from app.db.session import engine


_TABLES_COLUMNS = {
    "patients": {
        "doctor_id": "BIGINT NULL",
        "phone": "VARCHAR(20) NULL",
        "address": "TEXT NULL",
        "medical_history": "TEXT NULL",
    },
    "medical_images": {
        "file_size": "INTEGER NULL",
        "description": "TEXT NULL",
    },
}


def _column_exists(conn, table: str, column: str) -> bool:
    return bool(
        conn.execute(
            text(
                "SELECT COUNT(*) FROM information_schema.COLUMNS "
                "WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = :table AND COLUMN_NAME = :column"
            ),
            {"table": table, "column": column},
        ).scalar()
    )


def _table_exists(conn, table: str) -> bool:
    return bool(
        conn.execute(
            text(
                "SELECT COUNT(*) FROM information_schema.TABLES "
                "WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = :table"
            ),
            {"table": table},
        ).scalar()
    )


def _run_migrations() -> None:
    """Agrega columnas nuevas a tablas existentes de forma idempotente."""
    try:
        with engine.connect() as conn:
            for table, columns in _TABLES_COLUMNS.items():
                if not _table_exists(conn, table):
                    continue
                for column, definition in columns.items():
                    if not _column_exists(conn, table, column):
                        conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {column} {definition}"))
                        conn.commit()
                        print(f"[OK] Columna '{column}' agregada a la tabla {table}.")
                    else:
                        print(f"[INFO] Columna '{column}' ya existe en la tabla {table}.")
            # doctor_id como FK (solo si la tabla/columna existen y no hay FK)
            if _column_exists(conn, "patients", "doctor_id"):
                fk_check = conn.execute(
                    text(
                        "SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS "
                        "WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'patients' "
                        "AND CONSTRAINT_TYPE = 'FOREIGN KEY' AND CONSTRAINT_NAME = 'fk_patients_doctor_id'"
                    )
                ).scalar()
                if not fk_check and _table_exists(conn, "doctors"):
                    conn.execute(text("ALTER TABLE patients ADD CONSTRAINT fk_patients_doctor_id FOREIGN KEY (doctor_id) REFERENCES doctors(id)"))
                    conn.commit()
    except Exception as e:
        print(f"[ERROR] No se pudo completar la migración de columnas: {e}")


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
