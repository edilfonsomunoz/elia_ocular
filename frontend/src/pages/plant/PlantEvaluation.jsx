import React, { useState, useEffect } from 'react';
import { getPlantEvaluation } from '../../api/plant';
import { Activity, TrendingUp, Target, Zap } from 'lucide-react';

const PlantEvaluation = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlantEvaluation().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 animate-pulse"><div className="h-64 bg-slate-800/50 rounded-xl" /></div>;
  if (!data) return <div className="p-6 text-slate-400">No hay datos. Sube un dataset primero.</div>;

  const metrics = [
    { icon: TrendingUp, label: 'Test Loss', value: data.test_loss.toFixed(4), sub: 'Pérdida en conjunto de prueba', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    { icon: Target, label: 'Test Accuracy', value: `${(data.test_accuracy * 100).toFixed(1)}%`, sub: 'Precisión en conjunto de prueba', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
    { icon: Activity, label: 'Test AUC', value: `${(data.test_auc * 100).toFixed(2)}%`, sub: 'Area Under the Curve', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  ];

  const accuracyPct = data.test_accuracy * 100;
  const errorPct = 100 - accuracyPct;

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-xl font-bold text-white mb-1">Evaluación del Modelo</h1>
        <p className="text-sm text-slate-500">Resultados de la CNN en el conjunto de prueba</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className={`glass-card-hover rounded-xl p-5 border ${m.border}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg ${m.bg} flex items-center justify-center`}>
                <m.icon className={`w-5 h-5 ${m.color}`} />
              </div>
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">{m.label}</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{m.value}</p>
            <p className="text-[11px] text-slate-500">{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl p-6 border border-white/[0.06]">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-[0.15em] mb-4">Desglose de Precisión</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-400">Predicciones Correctas</span>
              <span className="text-xs font-mono text-cyan-400">{accuracyPct.toFixed(1)}%</span>
            </div>
            <div className="h-5 bg-slate-800/60 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center px-3 transition-all duration-1000" style={{ width: `${accuracyPct}%` }}>
                <span className="text-[10px] font-bold text-white">{accuracyPct.toFixed(1)}%</span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-400">Predicciones Incorrectas</span>
              <span className="text-xs font-mono text-red-400">{errorPct.toFixed(1)}%</span>
            </div>
            <div className="h-5 bg-slate-800/60 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center px-3 transition-all duration-1000" style={{ width: `${errorPct}%` }}>
                {errorPct > 3 && <span className="text-[10px] font-bold text-white">{errorPct.toFixed(1)}%</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-5 border border-white/[0.06]">
        <div className="flex items-center gap-3 mb-3">
          <Zap className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-[0.15em]">Resumen</h3>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">
          El modelo CNN alcanzó una precisión del <span className="text-cyan-400 font-semibold">{accuracyPct.toFixed(1)}%</span> en el
          conjunto de prueba, con una pérdida de <span className="text-white font-semibold">{data.test_loss.toFixed(4)}</span> y un
          AUC de <span className="text-purple-400 font-semibold">{(data.test_auc * 100).toFixed(2)}%</span>.
        </p>
      </div>
    </div>
  );
};

export default PlantEvaluation;
