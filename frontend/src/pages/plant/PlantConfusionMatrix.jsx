import React, { useState, useEffect } from 'react';
import { getPlantConfusionMatrix } from '../../api/plant';

const PlantConfusionMatrix = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredCell, setHoveredCell] = useState(null);

  useEffect(() => {
    getPlantConfusionMatrix().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 animate-pulse"><div className="h-96 bg-slate-800/50 rounded-xl" /></div>;
  if (!data) return <div className="p-6 text-slate-400">No hay datos. Sube un dataset primero.</div>;

  const { matrix, class_names } = data;
  const shortNames = class_names.map(n => n.length > 15 ? n.substring(0, 15) + '...' : n);
  const maxVal = Math.max(...matrix.flat());

  const getColor = (val, rowIdx, colIdx) => {
    if (rowIdx === colIdx) {
      const intensity = val / maxVal;
      return `rgba(6, 182, 212, ${0.2 + intensity * 0.6})`;
    }
    if (val === 0) return 'rgba(30, 41, 59, 0.3)';
    const intensity = val / maxVal;
    return `rgba(239, 68, 68, ${0.1 + intensity * 0.5})`;
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-xl font-bold text-white mb-1">Matriz de Confusión</h1>
        <p className="text-sm text-slate-500">Comparación entre etiquetas reales y predichas por el modelo CNN</p>
      </div>

      <div className="glass-card rounded-xl p-5 border border-white/[0.06] overflow-x-auto">
        <div className="min-w-[700px]">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-1.5 text-[9px] text-slate-600 uppercase tracking-wider sticky left-0 bg-slate-900/80 z-10"></th>
                {class_names.map((name, i) => (
                  <th key={i} className="p-1.5 text-[8px] text-slate-400 font-medium" style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)', height: '100px' }}>
                    {shortNames[i]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  <td className="p-1 text-[8px] text-slate-400 font-medium whitespace-nowrap sticky left-0 bg-slate-900/80 z-10 pr-2 text-right">
                    {shortNames[rowIdx]}
                  </td>
                  {row.map((val, colIdx) => (
                    <td key={colIdx} className="p-0.5"
                      onMouseEnter={() => setHoveredCell({ row: rowIdx, col: colIdx, val })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <div
                        className="w-full aspect-square flex items-center justify-center rounded text-[10px] font-mono cursor-default transition-all duration-150"
                        style={{
                          backgroundColor: getColor(val, rowIdx, colIdx),
                          color: val === 0 ? '#475569' : (rowIdx === colIdx ? '#fff' : '#fca5a5'),
                          transform: hoveredCell?.row === rowIdx && hoveredCell?.col === colIdx ? 'scale(1.15)' : 'scale(1)',
                          boxShadow: hoveredCell?.row === rowIdx && hoveredCell?.col === colIdx ? '0 0 12px rgba(6,182,212,0.3)' : 'none',
                        }}
                      >
                        {val}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[9px] text-slate-600 mt-3 text-center">Cyan = diagonal principal (correctos) | Rojo = fuera de diagonal (errores)</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
          <span className="text-[10px] text-slate-500 block mb-1">Total Correctos</span>
          <span className="text-sm font-bold text-cyan-400">{matrix.reduce((sum, row, i) => sum + row[i], 0).toLocaleString()}</span>
        </div>
        <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
          <span className="text-[10px] text-slate-500 block mb-1">Total Errores</span>
          <span className="text-sm font-bold text-red-400">{matrix.reduce((sum, row) => sum + row.reduce((s, v) => s + v, 0), 0) - matrix.reduce((sum, row, i) => sum + row[i], 0)}</span>
        </div>
        <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
          <span className="text-[10px] text-slate-500 block mb-1">Clases</span>
          <span className="text-sm font-bold text-purple-400">{class_names.length}</span>
        </div>
        <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
          <span className="text-[10px] text-slate-500 block mb-1">Total Predicciones</span>
          <span className="text-sm font-bold text-amber-400">{matrix.reduce((sum, row) => sum + row.reduce((s, v) => s + v, 0), 0).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default PlantConfusionMatrix;
