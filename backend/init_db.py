import sys
import pymysql
from sqlalchemy import text
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.models.user import User, UserRole
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.models.medical_image import MedicalImage
from app.models.diagnosis import Diagnosis
from app.models.report import Report
from app.models.clinical_history import ClinicalHistory
from app.models.plant import PlantDisease, AnalysisSession, UploadedDataset
from app.core import security


def create_database_if_not_exists():
    """Crea la base de datos MySQL en el servidor si no existe aún."""
    print(f"Verificando base de datos MySQL '{settings.MYSQL_DB}' en {settings.MYSQL_HOST}:{settings.MYSQL_PORT}...")
    try:
        connection = pymysql.connect(
            host=settings.MYSQL_HOST,
            port=int(settings.MYSQL_PORT),
            user=settings.MYSQL_USER,
            password=settings.MYSQL_PASSWORD,
            charset='utf8mb4'
        )
        with connection.cursor() as cursor:
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{settings.MYSQL_DB}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
        connection.close()
        print(f"[OK] Base de datos '{settings.MYSQL_DB}' verificada/creada exitosamente.")
    except Exception as e:
        print(f"[ERROR] Error al intentar conectar o crear la base de datos MySQL: {e}")
        print("Asegurate de que tu servicio MySQL este corriendo y las credenciales en .env sean correctas.")


def init_db():
    """Crea todas las tablas e inserta un usuario inicial de prueba."""
    create_database_if_not_exists()
    
    print("Creando tablas en la base de datos...")
    Base.metadata.create_all(bind=engine)
    print("[OK] Tablas creadas correctamente.")

    db = SessionLocal()
    try:
        admin_email = "admin@example.com"
        existing = db.query(User).filter(User.email == admin_email).first()
        if not existing:
            user = User(
                email=admin_email,
                full_name="Administrador de Prueba",
                hashed_password=security.get_password_hash("admin123456"),
                role=UserRole.ADMINISTRADOR.value,
                is_active=True,
                is_superuser=True
            )
            db.add(user)
            db.commit()
            print(f"[OK] Usuario de prueba creado: {admin_email} / admin123456")
        else:
            print(f"[INFO] Usuario de prueba {admin_email} ya existe.")
    finally:
        db.close()



if __name__ == "__main__":
    init_db()
