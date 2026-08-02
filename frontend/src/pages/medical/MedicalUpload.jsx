import React, { useState, useEffect } from 'react';
import { uploadMedicalImage, listPatients, diagnoseImage } from '../../api/medical';
import { Upload, Image, AlertCircle, CheckCircle, Loader2, Activity, Stethoscope, TrendingUp, Heart, Brain } from 'lucide-react';

const MedicalUpload = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [imageType, setImageType] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [diagnosing, setDiagnosing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [patientsError, setPatientsError] = useState('');

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const data = await listPatients();
      setPatients(data);
      setPatientsError('');
    } catch (error) {
      setPatientsError(
        error.response?.status === 403
          ? 'Tu rol no tiene permisos para ver pacientes. Usa una cuenta de administrador o médico.'
          : error.response?.data?.detail || 'Error al cargar la lista de pacientes.'
      );
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setDiagnosisResult(null);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedPatient) {
      setMessage({ type: 'error', text: 'Por favor seleccione un paciente y una imagen' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });
    setDiagnosisResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('patient_id', selectedPatient);
      formData.append('image_type', 'Catarata');
      formData.append('description', description);

      const uploadedImage = await uploadMedicalImage(formData);
      setMessage({ type: 'success', text: 'Imagen subida exitosamente' });

      setDiagnosing(true);
      try {
        const diagnosis = await diagnoseImage(uploadedImage.id);
        setDiagnosisResult(diagnosis);
        setImageType(diagnosis.disease);
        setMessage({ type: 'success', text: 'Diagnostico completado exitosamente' });
      } catch (diagError) {
        setMessage({ type: 'warning', text: 'Imagen subida, pero el diagnostico fallo. El modelo de IA no esta disponible.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.detail || 'Error al subir la imagen' });
    } finally {
      setUploading(false);
      setDiagnosing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setDiagnosisResult(null);
    setMessage({ type: '', text: '' });
    setDescription('');
  };

  const getLevelColor = (level) => {
    if (level === 'Alto') return 'text-red-400 bg-red-500/10 border-red-500/20';
    if (level === 'Moderado') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  };

  const getConfidenceColor = (confidence) => {
    if (confidence === 'Alta') return 'text-red-400';
    if (confidence === 'Media') return 'text-amber-400';
    return 'text-emerald-400';
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-xl font-bold text-white mb-1">Subir Imagen Medica</h1>
        <p className="text-sm text-slate-500">Suba una imagen para diagnostico de enfermedades oculares con IA</p>
      </div>

      {message.text && (
        <div className={`p-3.5 rounded-xl text-xs flex items-center gap-3 animate-fadeIn ${
          message.type === 'error' ? 'bg-red-500/[0.08] border border-red-500/20 text-red-300' :
          message.type === 'success' ? 'bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-300' :
          'bg-amber-500/[0.08] border border-amber-500/20 text-amber-300'
        }`}>
          {message.type === 'error' ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> :
           message.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> :
           <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6 border border-white/[0.06] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Informacion de la Imagen
          </h3>

          <div>
            <label className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-2">
              Paciente *
            </label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="w-full bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:border-cyan-500/50 focus:outline-none transition-colors"
            >
              <option value="" className="bg-slate-800 text-white">Seleccione un paciente</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id} className="bg-slate-800 text-white">
                  {patient.full_name} - {patient.document_number}
                </option>
              ))}
            </select>
            {patients.length === 0 && (
              <p className="mt-2 text-[11px] text-amber-400/90 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {patientsError || 'No hay pacientes registrados. Regístrelos como administrador o médico.'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-2">
              Tipo de Imagen / Enfermedad *
            </label>
            <div className="w-full bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white">
              {imageType || 'Se detectara automaticamente al diagnosticar'}
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-2">
              Descripcion (Opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripcion o sintomas del paciente..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-cyan-500/50 focus:outline-none transition-colors h-20 resize-none"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-2">
              Imagen Medica *
            </label>
            <div className="border-2 border-dashed border-white/[0.08] rounded-xl p-6 text-center hover:border-cyan-500/30 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto text-slate-600 mb-3" />
                <p className="text-xs text-slate-400">
                  {file ? file.name : 'Arrastre una imagen o haga clic para seleccionar'}
                </p>
                <p className="text-[10px] text-slate-600 mt-1">
                  JPG, PNG, BMP, TIFF (Max. 10MB)
                </p>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleUpload}
              disabled={!file || !selectedPatient || uploading || diagnosing}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/20"
            >
              {uploading || diagnosing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{uploading ? 'Subiendo...' : 'Diagnosticando...'}</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Subir y Diagnosticar</span>
                </>
              )}
            </button>
            {(file || diagnosisResult) && (
              <button
                onClick={handleReset}
                disabled={uploading || diagnosing}
                className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-slate-400 text-sm font-semibold transition-colors"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-xl p-6 border border-white/[0.06]">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Image className="w-4 h-4 text-cyan-400" />
              Vista Previa
            </h3>
            {preview ? (
              <div className="space-y-3">
                <img
                  src={preview}
                  alt="Vista previa"
                  className="w-full h-56 object-contain rounded-lg bg-slate-800/50"
                />
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-white/[0.03]">
                    <span className="text-slate-500 block">Archivo</span>
                    <span className="text-white font-medium truncate block">{file?.name}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.03]">
                    <span className="text-slate-500 block">Tamano</span>
                    <span className="text-white font-medium">{(file?.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.03]">
                    <span className="text-slate-500 block">Clase</span>
                    <span className="text-cyan-400 font-medium">{imageType || 'Por diagnosticar'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-56 bg-slate-800/30 rounded-lg">
                <div className="text-center">
                  <Image className="w-12 h-12 mx-auto text-slate-700 mb-2" />
                  <p className="text-xs text-slate-600">No hay imagen seleccionada</p>
                </div>
              </div>
            )}
          </div>

          {diagnosisResult && (
            <div className="glass-card rounded-xl p-6 border border-white/[0.06] space-y-5 animate-slideUp">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-cyan-400" />
                Resultado del Diagnostico IA
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[10px] text-slate-500 uppercase block mb-1">Enfermedad Detectada</span>
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <Brain className="w-4 h-4 text-cyan-400" />
                    {diagnosisResult.disease}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[10px] text-slate-500 uppercase block mb-1">Probabilidad</span>
                  <span className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    {(diagnosisResult.probability * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[10px] text-slate-500 uppercase block mb-1">Nivel</span>
                  <span className={`text-sm font-bold px-2 py-0.5 rounded-full border inline-block ${getLevelColor(diagnosisResult.level)}`}>
                    {diagnosisResult.level}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[10px] text-slate-500 uppercase block mb-1">Confianza</span>
                  <span className={`text-sm font-bold ${getConfidenceColor(diagnosisResult.confidence)}`}>
                    {diagnosisResult.confidence}
                  </span>
                </div>
              </div>

              {diagnosisResult.probability && (
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block mb-2">
                    Nivel de Probabilidad
                  </span>
                  <div className="w-full h-3 bg-slate-800/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        diagnosisResult.probability > 0.75 ? 'bg-gradient-to-r from-red-500 to-red-400' :
                        diagnosisResult.probability > 0.5 ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
                        'bg-gradient-to-r from-emerald-500 to-emerald-400'
                      }`}
                      style={{ width: `${diagnosisResult.probability * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-600 mt-1">
                    <span>Bajo</span>
                    <span>Moderado</span>
                    <span>Alto</span>
                  </div>
                </div>
              )}

              {diagnosisResult.recommendations && (
                <div className="p-4 rounded-xl bg-cyan-500/[0.05] border border-cyan-500/10">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block mb-2 flex items-center gap-1.5">
                    <Heart className="w-3 h-3 text-cyan-400" />
                    Recomendaciones
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">{diagnosisResult.recommendations}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalUpload;
