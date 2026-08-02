import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listPatients, getPatientHistory, deletePatient } from '../../api/medical';
import { useAuth } from '../../context/AuthContext';
import { Users, Plus, History, Search, Trash2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const PatientList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'administrador';
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const data = await listPatients();
      setPatients(data);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    setMessage({ type: '', text: '' });
    try {
      await deletePatient(confirmDelete.id);
      await loadPatients();
      setConfirmDelete(null);
      setMessage({ type: 'success', text: 'Paciente eliminado correctamente' });
    } catch (error) {
      setConfirmDelete(null);
      setMessage({ type: 'error', text: error.response?.data?.detail || 'Error al eliminar el paciente' });
    } finally {
      setDeleting(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.document_number.includes(searchTerm)
  );

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
          <h1 className="text-2xl font-bold text-white">Pacientes</h1>
          <p className="text-slate-400">{patients.length} pacientes registrados</p>
        </div>
        <button
          onClick={() => navigate('/medical/patients/new')}
          className="btn-primary px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Paciente</span>
        </button>
      </div>

      {message.text && (
        <div className={`p-3.5 rounded-xl text-xs flex items-center gap-3 ${
          message.type === 'error' ? 'bg-red-500/[0.08] border border-red-500/20 text-red-300' :
          'bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-300'
        }`}>
          {message.type === 'error' ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle className="w-4 h-4 flex-shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="glass-card p-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por nombre o documento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full glass-input pl-10 pr-4 py-3 rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="glass-card p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{patient.full_name}</h3>
                <p className="text-sm text-slate-400">{patient.document_number}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                patient.gender === 'M' ? 'bg-blue-500/20 text-blue-400' : 'bg-pink-500/20 text-pink-400'
              }`}>
                {patient.gender}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Fecha de Nacimiento</span>
                <span className="text-white">{patient.date_of_birth}</span>
              </div>
              {patient.phone && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Teléfono</span>
                  <span className="text-white">{patient.phone}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Registro</span>
                <span className="text-white">
                  {new Date(patient.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Doctor</span>
                <span className="text-cyan-400">{patient.doctor_name || 'Sin asignar'}</span>
              </div>
            </div>

            {isAdmin ? (
              <div className="flex space-x-2">
                <button
                  onClick={() => setConfirmDelete(patient)}
                  title="Eliminar"
                  className="flex-1 flex items-center justify-center space-x-2 p-2 bg-red-500/15 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm">Eliminar</span>
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/medical/history/${patient.id}`)}
                  className="flex-1 flex items-center justify-center space-x-2 p-2 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors"
                >
                  <History className="w-4 h-4" />
                  <span className="text-sm">Historial</span>
                </button>
                <button
                  onClick={() => navigate('/medical/upload')}
                  className="flex-1 flex items-center justify-center space-x-2 p-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Diagnóstico</span>
                </button>
                <button
                  onClick={() => setConfirmDelete(patient)}
                  title="Eliminar"
                  className="p-2 bg-red-500/15 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="glass-card p-6 text-center">
          <Users className="w-16 h-16 mx-auto text-slate-500 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">
            {searchTerm ? 'No se encontraron pacientes' : 'No hay pacientes'}
          </h2>
          <p className="text-slate-400">
            {searchTerm ? 'Intente con otros términos de búsqueda' : 'Registre su primer paciente para comenzar'}
          </p>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm glass-card rounded-xl border border-white/[0.08] p-6 space-y-4 animate-scaleIn text-center">
            <div className="w-14 h-14 mx-auto rounded-xl bg-red-500/15 flex items-center justify-center">
              <Trash2 className="w-7 h-7 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Eliminar Paciente</h2>
              <p className="text-sm text-slate-400 mt-1">¿Estás seguro de eliminar a <strong className="text-white">{confirmDelete.full_name}</strong>? Se eliminará su historial y resultados. Esta acción no se puede deshacer.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleDelete} disabled={deleting} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>Eliminar</span>
              </button>
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-slate-400 text-sm font-semibold transition-colors">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;