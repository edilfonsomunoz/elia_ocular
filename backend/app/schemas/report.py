from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class ReportBase(BaseModel):
    diagnosis_id: int
    patient_id: int
    doctor_id: int
    notes: Optional[str] = None


class ReportCreate(ReportBase):
    pass


class ReportResponse(ReportBase):
    id: int
    filename: str
    file_path: str
    report_number: str
    generated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReportWithDetails(ReportResponse):
    patient_name: str
    patient_document: str
    doctor_name: str
    disease: str
    probability: float
    level: str