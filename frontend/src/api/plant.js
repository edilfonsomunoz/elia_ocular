import api from './axios';

export const getPlantOverview = () => api.get('/plant/overview').then(r => r.data);
export const getPlantClasses = () => api.get('/plant/classes').then(r => r.data);
export const getPlantDistribution = () => api.get('/plant/distribution').then(r => r.data);
export const getPlantTraining = () => api.get('/plant/training').then(r => r.data);
export const getPlantEvaluation = () => api.get('/plant/evaluation').then(r => r.data);
export const getPlantConfusionMatrix = () => api.get('/plant/confusion-matrix').then(r => r.data);
export const getPlantClassificationReport = () => api.get('/plant/classification-report').then(r => r.data);
export const getPlantPredictions = () => api.get('/plant/predictions').then(r => r.data);

export const uploadDataset = (formData) => api.post('/plant/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
}).then(r => r.data);

export const listDatasets = () => api.get('/plant/datasets').then(r => r.data);
export const deleteDataset = (id) => api.delete(`/plant/datasets/${id}`).then(r => r.data);
