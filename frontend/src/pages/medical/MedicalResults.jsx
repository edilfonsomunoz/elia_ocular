import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listResults, listPatients } from '../../api/medical';
import {
  ClipboardCheck, Brain, TrendingUp, Heart, Filter, AlertTriangle,
  CheckCircle, ChevronDown, ChevronUp, User, FileText, Stethoscope,
  Activity, Search, Eye
} from 'lucide-react';

const MedicalResults = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPatient, setFilterPatient] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, [filterPatient]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [resultsData, patientsData] = await Promise.all([
        listResults(filterPatient || null),
        listPatients().catch(() => [])
      ]);
      setResults(resultsData);
      setPatients(patientsData);
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level) => {
    if (level === 'Alto') return 'text-red-400 bg-red-500/10 border-red-500/20';
    if (level === 'Moderado') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  };

  const getLevelBarColor = (probability) => {
    if (probability > 0.75) return 'from-red-500 to-red-400';
    if (probability > 0.5) return 'from-amber-500 to-amber-400';
    return 'from-emerald-500 to-emerald-400';
  };

  const getConfidenceColor = (confidence) => {
    if (confidence === 'Alta') return 'text-red-400';
    if (confidence === 'Media') return 'text-amber-400';
    return 'text-emerald-400';
  };

  const getDiseaseIcon = (disease) => {
    switch (disease) {
      case 'Catarata': return Eye;
      case 'Glaucoma': return AlertTriangle;
      case 'Retinopatía diabética': return Activity;
      case 'Degeneración macular': return Brain;
      case 'Retina sana': return CheckCircle;
      default: return Activity;
    }
  };

  const getDiseaseColor = (disease) => {
    switch (disease) {
      case 'Catarata': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Glaucoma': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'Retinopatía diabética': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'Degeneración macular': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'Retina sana': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const filteredResults = results.filter((r) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      r.patient_name?.toLowerCase().includes(term) ||
      r.patient_document?.toLowerCase().includes(term) ||
      r.disease?.toLowerCase().includes(term) ||
      r.image_type?.toLowerCase().includes(term)
    );
  });

  const stats = {
    total: results.length,
    alto: results.filter(r => r.level === 'Alto').length,
    moderado: results.filter(r => r.level === 'Moderado').length,
    bajo: results.filter(r => r.level === 'Bajo').length,
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-xl font-bold text-white mb-1">Resultados Diagnosticos</h1>
        <p className="text-sm text-slate-500">Detalle completo de diagnosticos realizados por IA</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-card rounded-xl p-4 border border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyan-500/10">
              <ClipboardCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase">Total</p>
              <p className="text-lg font-bold text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 border border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-500/10">
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase">Nivel Alto</p>
              <p className="text-lg font-bold text-red-400">{stats.alto}</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 border border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10">
              <Activity className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase">Moderado</p>
              <p className="text-lg font-bold text-amber-400">{stats.moderado}</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 border border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase">Nivel Bajo</p>
              <p className="text-lg font-bold text-emerald-400">{stats.bajo}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por paciente, enfermedad o tipo..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-emerald-500/50 focus:outline-none transition-colors"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <select
            value={filterPatient}
            onChange={(e) => setFilterPatient(e.target.value)}
            className="bg-slate-800 border border-white/[0.08] rounded-lg pl-10 pr-8 py-2.5 text-sm text-white focus:border-emerald-500/50 focus:outline-none transition-colors appearance-none min-w-[200px]"
          >
            <option value="" className="bg-slate-800 text-white">Todos los pacientes</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id} className="bg-slate-800 text-white">
                {p.full_name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Results List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="glass-card rounded-xl p-12 border border-white/[0.06] text-center">
          <ClipboardCheck className="w-12 h-12 mx-auto text-slate-700 mb-3" />
          <p className="text-sm text-slate-500">
            {results.length === 0 ? 'No hay diagnosticos registrados aun' : 'No se encontraron resultados con ese filtro'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredResults.map((result) => {
            const DiseaseIcon = getDiseaseIcon(result.disease);
            const isExpanded = expandedId === result.id;

            return (
              <div key={result.id} className="glass-card rounded-xl border border-white/[0.06] overflow-hidden transition-all duration-200 hover:border-white/[0.1]">
                {/* Header Row */}
                <div
                  className="p-4 cursor-pointer flex items-center gap-4"
                  onClick={() => setExpandedId(isExpanded ? null : result.id)}
                >
                  {/* Disease Icon */}
                  <div className={`p-2.5 rounded-lg border flex-shrink-0 ${getDiseaseColor(result.disease)}`}>
                    <DiseaseIcon className="w-4 h-4" />
                  </div>

                  {/* Main Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-white truncate">{result.disease}</h3>
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${getLevelColor(result.level)}`}>
                        {result.level}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {result.patient_name || 'Sin paciente'}
                      </span>
                      <span>{result.patient_document}</span>
                      <span>{result.image_type}</span>
                    </div>
                  </div>

                  {/* Probability */}
                  <div className="text-right flex-shrink-0 hidden sm:block">
                    <p className="text-lg font-bold text-cyan-400">{(result.probability * 100).toFixed(1)}%</p>
                    <p className="text-[10px] text-slate-500 uppercase">Probabilidad</p>
                  </div>

                  {/* Date */}
                  <div className="text-right flex-shrink-0 hidden md:block">
                    <p className="text-[11px] text-slate-400">
                      {new Date(result.diagnosed_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-[10px] text-slate-600">
                      {new Date(result.diagnosed_at).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {/* Expand */}
                  <div className="flex-shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                </div>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-white/[0.04] pt-4 animate-slideUp">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Diagnosis Detail */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                          <Brain className="w-3 h-3 text-cyan-400" />
                          Diagnostico IA
                        </h4>
                        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.04] space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Enfermedad</span>
                            <span className="text-white font-semibold">{result.disease}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Probabilidad</span>
                            <span className="text-cyan-400 font-semibold">{(result.probability * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-800/60 rounded-full overflow-hidden mt-1">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${getLevelBarColor(result.probability)} transition-all duration-700`}
                              style={{ width: `${result.probability * 100}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Nivel</span>
                            <span className={`font-semibold px-2 py-0.5 rounded-full border text-[10px] ${getLevelColor(result.level)}`}>
                              {result.level}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Confianza</span>
                            <span className={`font-semibold ${getConfidenceColor(result.confidence)}`}>
                              {result.confidence}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Patient Info */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                          <User className="w-3 h-3 text-emerald-400" />
                          Informacion del Paciente
                        </h4>
                        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.04] space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Nombre</span>
                            <span className="text-white font-semibold">{result.patient_name || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Documento</span>
                            <span className="text-white">{result.patient_document || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Tipo Imagen</span>
                            <span className="text-white capitalize">{result.image_type}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Doctor</span>
                            <span className="text-white">{result.doctor_name || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Fecha</span>
                            <span className="text-white">
                              {new Date(result.diagnosed_at).toLocaleString('es-PE')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                          <Heart className="w-3 h-3 text-pink-400" />
                          Recomendaciones
                        </h4>
                        <div className="p-3 rounded-lg bg-cyan-500/[0.04] border border-cyan-500/10">
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {result.recommendations || 'Sin recomendaciones registradas'}
                          </p>
                        </div>
                        {result.notes && (
                          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                            <p className="text-[10px] text-slate-500 uppercase mb-1">Notas</p>
                            <p className="text-xs text-slate-400">{result.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* View Full Detail */}
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/medical/diagnosis/${result.image_id}`);
                        }}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition-colors"
                      >
                        <FileText className="w-3 h-3" />
                        Ver diagnostico completo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MedicalResults;
