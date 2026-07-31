import React, { useState, useCallback, useEffect } from 'react';
import { uploadDataset, listDatasets, deleteDataset } from '../../api/plant';
import { Upload, FileArchive, CheckCircle2, AlertCircle, Eye, Trash2, FolderOpen } from 'lucide-react';

const PlantUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const [datasets, setDatasets] = useState([]);
  const [loadingDatasets, setLoadingDatasets] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const loadDatasets = async () => {
    try {
      setLoadingDatasets(true);
      const data = await listDatasets();
      setDatasets(data);
    } catch (err) {
      console.error('Error loading datasets', err);
    } finally {
      setLoadingDatasets(false);
    }
  };

  useEffect(() => {
    loadDatasets();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && f.name.toLowerCase().endsWith('.zip')) {
      setFile(f);
      setError('');
    } else {
      setError('Solo se permiten archivos ZIP');
    }
  }, []);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      if (f.name.toLowerCase().endsWith('.zip')) {
        setFile(f);
        setError('');
      } else {
        setError('Solo se permiten archivos ZIP');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const data = await uploadDataset(formData);
      setResult(data);
      setFile(null);
      loadDatasets();
    } catch (err) {
      let errorMessage = 'Error al subir el archivo';
      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === 'string') {
          errorMessage = err.response.data.detail;
        } else if (Array.isArray(err.response.data.detail)) {
          errorMessage = err.response.data.detail.map(e => e.msg || e.message || JSON.stringify(e)).join(', ');
        }
      } else if (err.message === 'Network Error' || !err.response) {
        errorMessage = `Error de Red al subir el archivo (${(file.size / 1024 / 1024).toFixed(2)} MB). ` +
          `Verifica la conexión o asegúrate de que el servidor servidor/proxy (Nginx) tenga suficiente límite de tamaño (ej: client_max_body_size 500M;).`;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteDataset(id);
      setDatasets((prev) => prev.filter((d) => d.id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al eliminar el dataset');
    } finally {
      setDeletingId(null);
    }
  };

  const maxCount = result ? Math.max(...Object.values(result.class_distribution || {})) : 1;

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-xl font-bold text-white mb-1">Subir Dataset Ocular</h1>
        <p className="text-sm text-slate-500">Sube un archivo ZIP con carpetas por clase (cada carpeta = una categoria de enfermedad ocular)</p>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`glass-card rounded-xl p-10 border-2 border-dashed text-center transition-all duration-200 cursor-pointer
          ${dragOver ? 'border-cyan-500 bg-cyan-500/5' : 'border-white/[0.08] hover:border-white/[0.15]'}`}
        onClick={() => document.getElementById('zip-input').click()}
      >
        <input id="zip-input" type="file" accept=".zip" className="hidden" onChange={handleFileChange} />
        <Upload className="w-10 h-10 text-slate-600 mx-auto mb-4" />
        {file ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <FileArchive className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-semibold text-white">{file.name}</span>
              <span className="text-xs text-slate-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
            <p className="text-xs text-slate-500">Haz clic para cambiar el archivo</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-slate-300 font-medium">Arrastra un archivo ZIP aqui</p>
            <p className="text-xs text-slate-600">Formato: ZIP con subcarpetas por clase (ej: sano/, glaucoma/, catarata/)</p>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/[0.08] border border-red-500/20 text-red-300 text-xs flex items-center gap-3 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {file && !result && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all shadow-lg shadow-cyan-500/20"
        >
          {uploading ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Procesando ZIP...</>
          ) : (
            <><Upload className="w-4 h-4" /> Subir y Analizar</>
          )}
        </button>
      )}

      {result && (
        <div className="glass-card rounded-xl p-6 border border-white/[0.06] space-y-5 animate-slideUp">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">ZIP procesado correctamente</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-white/[0.03]">
              <span className="text-[10px] text-slate-500 uppercase block mb-1">Archivo</span>
              <span className="text-xs font-semibold text-white truncate block">{result.filename}</span>
            </div>
            <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
              <span className="text-[10px] text-slate-500 uppercase block mb-1">Total Imagenes</span>
              <span className="text-xs font-bold text-cyan-400">{result.total_images}</span>
            </div>
            <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
              <span className="text-[10px] text-slate-500 uppercase block mb-1">Clases</span>
              <span className="text-xs font-bold text-purple-400">{result.num_classes}</span>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
              <span className="text-[10px] text-slate-500 uppercase block mb-1">Formato</span>
              <span className="text-xs font-bold text-emerald-400">ZIP/Imagenes</span>
            </div>
          </div>

          {result.class_distribution && Object.keys(result.class_distribution).length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-300 mb-3 uppercase tracking-[0.15em] flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                Distribucion de Clases
              </h4>
              <div className="space-y-2">
                {Object.entries(result.class_distribution).sort((a, b) => b[1] - a[1]).map(([label, count]) => (
                  <div key={label} className="flex items-center gap-3 py-1.5 px-3 rounded-lg hover:bg-white/[0.02] transition-colors">
                    <span className="text-[11px] text-slate-300 truncate w-48">{label}</span>
                    <div className="flex-1 h-5 bg-slate-800/60 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center px-2 transition-all duration-700" style={{ width: `${(count / maxCount) * 100}%` }}>
                        {count / maxCount > 0.15 && <span className="text-[9px] font-bold text-white">{count}</span>}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono w-12 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-[0.15em]">Clases Detectadas</h4>
            <div className="flex flex-wrap gap-2">
              {result.classes?.map((cls, i) => (
                <span key={i} className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {cls}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Datasets subidos */}
      <div className="glass-card rounded-xl p-6 border border-white/[0.06] space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-cyan-400" />
          Datasets Subidos
          {!loadingDatasets && (
            <span className="text-[10px] text-slate-500 font-normal ml-1">({datasets.length})</span>
          )}
        </h3>

        {loadingDatasets ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          </div>
        ) : datasets.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">No hay datasets subidos aun</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="pb-2 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Archivo</th>
                  <th className="pb-2 text-[10px] text-slate-500 uppercase tracking-wider font-semibold text-center">Imagenes</th>
                  <th className="pb-2 text-[10px] text-slate-500 uppercase tracking-wider font-semibold text-center">Clases</th>
                  <th className="pb-2 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Estado</th>
                  <th className="pb-2 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Fecha</th>
                  <th className="pb-2 text-[10px] text-slate-500 uppercase tracking-wider font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {datasets.map((ds) => (
                  <tr key={ds.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <FileArchive className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span className="text-xs text-white font-medium truncate max-w-[200px]">{ds.filename}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-xs text-cyan-400 font-semibold">{ds.total_images}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-xs text-purple-400 font-semibold">{ds.num_classes}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${ds.status === 'uploaded' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                        {ds.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] text-slate-500">
                        {ds.created_at ? new Date(ds.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                      </span>
                    </td>
                    <td className="py-3 pl-4 text-right">
                      {confirmDeleteId === ds.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-[10px] text-red-400">Eliminar?</span>
                          <button
                            onClick={() => handleDelete(ds.id)}
                            disabled={deletingId === ds.id}
                            className="px-2 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[10px] font-semibold transition-colors disabled:opacity-50"
                          >
                            {deletingId === ds.id ? '...' : 'Si'}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] text-slate-400 text-[10px] font-semibold transition-colors"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(ds.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"
                          title="Eliminar dataset"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantUpload;
