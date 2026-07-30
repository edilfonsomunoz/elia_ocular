from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, DateTime, Text, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
import enum


class ImageType(str, enum.Enum):
    RETINA = "retina"
    FONDO_DE_OJO = "fondo_de_ojo"
    OCT = "oct"
    IRIS = "iris"
    CONJUNTIVA = "conjuntiva"


class MedicalImage(Base):
    __tablename__ = "medical_images"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False)
    uploaded_by: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    original_filename: Mapped[str] = mapped_column(String(255), nullable=False)
    image_type: Mapped[str] = mapped_column(String(50), nullable=False)
    file_size: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    patient = relationship("Patient", backref="medical_images")
    uploader = relationship("User", backref="uploaded_images")
    diagnosis = relationship("Diagnosis", back_populates="image", uselist=False)