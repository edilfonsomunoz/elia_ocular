import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { registerApi } from '../../api/auth';
import { listDoctors } from '../../api/medical';
import { User, Mail, Lock, UserPlus, AlertCircle, CheckCircle2, CreditCard, Calendar, Users, Stethoscope, ArrowLeft, Phone, MapPin, FileText } from 'lucide-react';

const PatientCreate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const data = await listDoctors();
        setDoctors(data);
        const current = data.find(doc => doc.user_id === user?.id);
        if (current) setDoctorId(String(current.id));
      } catch (e) {
        console.error('Error al cargar doctores:', e);
      }
    };
    loadDoctors();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName.trim() || !email.trim() || !password.trim() || !documentNumber.trim() || !dateOfBirth || !gender) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsSubmitting(true);
    try {
      await registerApi({
        full_name: fullName,
        email: email,
        password: password,
        role: 'paciente',
        document_number: documentNumber,
        date_of_birth: dateOfBirth,
        gender: gender,
        phone: phone || null,
        address: address || null,
        medical_history: medicalHistory || null,
        doctor_id: doctorId ? Number(doctorId) : null,
      });
      setSuccess('Paciente creado exitosamente.');
      setTimeout(() => {
        navigate('/medical/patients');
      }, 1200);
    } catch (err) {
      const data = err.response?.data;
      let message = 'Error al crear el paciente. Verifica los datos.';
      if (data && typeof data.detail === 'string') {
        message = data.detail;
      } else if (Array.isArray(data?.detail)) {
        message = data.detail.map((d) => d.msg).join('. ');
      } else if (err.response?.status) {
        message = `Error del servidor (${err.response.status}). ${message}`;
      } else if (err.message) {
        message = err.message;
      }
      console.error('Error al crear paciente:', err);
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = "w-full bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:border-cyan-500/50 focus:outline-none transition-colors";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Nuevo Paciente</h1>
          <p className="text-slate-400">Registre la cuenta de un nuevo paciente</p>
        </div>
        <button
          onClick={() => navigate('/medical/patients')}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] text-slate-300 text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/[0.08] border border-red-500/20 text-red-300 text-xs flex items-start space-x-3">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <span className="flex-1">{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-300 text-xs flex items-center space-x-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="flex-1">{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 border border-white/[0.06] space-y-5 max-w-2xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-cyan-400" />
          Datos de la Cuenta
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Nombre Completo *</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Juan Pérez" className={inputCls} />
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Correo Electrónico *</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="juan@ejemplo.com" className={inputCls} />
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Contraseña *</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Mínimo 6 caracteres" className={inputCls} />
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Doctor que lo atenderá *</label>
            <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required className={inputCls}>
              <option value="" disabled className="bg-slate-800 text-white">Seleccione un doctor</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id} className="bg-slate-800 text-white">{doc.full_name} - {doc.specialty}</option>
              ))}
            </select>
          </div>
        </div>

        <h3 className="text-sm font-bold text-white flex items-center gap-2 pt-2 border-t border-white/[0.06]">
          <CreditCard className="w-4 h-4 text-cyan-400" />
          Datos del Paciente
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Número de Documento *</label>
            <input value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} required placeholder="Ej: 12345678" className={inputCls} />
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Fecha de Nacimiento *</label>
            <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required className={inputCls} />
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Género *</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} required className={inputCls}>
              <option value="" disabled className="bg-slate-800 text-white">Seleccione el género</option>
              <option value="M" className="bg-slate-800 text-white">Masculino</option>
              <option value="F" className="bg-slate-800 text-white">Femenino</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Teléfono</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="555-0000" className={inputCls} />
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Dirección</label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Dirección del paciente" className={inputCls} />
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Historial Médico</label>
            <textarea value={medicalHistory} onChange={(e) => setMedicalHistory(e.target.value)} placeholder="Antecedentes, alergias, etc." className={`${inputCls} h-10 resize-none`} />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Registrando...</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Crear Paciente</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PatientCreate;
