import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPatientHistory, getPatient } from '../../api/medical';
import { History, Activity, AlertTriangle, CheckCircle } from 'lucide-react';

const MedicalHistory = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [patientId]);

  const loadData = async () => {
    try {
      const [patientData, historyData] = await Promise.all([
        getPatient(patientId),
        getPatientHistory(patientId)
      ]);
      setPatient(patientData);
      setHistory(historyData);
    } catch (error) {
      console.error('Error loading history:', error);
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

  const getLevelColor = (level) => {
    switch (level) {
      case 'Alto': return 'text-red-400 bg-red-500/20';
      case 'Moderado': return 'text-amber-400 bg-amber-500/20';
      case 'Bajo': return 'text-emerald-400 bg-emerald-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Historial Clínico</h1>
        {patient && (
          <p className="text-slate-400">
            {patient.full_name} - {patient.document_number}
          </p>
        )}
      </div>

      {history.length === 0 ? (
        <div className="glass-card p-6 text-center">
          <History className="w-16 h-16 mx-auto text-slate-500 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Sin historial</h2>
          <p className="text-slate-400">Este paciente no tiene diagnósticos registrados</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item, index) => (
            <div key={item.id} className="glass-card p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`p-2 rounded-full ${getLevelColor(item.level)}`}>
                      {item.level === 'Alto' ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : (
                        <CheckCircle className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-white">{item.disease}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(item.level)}`}>
                        {item.level}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <span>Probabilidad: {(item.probability * 100).toFixed(1)}%</span>
                      <span>Confianza: {item.confidence}</span>
                      <span>Tipo: {item.image_type}</span>
                    </div>
                    {item.recommendations && (
                      <p className="text-sm text-slate-300 mt-2">{item.recommendations}</p>
                    )}
                  </div>
                </div>
                <div className="text-right text-sm text-slate-500">
                  <p>{new Date(item.diagnosed_at).toLocaleDateString()}</p>
                  <p>{new Date(item.diagnosed_at).toLocaleTimeString()}</p>
                  {item.doctor_name && (
                    <p className="mt-1 text-slate-400">Dr. {item.doctor_name}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicalHistory;