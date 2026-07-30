import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMedicalStats, listPatients, listDoctors } from '../../api/medical';
import { Activity, Users, Stethoscope, Image, AlertTriangle, CheckCircle } from 'lucide-react';

const MedicalDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, patientsData, doctorsData] = await Promise.all([
        getMedicalStats(),
        listPatients(),
        listDoctors()
      ]);
      setStats(statsData);
      setPatients(patientsData);
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Panel Médico</h1>
          <p className="text-slate-400">Bienvenido, {user?.full_name}</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-400">
          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full">
            {user?.role === 'administrador' ? 'Administrador' : user?.role === 'medico' ? 'Médico' : 'Paciente'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-cyan-500/20 rounded-lg">
              <Users className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Pacientes</p>
              <p className="text-2xl font-bold text-white">{stats?.total_patients || 0}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-500/20 rounded-lg">
              <Stethoscope className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Médicos</p>
              <p className="text-2xl font-bold text-white">{stats?.total_doctors || 0}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/20 rounded-lg">
              <Image className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Imágenes</p>
              <p className="text-2xl font-bold text-white">{stats?.total_images || 0}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500/20 rounded-lg">
              <Activity className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Diagnósticos</p>
              <p className="text-2xl font-bold text-white">{stats?.total_diagnoses || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Pacientes Recientes</h3>
          <div className="space-y-3">
            {patients.slice(0, 5).map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div>
                  <p className="font-medium text-white">{patient.full_name}</p>
                  <p className="text-sm text-slate-400">{patient.document_number}</p>
                </div>
                <span className="text-xs text-slate-500">
                  {new Date(patient.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
            {patients.length === 0 && (
              <p className="text-slate-500 text-center py-4">No hay pacientes registrados</p>
            )}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Médicos</h3>
          <div className="space-y-3">
            {doctors.slice(0, 5).map((doctor) => (
              <div key={doctor.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div>
                  <p className="font-medium text-white">{doctor.full_name}</p>
                  <p className="text-sm text-slate-400">{doctor.specialty}</p>
                </div>
                <span className="text-xs text-slate-500">
                  {doctor.years_experience ? `${doctor.years_experience} años` : 'N/A'}
                </span>
              </div>
            ))}
            {doctors.length === 0 && (
              <p className="text-slate-500 text-center py-4">No hay médicos registrados</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalDashboard;