from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User, UserRole
from app.models.doctor import Doctor
from app.models.diagnosis import Diagnosis
from app.models.clinical_history import ClinicalHistory
from app.models.report import Report
from app.schemas.doctor import DoctorCreate, DoctorUpdate, DoctorResponse, DoctorWithUser

router = APIRouter()


@router.post("/", response_model=DoctorResponse, status_code=status.HTTP_201_CREATED)
def create_doctor(
    *,
    db: Session = Depends(deps.get_db),
    doctor_in: DoctorCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Crear un nuevo doctor. Solo administradores pueden crear doctores.
    """
    if current_user.role != UserRole.ADMINISTRADOR.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tiene permisos para crear doctores."
        )
    
    existing_doctor = db.query(Doctor).filter(Doctor.user_id == doctor_in.user_id).first()
    if existing_doctor:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este usuario ya tiene un perfil de doctor."
        )
    
    existing_license = db.query(Doctor).filter(Doctor.license_number == doctor_in.license_number).first()
    if existing_license:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El numero de licencia ya esta registrado."
        )
    
    db_doctor = Doctor(**doctor_in.model_dump())
    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)
    return db_doctor


@router.get("/public", response_model=List[DoctorWithUser])
def list_public_doctors(
    *,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Listar doctores disponibles sin autenticacion (para registro publico).
    """
    doctors = db.query(Doctor).all()
    result = []
    for doctor in doctors:
        user = db.query(User).filter(User.id == doctor.user_id).first()
        result.append(DoctorWithUser(
            id=doctor.id,
            user_id=doctor.user_id,
            license_number=doctor.license_number,
            specialty=doctor.specialty,
            hospital=doctor.hospital,
            years_experience=doctor.years_experience,
            bio=doctor.bio,
            created_at=doctor.created_at,
            updated_at=doctor.updated_at,
            full_name=user.full_name if user else "",
            email=user.email if user else ""
        ))
    return result


@router.get("/", response_model=List[DoctorWithUser])
def list_doctors(
    *,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Listar todos los doctores.
    """
    doctors = db.query(Doctor).offset(skip).limit(limit).all()
    result = []
    for doctor in doctors:
        user = db.query(User).filter(User.id == doctor.user_id).first()
        result.append(DoctorWithUser(
            id=doctor.id,
            user_id=doctor.user_id,
            license_number=doctor.license_number,
            specialty=doctor.specialty,
            hospital=doctor.hospital,
            years_experience=doctor.years_experience,
            bio=doctor.bio,
            created_at=doctor.created_at,
            updated_at=doctor.updated_at,
            full_name=user.full_name if user else "",
            email=user.email if user else ""
        ))
    return result


@router.get("/{doctor_id}", response_model=DoctorWithUser)
def get_doctor(
    *,
    db: Session = Depends(deps.get_db),
    doctor_id: int,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Obtener un doctor por ID.
    """
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor no encontrado."
        )
    
    user = db.query(User).filter(User.id == doctor.user_id).first()
    return DoctorWithUser(
        id=doctor.id,
        user_id=doctor.user_id,
        license_number=doctor.license_number,
        specialty=doctor.specialty,
        hospital=doctor.hospital,
        years_experience=doctor.years_experience,
        bio=doctor.bio,
        created_at=doctor.created_at,
        updated_at=doctor.updated_at,
        full_name=user.full_name if user else "",
        email=user.email if user else ""
    )


@router.put("/{doctor_id}", response_model=DoctorResponse)
def update_doctor(
    *,
    db: Session = Depends(deps.get_db),
    doctor_id: int,
    doctor_in: DoctorUpdate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Actualizar un doctor. Solo administradores pueden actualizar doctores.
    """
    if current_user.role != UserRole.ADMINISTRADOR.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tiene permisos para actualizar doctores."
        )
    
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor no encontrado."
        )
    
    update_data = doctor_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(doctor, field, value)
    
    db.commit()
    db.refresh(doctor)
    return doctor


@router.delete("/{doctor_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_doctor(
    *,
    db: Session = Depends(deps.get_db),
    doctor_id: int,
    current_user: User = Depends(deps.get_current_user),
) -> None:
    """
    Eliminar un doctor. Solo administradores pueden eliminar doctores.
    """
    if current_user.role != UserRole.ADMINISTRADOR.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tiene permisos para eliminar doctores."
        )

    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor no encontrado."
        )

    db.query(Diagnosis).filter(Diagnosis.doctor_id == doctor_id).update({Diagnosis.doctor_id: None})
    db.query(ClinicalHistory).filter(ClinicalHistory.doctor_id == doctor_id).update({ClinicalHistory.doctor_id: None})
    reports = db.query(Report).filter(Report.doctor_id == doctor_id).all()
    for report in reports:
        db.delete(report)

    db.delete(doctor)
    db.commit()