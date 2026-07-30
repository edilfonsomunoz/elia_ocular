import React, { useState, useEffect } from 'react';
import { getPlantClassificationReport } from '../../api/plant';

const PlantClassificationReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('f1_score');

  useEffect(() => {
    getPlantClassificationReport().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 animate-pulse"><div className="h-96 bg-slate-800/50 rounded-xl" /></div>;
  if (!data) return <div className="p-6 text-slate-400">No hay datos. Sube un dataset primero.</div>;

  const sortedMetrics = [...data.metrics].sort((a, b) => b[sortBy] - a[sortBy]);

  const getF1Color = (f1) => {
    if (f1 >= 0.95) return 'text-cyan-400';
    if (f1 >= 0.90) return 'text-emerald-400';
    if (f1 >= 0.85) return 'text-amber-400';
    return 'text-orange-400';
  };

  const getF1Badge = (f1) => {
    if (f1 >= 0.95) return 'bg-cyan-500/10 border-cyan-500/20';
    if (f1 >= 0.90) return 'bg-emerald-500/10 border-emerald-500/20';
    if (f1 >= 0.85) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-orange-500/10 border-orange-500/20';
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-xl font-bold text-white mb-1">Reporte de Clasificación</h1>
        <p className="text-sm text-slate-500">Métricas detalladas de precisión, recall y F1-score por clase</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.04]">
          <span className="text-[10px] text-slate-600 uppercase block mb-1">Accuracy Global</span>
          <span className="text-sm font-bold text-white">{(data.accuracy * 100).toFixed(1)}%</span>
        </div>
        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.04]">
          <span className="text-[10px] text-slate-600 uppercase block mb-1">Macro Avg F1</span>
          <span className="text-sm font-bold text-purple-400">{(data.macro_avg.f1_score * 100).toFixed(1)}%</span>
        </div>
        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.04]">
          <span className="text-[10px] text-slate-600 uppercase block mb-1">Weighted Avg F1</span>
          <span className="text-sm font-bold text-cyan-400">{(data.weighted_avg.f1_score * 100).toFixed(1)}%</span>
        </div>
        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.04]">
          <span className="text-[10px] text-slate-600 uppercase block mb-1">Total Clases</span>
          <span className="text-sm font-bold text-white">{data.metrics.length}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] text-slate-600 uppercase">Ordenar por:</span>
        {['precision', 'recall', 'f1_score', 'support'].map(key => (
          <button key={key} onClick={() => setSortBy(key)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer
            ${sortBy === key ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-500 hover:text-white hover:bg-white/[0.04] border border-transparent'}`}>
            {key === 'f1_score' ? 'F1 Score' : key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      <div className="glass-card rounded-xl p-5 border border-white/[0.06] overflow-x-auto">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-[0.15em] mb-3">Tabla de Métricas por Clase</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left py-2 px-3 text-[10px] text-slate-500 uppercase font-semibold">Clase</th>
              <th className="text-center py-2 px-3 text-[10px] text-slate-500 uppercase font-semibold">Precision</th>
              <th className="text-center py-2 px-3 text-[10px] text-slate-500 uppercase font-semibold">Recall</th>
              <th className="text-center py-2 px-3 text-[10px] text-slate-500 uppercase font-semibold">F1 Score</th>
              <th className="text-center py-2 px-3 text-[10px] text-slate-500 uppercase font-semibold">Support</th>
            </tr>
          </thead>
          <tbody>
            {sortedMetrics.map((m, i) => (
              <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                <td className="py-2.5 px-3 text-slate-300 font-medium max-w-[200px] truncate">{m.class_name}</td>
                <td className="py-2.5 px-3 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.03] text-slate-300">{(m.precision * 100).toFixed(1)}%</span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.03] text-slate-300">{(m.recall * 100).toFixed(1)}%</span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${getF1Badge(m.f1_score)} ${getF1Color(m.f1_score)}`}>
                    {(m.f1_score * 100).toFixed(1)}%
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center text-slate-400 font-mono">{m.support}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-white/[0.1]">
              <td className="py-2.5 px-3 text-slate-400 font-semibold text-[10px] uppercase">Macro Avg</td>
              <td className="py-2.5 px-3 text-center text-slate-300 font-mono text-[10px]">{(data.macro_avg.precision * 100).toFixed(1)}%</td>
              <td className="py-2.5 px-3 text-center text-slate-300 font-mono text-[10px]">{(data.macro_avg.recall * 100).toFixed(1)}%</td>
              <td className="py-2.5 px-3 text-center text-slate-300 font-mono text-[10px]">{(data.macro_avg.f1_score * 100).toFixed(1)}%</td>
              <td className="py-2.5 px-3 text-center text-slate-400 font-mono text-[10px]">{data.macro_avg.support}</td>
            </tr>
            <tr>
              <td className="py-2.5 px-3 text-slate-400 font-semibold text-[10px] uppercase">Weighted Avg</td>
              <td className="py-2.5 px-3 text-center text-slate-300 font-mono text-[10px]">{(data.weighted_avg.precision * 100).toFixed(1)}%</td>
              <td className="py-2.5 px-3 text-center text-slate-300 font-mono text-[10px]">{(data.weighted_avg.recall * 100).toFixed(1)}%</td>
              <td className="py-2.5 px-3 text-center text-slate-300 font-mono text-[10px]">{(data.weighted_avg.f1_score * 100).toFixed(1)}%</td>
              <td className="py-2.5 px-3 text-center text-slate-400 font-mono text-[10px]">{data.weighted_avg.support}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default PlantClassificationReport;
