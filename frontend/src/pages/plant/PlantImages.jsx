import React, { useState, useEffect } from 'react';
import { getPlantClasses } from '../../api/plant';
import { Eye, Info } from 'lucide-react';

const PlantImages = () => {
  const [classes, setClasses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getPlantClasses().then(setClasses).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 animate-pulse"><div className="grid grid-cols-3 gap-4">{[1,2,3,4,5,6].map(i => <div key={i} className="h-40 bg-slate-800/50 rounded-xl" />)}</div></div>;
  if (!classes || classes.length === 0) return <div className="p-6 text-slate-400">No hay clases. Sube un dataset primero.</div>;

  const COLORS = ['bg-cyan-500/10 border-cyan-500/20 text-cyan-400', 'bg-blue-500/10 border-blue-500/20 text-blue-400', 'bg-purple-500/10 border-purple-500/20 text-purple-400', 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', 'bg-amber-500/10 border-amber-500/20 text-amber-400', 'bg-pink-500/10 border-pink-500/20 text-pink-400'];

  const maxCount = Math.max(...classes.map(c => c.count));

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-xl font-bold text-white mb-1">Clases del Dataset</h1>
        <p className="text-sm text-slate-500">{classes.length} categorías detectadas en el dataset subido</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((c, i) => {
          const colorClass = COLORS[i % COLORS.length];
          return (
            <div key={i}
              onClick={() => setSelected(selected === i ? null : i)}
              className={`glass-card-hover rounded-xl p-4 border cursor-pointer transition-all duration-300 ${
                selected === i ? 'border-cyan-500/30 shadow-lg shadow-cyan-500/10' : 'border-white/[0.06]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-lg ${colorClass} flex items-center justify-center flex-shrink-0 border`}>
                  <Eye className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white mb-1 truncate">{c.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] text-slate-500">{c.count} imágenes</span>
                    <span className="text-[10px] text-slate-600">•</span>
                    <span className="text-[10px] text-slate-500">{((c.count / classes.reduce((s, cl) => s + cl.count, 0)) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800/60 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700" style={{ width: `${(c.count / maxCount) * 100}%` }} />
                  </div>
                </div>
              </div>

              {selected === i && (
                <div className="mt-3 pt-3 border-t border-white/[0.06] animate-fadeIn">
                  <div className="flex items-start gap-2">
                    <Info className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Clase #{c.id} con {c.count} imágenes etiquetadas como "{c.name}".
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlantImages;
