from datetime import datetime
from typing import Optional
from sqlalchemy import String, DateTime, Text, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Doctor(Base):
    __tablename__ = "doctors"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True, nullable=False)
    license_number: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    specialty: Mapped[str] = mapped_column(String(100), nullable=False)
    hospital: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    years_experience: Mapped[Optional[int]] = mapped_column(nullable=True)
    bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    user = relationship("User", backref="doctor_profile")
    diagnoses = relationship("Diagnosis", back_populates="doctor")