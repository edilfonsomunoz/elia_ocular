from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, Float, DateTime, Text, ForeignKey, JSON, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class PlantDisease(Base):
    __tablename__ = "plant_diseases"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(150), unique=True, nullable=False)
    plant: Mapped[str] = mapped_column(String(50), nullable=False)
    disease: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class AnalysisSession(Base):
    __tablename__ = "analysis_sessions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    session_name: Mapped[str] = mapped_column(String(200), nullable=False)
    total_images: Mapped[int] = mapped_column(Integer, default=0)
    num_classes: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(20), default="completed")
    train_split: Mapped[int] = mapped_column(Integer, default=80)
    val_split: Mapped[int] = mapped_column(Integer, default=10)
    test_split: Mapped[int] = mapped_column(Integer, default=10)
    image_size: Mapped[str] = mapped_column(String(10), default="224x224")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    
    metrics: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    training_history: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    confusion_matrix: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    classification_report: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    predictions: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)


class UploadedDataset(Base):
    __tablename__ = "uploaded_datasets"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    total_rows: Mapped[int] = mapped_column(Integer, default=0)
    columns: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    preview_data: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="uploaded")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
