import axiosInstance from './axios';

export const uploadMedicalImage = async (formData) => {
  const response = await axiosInstance.post('/medical/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000,
  });
  return response.data;
};

export const listMedicalImages = async (patientId = null) => {
  const params = patientId ? { patient_id: patientId } : {};
  const response = await axiosInstance.get('/medical/images', { params });
  return response.data;
};

export const diagnoseImage = async (imageId) => {
  const response = await axiosInstance.post(`/medical/diagnose/${imageId}`);
  return response.data;
};

export const getDiagnosis = async (diagnosisId) => {
  const response = await axiosInstance.get(`/medical/diagnosis/${diagnosisId}`);
  return response.data;
};

export const getPatientHistory = async (patientId) => {
  const response = await axiosInstance.get(`/medical/history/${patientId}`);
  return response.data;
};

export const getMyHistory = async () => {
  const response = await axiosInstance.get('/medical/my-history');
  return response.data;
};

export const getMedicalStats = async () => {
  const response = await axiosInstance.get('/medical/stats');
  return response.data;
};

export const listResults = async (patientId = null) => {
  const params = patientId ? { patient_id: patientId } : {};
  const response = await axiosInstance.get('/medical/results', { params });
  return response.data;
};

export const createPatient = async (patientData) => {
  const response = await axiosInstance.post('/patients/', patientData);
  return response.data;
};

export const listPatients = async () => {
  const response = await axiosInstance.get('/patients/');
  return response.data;
};

export const getPatient = async (patientId) => {
  const response = await axiosInstance.get(`/patients/${patientId}`);
  return response.data;
};

export const updatePatient = async (patientId, patientData) => {
  const response = await axiosInstance.put(`/patients/${patientId}`, patientData);
  return response.data;
};

export const getPatientByUserId = async (userId) => {
  const response = await axiosInstance.get(`/patients/user/${userId}`);
  return response.data;
};

export const deletePatient = async (patientId) => {
  const response = await axiosInstance.delete(`/patients/${patientId}`);
  return response.data;
};

export const createDoctor = async (doctorData) => {
  const response = await axiosInstance.post('/doctors/', doctorData);
  return response.data;
};

export const listDoctors = async () => {
  const response = await axiosInstance.get('/doctors/');
  return response.data;
};

export const listPublicDoctors = async () => {
  const response = await axiosInstance.get('/doctors/public');
  return response.data;
};

export const getDoctor = async (doctorId) => {
  const response = await axiosInstance.get(`/doctors/${doctorId}`);
  return response.data;
};

export const updateDoctor = async (doctorId, doctorData) => {
  const response = await axiosInstance.put(`/doctors/${doctorId}`, doctorData);
  return response.data;
};

export const deleteDoctor = async (doctorId) => {
  const response = await axiosInstance.delete(`/doctors/${doctorId}`);
  return response.data;
};