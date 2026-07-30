from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class MedicalImageBase(BaseModel):
    patient_id: int
    image_type: str
    description: Optional[str] = None


class MedicalImageCreate(MedicalImageBase):
    pass


class MedicalImageResponse(MedicalImageBase):
    id: int
    uploaded_by: int
    filename: str
    original_filename: str
    file_size: Optional[int] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MedicalImageWithPatient(MedicalImageResponse):
    patient_name: str
    patient_document: str