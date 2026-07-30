import React, { useState, useEffect } from 'react';
import { getPlantTraining } from '../../api/plant';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const PlantTraining = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('loss');

  useEffect(() => {
    getPlantTraining().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 animate-pulse"><div className="h-96 bg-slate-800/50 rounded-xl" /></div>;
  if (!data) return <div className="p-6 text-slate-400">No hay datos. Sube un dataset primero.</div>;

  const chartData = data.history.map(h => ({
    epoch: h.epoch,
    Loss: parseFloat(h.loss.toFixed(4)),
    'Val Loss': parseFloat(h.val_loss.toFixed(4)),
    Accuracy: parseFloat((h.accuracy * 100).toFixed(1)),
    'Val Accuracy': parseFloat((h.val_accuracy * 100).toFixed(1)),
    AUC: parseFloat((h.auc * 100).toFixed(1)),
    'Val AUC': parseFloat((h.val_auc * 100).toFixed(1)),
  }));

  const tooltipStyle = { background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px' };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-xl font-bold text-white mb-1">Entrenamiento de la CNN</h1>
        <p className="text-sm text-slate-500">Evolución del modelo durante {data.total_epochs} épocas de entrenamiento</p>
      </div>

      <div className="flex items-center gap-2">
        {[
          { id: 'loss', label: 'Pérdida (Loss)' },
          { id: 'accuracy', label: 'Precisión (Accuracy)' },
          { id: 'auc', label: 'AUC' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer
            ${tab === t.id ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-500 hover:text-white hover:bg-white/[0.04] border border-transparent'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="glass-card rounded-xl p-6 border border-white/[0.06]">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            {tab === 'loss' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="epoch" tick={{ fontSize: 10, fill: '#64748b' }} label={{ value: 'Época', position: 'bottom', offset: -5, style: { fontSize: 10, fill: '#64748b' } }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="Loss" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Val Loss" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 5" />
              </LineChart>
            ) : tab === 'accuracy' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="epoch" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="Accuracy" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Val Accuracy" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 5" />
              </LineChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="epoch" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="AUC" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Val AUC" stroke="#ec4899" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 5" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Epochs', value: data.total_epochs },
          { label: 'Early Stopping', value: data.early_stopping ? 'Sí (patience=5)' : 'No' },
          { label: 'Final Train Acc', value: `${(data.final_train_accuracy * 100).toFixed(1)}%` },
          { label: 'Final Val Acc', value: `${(data.final_val_accuracy * 100).toFixed(1)}%` },
        ].map((s, i) => (
          <div key={i} className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.04]">
            <span className="text-[10px] text-slate-600 uppercase block mb-1">{s.label}</span>
            <span className="text-sm font-bold text-white">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlantTraining;
