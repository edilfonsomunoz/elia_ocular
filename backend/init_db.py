import sys
from datetime import date
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


def _add_missing_columns(db_engine):
    """Agrega columnas nuevas a tablas existentes de forma idempotente."""
    try:
        with db_engine.connect() as conn:
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

    _add_missing_columns(db_engine=engine)

    db = SessionLocal()
    try:
        admin_email = "admin@example.com"
        existing = db.query(User).filter(User.email == admin_email).first()
        if not existing:
            user = User(
                email=admin_email,
                full_name="Administrador de Prueba",
                hashed_password=security.get_password_hash("123456"),
                role=UserRole.ADMINISTRADOR.value,
                is_active=True,
                is_superuser=True
            )
            db.add(user)
            db.commit()
            print(f"[OK] Usuario de prueba creado: {admin_email} / 123456")
        else:
            print(f"[INFO] Usuario de prueba {admin_email} ya existe.")

        _seed_pacientes(db)
        _seed_doctor(db)
    finally:
        db.close()


def _seed_pacientes(db):
    """Crea usuarios y perfiles de paciente de prueba si no existen."""
    pacientes = [
        {
            "email": "paciente1@example.com",
            "full_name": "Juan Pérez",
            "document_number": "12345678",
            "date_of_birth": date(1985, 5, 20),
            "gender": "M",
            "phone": "555-1000",
        },
        {
            "email": "paciente2@example.com",
            "full_name": "María López",
            "document_number": "87654321",
            "date_of_birth": date(1992, 11, 3),
            "gender": "F",
            "phone": "555-2000",
        },
    ]
    for data in pacientes:
        user = db.query(User).filter(User.email == data["email"]).first()
        if not user:
            user = User(
                email=data["email"],
                full_name=data["full_name"],
                hashed_password=security.get_password_hash("123456"),
                role=UserRole.PACIENTE.value,
                is_active=True,
                is_superuser=False,
            )
            db.add(user)
            db.flush()
            print(f"[OK] Usuario paciente creado: {data['email']} / 123456")
        if not db.query(Patient).filter(Patient.user_id == user.id).first():
            patient = Patient(
                user_id=user.id,
                document_number=data["document_number"],
                date_of_birth=data["date_of_birth"],
                gender=data["gender"],
                phone=data["phone"],
            )
            db.add(patient)
            db.flush()
            print(f"[OK] Perfil de paciente creado: {data['full_name']} ({data['document_number']})")
    db.commit()


def _seed_doctor(db):
    """Crea un usuario y perfil de doctor de prueba si no existen."""
    doctor_email = "medico@example.com"
    user = db.query(User).filter(User.email == doctor_email).first()
    if not user:
        user = User(
            email=doctor_email,
            full_name="Dr. Carlos Ruiz",
            hashed_password=security.get_password_hash("123456"),
            role=UserRole.MEDICO.value,
            is_active=True,
            is_superuser=False,
        )
        db.add(user)
        db.flush()
        print(f"[OK] Usuario medico creado: {doctor_email} / 123456")
    if not db.query(Doctor).filter(Doctor.user_id == user.id).first():
        doctor = Doctor(
            user_id=user.id,
            license_number="LIC-001",
            specialty="Oftalmología",
            hospital="Clínica EliaOcular",
            years_experience=10,
        )
        db.add(doctor)
        db.flush()
        print(f"[OK] Perfil de doctor creado: Dr. Carlos Ruiz (LIC-001)")
    db.commit()



if __name__ == "__main__":
    init_db()
