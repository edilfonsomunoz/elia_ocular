from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class DoctorBase(BaseModel):
    license_number: str = Field(..., min_length=5, max_length=20)
    specialty: str = Field(..., min_length=2, max_length=100)
    hospital: Optional[str] = Field(None, max_length=200)
    years_experience: Optional[int] = Field(None, ge=0, le=100)
    bio: Optional[str] = None


class DoctorCreate(DoctorBase):
    user_id: int


class DoctorUpdate(BaseModel):
    license_number: Optional[str] = Field(None, min_length=5, max_length=20)
    specialty: Optional[str] = Field(None, min_length=2, max_length=100)
    hospital: Optional[str] = Field(None, max_length=200)
    years_experience: Optional[int] = Field(None, ge=0, le=100)
    bio: Optional[str] = None


class DoctorResponse(DoctorBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class DoctorWithUser(DoctorResponse):
    full_name: str
    email: str