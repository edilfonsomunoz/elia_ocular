from datetime import datetime
from typing import Optional
from sqlalchemy import String, Float, DateTime, Text, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
import enum


class DiseaseType(str, enum.Enum):
    CATARATA = "Catarata"
    GLAUCOMA = "Glaucoma"
    MIOPIA = "Miopía"
    NORMAL = "Normal"


class DiagnosisLevel(str, enum.Enum):
    BAJO = "Bajo"
    MODERADO = "Moderado"
    ALTO = "Alto"


class ConfidenceLevel(str, enum.Enum):
    BAJA = "Baja"
    MEDIA = "Media"
    ALTA = "Alta"


class Diagnosis(Base):
    __tablename__ = "diagnoses"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    image_id: Mapped[int] = mapped_column(ForeignKey("medical_images.id"), unique=True, nullable=False)
    patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False)
    doctor_id: Mapped[Optional[int]] = mapped_column(ForeignKey("doctors.id"), nullable=True)
    disease: Mapped[str] = mapped_column(String(50), nullable=False)
    probability: Mapped[float] = mapped_column(Float, nullable=False)
    level: Mapped[str] = mapped_column(String(20), nullable=False)
    confidence: Mapped[str] = mapped_column(String(20), nullable=False)
    recommendations: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    diagnosed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    image = relationship("MedicalImage", back_populates="diagnosis")
    patient = relationship("Patient", back_populates="diagnoses")
    doctor = relationship("Doctor", back_populates="diagnoses")