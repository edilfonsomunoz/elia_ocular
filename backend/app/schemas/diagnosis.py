from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


class DiagnosisBase(BaseModel):
    image_id: int
    patient_id: int
    doctor_id: Optional[int] = None
    disease: str
    probability: float = Field(..., ge=0.0, le=1.0)
    level: str
    confidence: str
    recommendations: Optional[str] = None
    notes: Optional[str] = None


class DiagnosisCreate(DiagnosisBase):
    pass


class DiagnosisUpdate(BaseModel):
    doctor_id: Optional[int] = None
    recommendations: Optional[str] = None
    notes: Optional[str] = None


class DiagnosisResponse(DiagnosisBase):
    id: int
    diagnosed_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class DiagnosisWithDetails(DiagnosisResponse):
    patient_name: str
    patient_document: str
    image_filename: str
    image_type: str
    doctor_name: Optional[str] = None
    all_predictions: Optional[Dict[str, Any]] = None