import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDiagnosis } from '../../api/medical';
import { Activity, AlertTriangle, CheckCircle, Info, ArrowLeft } from 'lucide-react';

const MedicalDiagnosis = () => {
  const { imageId } = useParams();
  const navigate = useNavigate();
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDiagnosis();
  }, [imageId]);

  const loadDiagnosis = async () => {
    try {
      const data = await getDiagnosis(imageId);
      setDiagnosis(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al cargar el diagnóstico');
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

  if (error) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>
        <div className="glass-card p-6 text-center">
          <AlertTriangle className="w-16 h-16 mx-auto text-amber-400 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Error</h2>
          <p className="text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!diagnosis) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>
        <div className="glass-card p-6 text-center">
          <Info className="w-16 h-16 mx-auto text-slate-500 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No encontrado</h2>
          <p className="text-slate-400">No se encontró el diagnóstico solicitado</p>
        </div>
      </div>
    );
  }

  const getLevelColor = (level) => {
    switch (level) {
      case 'Alto': return 'text-red-400 bg-red-500/20';
      case 'Moderado': return 'text-amber-400 bg-amber-500/20';
      case 'Bajo': return 'text-emerald-400 bg-emerald-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getConfidenceColor = (confidence) => {
    switch (confidence) {
      case 'Alta': return 'text-emerald-400';
      case 'Media': return 'text-amber-400';
      case 'Baja': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Volver</span>
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Resultado del Diagnóstico</h1>
          <p className="text-slate-400">ID: {diagnosis.id}</p>
        </div>
        <div className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${getLevelColor(diagnosis.level)}`}>
          {diagnosis.level === 'Alto' ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
          <span className="font-semibold">Nivel: {diagnosis.level}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Diagnóstico</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-400">Enfermedad</span>
              <span className="font-semibold text-white">{diagnosis.disease}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-400">Probabilidad</span>
              <span className="font-semibold text-cyan-400">
                {(diagnosis.probability * 100).toFixed(1)}%
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-400">Confianza</span>
              <span className={`font-semibold ${getConfidenceColor(diagnosis.confidence)}`}>
                {diagnosis.confidence}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-400">Fecha</span>
              <span className="text-white">
                {new Date(diagnosis.diagnosed_at).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Paciente</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-400">Nombre</span>
              <span className="font-semibold text-white">{diagnosis.patient_name}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-400">Documento</span>
              <span className="text-white">{diagnosis.patient_document}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-400">Tipo de Imagen</span>
              <span className="text-white capitalize">{diagnosis.image_type}</span>
            </div>

            {diagnosis.doctor_name && (
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <span className="text-slate-400">Doctor</span>
                <span className="text-white">{diagnosis.doctor_name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {diagnosis.recommendations && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recomendaciones</h3>
          <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <p className="text-slate-300">{diagnosis.recommendations}</p>
          </div>
        </div>
      )}

      {diagnosis.notes && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Notas</h3>
          <p className="text-slate-300">{diagnosis.notes}</p>
        </div>
      )}
    </div>
  );
};

export default MedicalDiagnosis;