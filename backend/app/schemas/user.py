from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict, Field


class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=100)
    role: str = Field(default="paciente", pattern="^(paciente|medico|administrador)$")


class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=100)
    document_number: Optional[str] = Field(None, min_length=5, max_length=20)
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    doctor_id: Optional[int] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: Optional[str] = Field(None, pattern="^(paciente|medico|administrador)$")
