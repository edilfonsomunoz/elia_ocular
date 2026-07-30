import React, { useState, useEffect } from 'react';
import { getPlantDistribution } from '../../api/plant';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#06b6d4','#3b82f6','#6366f1','#8b5cf6','#ec4899','#ef4444','#f59e0b','#10b981','#14b8a6','#a855f7','#e11d48','#0ea5e9','#22c55e','#84cc16','#f97316'];

const PlantDistribution = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlantDistribution().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 animate-pulse"><div className="h-96 bg-slate-800/50 rounded-xl" /></div>;
  if (!data) return <div className="p-6 text-slate-400">No hay datos. Sube un dataset primero.</div>;

  const chartData = data.items.map(d => ({
    name: d.label.length > 20 ? d.label.substring(0, 20) + '...' : d.label,
    count: d.count,
    label: d.label
  }));

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-xl font-bold text-white mb-1">Distribución de Clases</h1>
        <p className="text-sm text-slate-500">{data.total.toLocaleString()} imágenes distribuidas en {data.items.length} clases</p>
      </div>

      <div className="glass-card rounded-xl p-6 border border-white/[0.06]">
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} angle={-45} textAnchor="end" interval={0} height={100} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px' }}
                labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                formatter={(value, name) => [value.toLocaleString(), 'Imágenes']}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.8} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card rounded-xl p-5 border border-white/[0.06]">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-[0.15em] mb-3">Tabla de Distribución</h3>
        <div className="space-y-1.5">
          {data.items.map((d, i) => (
            <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/[0.03] transition-colors">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <span className="text-xs text-slate-300 flex-1 truncate">{d.label}</span>
              <div className="w-40 h-3 bg-slate-800/60 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(d.count / data.items[0].count) * 100}%`, backgroundColor: COLORS[i % COLORS.length], opacity: 0.7 }} />
              </div>
              <span className="text-xs font-mono text-slate-400 w-12 text-right">{d.count.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlantDistribution;
