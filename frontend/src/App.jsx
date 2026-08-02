import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PlantLayout from './pages/plant/PlantLayout';
import PlantOverview from './pages/plant/PlantOverview';
import PlantUpload from './pages/plant/PlantUpload';
import PlantDistribution from './pages/plant/PlantDistribution';
import PlantImages from './pages/plant/PlantImages';
import PlantTraining from './pages/plant/PlantTraining';
import PlantEvaluation from './pages/plant/PlantEvaluation';
import PlantConfusionMatrix from './pages/plant/PlantConfusionMatrix';
import PlantClassificationReport from './pages/plant/PlantClassificationReport';
import PlantPredictions from './pages/plant/PlantPredictions';
import MedicalUpload from './pages/medical/MedicalUpload';
import MedicalDiagnosis from './pages/medical/MedicalDiagnosis';
import MedicalHistory from './pages/medical/MedicalHistory';
import PatientList from './pages/medical/PatientList';
import PatientCreate from './pages/medical/PatientCreate';
import DoctorList from './pages/medical/DoctorList';
import DoctorCreate from './pages/medical/DoctorCreate';
import MedicalDashboard from './pages/medical/MedicalDashboard';
import MedicalResults from './pages/medical/MedicalResults';

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      {!hideNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analisis-ocular"
            element={
              <ProtectedRoute>
                <PlantLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PlantOverview />} />
            <Route path="subir-datos" element={<PlantUpload />} />
            <Route path="distribucion" element={<PlantDistribution />} />
            <Route path="imagenes" element={<PlantImages />} />
            <Route path="entrenamiento" element={<PlantTraining />} />
            <Route path="evaluacion" element={<PlantEvaluation />} />
            <Route path="matriz-confusion" element={<PlantConfusionMatrix />} />
            <Route path="reporte" element={<PlantClassificationReport />} />
            <Route path="predicciones" element={<PlantPredictions />} />
          </Route>
          <Route
            path="/medical"
            element={
              <ProtectedRoute>
                <PlantLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<MedicalDashboard />} />
            <Route path="upload" element={<MedicalUpload />} />
            <Route path="results" element={<MedicalResults />} />
            <Route path="diagnosis/:imageId" element={<MedicalDiagnosis />} />
            <Route path="history/:patientId" element={<MedicalHistory />} />
            <Route path="patients" element={<PatientList />} />
            <Route path="patients/new" element={<PatientCreate />} />
            <Route path="doctors" element={<DoctorList />} />
            <Route path="doctors/new" element={<DoctorCreate />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;