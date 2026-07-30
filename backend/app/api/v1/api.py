from fastapi import APIRouter
from app.api.v1.endpoints import auth, plant, patient, doctor, medical

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(plant.router, prefix="/plant", tags=["plant"])
api_router.include_router(patient.router, prefix="/patients", tags=["patients"])
api_router.include_router(doctor.router, prefix="/doctors", tags=["doctors"])
api_router.include_router(medical.router, prefix="/medical", tags=["medical"])
