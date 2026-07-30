from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User, UserRole
from app.models.patient import Patient
from app.schemas.patient import PatientCreate, PatientUpdate, PatientResponse, PatientWithUser

router = APIRouter()


@router.post("/", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
def create_patient(
    *,
    db: Session = Depends(deps.get_db),
    patient_in: PatientCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Crear un nuevo paciente. Solo administradores y medicos pueden crear pacientes.
    """
    if current_user.role not in [UserRole.ADMINISTRADOR.value, UserRole.MEDICO.value]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tiene permisos para crear pacientes."
        )
    
    existing_patient = db.query(Patient).filter(Patient.user_id == patient_in.user_id).first()
    if existing_patient:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este usuario ya tiene un perfil de paciente."
        )
    
    existing_document = db.query(Patient).filter(Patient.document_number == patient_in.document_number).first()
    if existing_document:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El numero de documento ya esta registrado."
        )
    
    db_patient = Patient(**patient_in.model_dump())
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient


@router.get("/", response_model=List[PatientWithUser])
def list_patients(
    *,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Listar todos los pacientes. Solo administradores y medicos pueden listar pacientes.
    """
    if current_user.role not in [UserRole.ADMINISTRADOR.value, UserRole.MEDICO.value]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tiene permisos para listar pacientes."
        )
    
    patients = db.query(Patient).offset(skip).limit(limit).all()
    result = []
    for patient in patients:
        user = db.query(User).filter(User.id == patient.user_id).first()
        result.append(PatientWithUser(
            id=patient.id,
            user_id=patient.user_id,
            document_number=patient.document_number,
            date_of_birth=patient.date_of_birth,
            gender=patient.gender,
            phone=patient.phone,
            address=patient.address,
            medical_history=patient.medical_history,
            created_at=patient.created_at,
            updated_at=patient.updated_at,
            full_name=user.full_name if user else "",
            email=user.email if user else ""
        ))
    return result


@router.get("/{patient_id}", response_model=PatientWithUser)
def get_patient(
    *,
    db: Session = Depends(deps.get_db),
    patient_id: int,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Obtener un paciente por ID.
    """
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paciente no encontrado."
        )
    
    if current_user.role == UserRole.PACIENTE.value and patient.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tiene permisos para ver este paciente."
        )
    
    user = db.query(User).filter(User.id == patient.user_id).first()
    return PatientWithUser(
        id=patient.id,
        user_id=patient.user_id,
        document_number=patient.document_number,
        date_of_birth=patient.date_of_birth,
        gender=patient.gender,
        phone=patient.phone,
        address=patient.address,
        medical_history=patient.medical_history,
        created_at=patient.created_at,
        updated_at=patient.updated_at,
        full_name=user.full_name if user else "",
        email=user.email if user else ""
    )


@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(
    *,
    db: Session = Depends(deps.get_db),
    patient_id: int,
    patient_in: PatientUpdate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Actualizar un paciente.
    """
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paciente no encontrado."
        )
    
    if current_user.role == UserRole.PACIENTE.value and patient.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tiene permisos para actualizar este paciente."
        )
    
    update_data = patient_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(patient, field, value)
    
    db.commit()
    db.refresh(patient)
    return patient


@router.get("/user/{user_id}", response_model=PatientResponse)
def get_patient_by_user_id(
    *,
    db: Session = Depends(deps.get_db),
    user_id: int,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Obtener un paciente por user_id.
    """
    patient = db.query(Patient).filter(Patient.user_id == user_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paciente no encontrado para este usuario."
        )
    
    if current_user.role == UserRole.PACIENTE.value and patient.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tiene permisos para ver este paciente."
        )
    
    return patient