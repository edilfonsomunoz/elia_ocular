from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class PatientBase(BaseModel):
    doctor_id: Optional[int] = None
    document_number: str = Field(..., min_length=5, max_length=20)
    date_of_birth: date
    gender: str
    phone: Optional[str] = Field(None, max_length=20)
    address: Optional[str] = None
    medical_history: Optional[str] = None


class PatientCreate(PatientBase):
    user_id: int


class PatientUpdate(BaseModel):
    doctor_id: Optional[int] = None
    document_number: Optional[str] = Field(None, min_length=5, max_length=20)
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    phone: Optional[str] = Field(None, max_length=20)
    address: Optional[str] = None
    medical_history: Optional[str] = None


class PatientResponse(PatientBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class PatientWithUser(PatientResponse):
    full_name: str
    email: str
    doctor_name: Optional[str] = None