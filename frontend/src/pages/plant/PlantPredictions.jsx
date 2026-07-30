import React, { useState, useEffect } from 'react';
import { getPlantPredictions } from '../../api/plant';
import { CheckCircle, XCircle, Filter } from 'lucide-react';

const PlantPredictions = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getPlantPredictions().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 animate-pulse"><div className="h-64 bg-slate-800/50 rounded-xl" /></div>;
  if (!data) return <div className="p-6 text-slate-400">No hay datos. Sube un dataset primero.</div>;

  const filtered = filter === 'all' ? data.predictions
    : filter === 'correct' ? data.predictions.filter(p => p.correct)
    : data.predictions.filter(p => !p.correct);

  const getConfidenceColor = (conf) => {
    if (conf >= 0.90) return 'text-cyan-400';
    if (conf >= 0.75) return 'text-emerald-400';
    if (conf >= 0.60) return 'text-amber-400';
    return 'text-orange-400';
  };

  const getConfidenceBg = (conf) => {
    if (conf >= 0.90) return 'bg-cyan-500/10 border-cyan-500/20';
    if (conf >= 0.75) return 'bg-emerald-500/10 border-emerald-500/20';
    if (conf >= 0.60) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-orange-500/10 border-orange-500/20';
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-xl font-bold text-white mb-1">Predicciones del Modelo</h1>
        <p className="text-sm text-slate-500">Ejemplos de predicciones realizadas por la CNN</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.04]">
          <span className="text-[10px] text-slate-600 uppercase block mb-1">Total</span>
          <span className="text-sm font-bold text-white">{data.total}</span>
        </div>
        <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
          <span className="text-[10px] text-slate-500 uppercase block mb-1">Correctas</span>
          <span className="text-sm font-bold text-cyan-400">{data.correct}</span>
        </div>
        <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
          <span className="text-[10px] text-slate-500 uppercase block mb-1">Incorrectas</span>
          <span className="text-sm font-bold text-red-400">{data.incorrect}</span>
        </div>
        <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
          <span className="text-[10px] text-slate-500 uppercase block mb-1">Accuracy</span>
          <span className="text-sm font-bold text-purple-400">{(data.accuracy * 100).toFixed(1)}%</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="w-3.5 h-3.5 text-slate-500" />
        {[
          { id: 'all', label: 'Todas', count: data.total },
          { id: 'correct', label: 'Correctas', count: data.correct },
          { id: 'incorrect', label: 'Incorrectas', count: data.incorrect },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer flex items-center gap-1.5
            ${filter === f.id ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-500 hover:text-white hover:bg-white/[0.04] border border-transparent'}`}>
            {f.label}
            <span className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[9px]">{f.count}</span>
          </button>
        ))}
      </div>

      <div className="glass-card rounded-xl p-5 border border-white/[0.06] overflow-x-auto">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-[0.15em] mb-3">Detalle de Predicciones</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left py-2 px-3 text-[10px] text-slate-500 uppercase font-semibold">ID</th>
              <th className="text-left py-2 px-3 text-[10px] text-slate-500 uppercase font-semibold">Real</th>
              <th className="text-left py-2 px-3 text-[10px] text-slate-500 uppercase font-semibold">Predicho</th>
              <th className="text-center py-2 px-3 text-[10px] text-slate-500 uppercase font-semibold">Confianza</th>
              <th className="text-center py-2 px-3 text-[10px] text-slate-500 uppercase font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={i} className={`border-b border-white/[0.03] transition-colors ${
                p.correct ? 'hover:bg-cyan-500/[0.02]' : 'hover:bg-red-500/[0.02]'
              }`}>
                <td className="py-2.5 px-3 text-slate-400 font-mono">#{p.image_id}</td>
                <td className="py-2.5 px-3 text-slate-300 font-medium max-w-[200px] truncate">{p.actual_label}</td>
                <td className="py-2.5 px-3 text-slate-300 font-medium max-w-[200px] truncate">{p.predicted_label}</td>
                <td className="py-2.5 px-3 text-center">
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${getConfidenceBg(p.confidence)} ${getConfidenceColor(p.confidence)}`}>
                    {(p.confidence * 100).toFixed(1)}%
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  {p.correct ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-semibold">
                      <CheckCircle className="w-3 h-3" /> Correcto
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-semibold">
                      <XCircle className="w-3 h-3" /> Error
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlantPredictions;
