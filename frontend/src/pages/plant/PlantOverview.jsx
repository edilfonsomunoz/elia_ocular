import React, { useState, useEffect } from 'react';
import { getPlantOverview } from '../../api/plant';
import { Database, Layers, TrendingUp, Cpu, Activity, Upload } from 'lucide-react';

const PlantOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlantOverview().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (!data) return <div className="p-8 text-center">
    <Upload className="w-12 h-12 text-slate-700 mx-auto mb-3" />
    <p className="text-slate-400 text-sm">No hay dataset subido</p>
    <p className="text-slate-600 text-xs mt-1">Sube un archivo ZIP desde "Subir Dataset" para comenzar</p>
  </div>;

  const stats = [
    { icon: Database, label: 'Total Imágenes', value: data.total_images.toLocaleString(), color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { icon: Layers, label: 'Clases', value: data.total_classes, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { icon: TrendingUp, label: 'Train', value: data.train_count.toLocaleString(), color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { icon: Activity, label: 'Validation', value: data.val_count.toLocaleString(), color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { icon: Cpu, label: 'Test', value: data.test_count.toLocaleString(), color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { icon: Database, label: 'Dataset', value: data.dataset_name || 'N/A', color: 'text-pink-400', bg: 'bg-pink-500/10' },
  ];

  const splits = [
    { label: 'Entrenamiento', count: data.train_count, pct: 80, color: 'bg-cyan-500' },
    { label: 'Validación', count: data.val_count, pct: 10, color: 'bg-emerald-500' },
    { label: 'Prueba', count: data.test_count, pct: 10, color: 'bg-purple-500' },
  ];

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-xl font-bold text-white mb-1">Vista General del Análisis</h1>
        <p className="text-sm text-slate-500">Clasificación de enfermedades oculares con Redes Neuronales Convolucionales (CNN)</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="glass-card-hover rounded-xl p-4 border border-white/[0.06]">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">{s.label}</span>
            </div>
            <p className="text-lg font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl p-5 border border-white/[0.06]">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-[0.15em] mb-4">División del Dataset (80/10/10)</h3>
        <div className="space-y-3">
          {splits.map((s, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-xs text-slate-400 w-28">{s.label}</span>
              <div className="flex-1 h-6 bg-slate-800/60 rounded-lg overflow-hidden">
                <div className={`h-full ${s.color} rounded-lg flex items-center px-3`} style={{ width: `${s.pct}%` }}>
                  <span className="text-[10px] font-bold text-white">{s.pct}%</span>
                </div>
              </div>
              <span className="text-xs text-slate-500 font-mono w-16 text-right">{s.count.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="p-6 space-y-4 animate-pulse">
    <div className="h-6 w-48 bg-slate-800 rounded" />
    <div className="grid grid-cols-3 gap-4">
      {[1,2,3,4,5,6].map(i => <div key={i} className="h-28 bg-slate-800/50 rounded-xl" />)}
    </div>
  </div>
);

export default PlantOverview;
