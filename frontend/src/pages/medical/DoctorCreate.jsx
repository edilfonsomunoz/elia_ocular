import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerApi } from '../../api/auth';
import { createDoctor } from '../../api/medical';
import { Stethoscope, AlertCircle, CheckCircle2, ArrowLeft, UserPlus, Lock, Mail, User, BadgeCheck, Building2, Briefcase } from 'lucide-react';

const DoctorCreate = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [hospital, setHospital] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputCls = "w-full bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:border-cyan-500/50 focus:outline-none transition-colors";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName.trim() || !email.trim() || !password.trim() || !licenseNumber.trim() || !specialty.trim()) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsSubmitting(true);
    try {
      const createdUser = await registerApi({
        full_name: fullName,
        email: email,
        password: password,
        role: 'medico',
      });
      await createDoctor({
        user_id: createdUser.id,
        license_number: licenseNumber,
        specialty: specialty,
        hospital: hospital || null,
        years_experience: yearsExperience ? Number(yearsExperience) : null,
        bio: bio || null,
      });
      setSuccess('Médico creado exitosamente.');
      setTimeout(() => {
        navigate('/medical/doctors');
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al crear el médico. Verifica los datos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Nuevo Médico</h1>
          <p className="text-slate-400">Cree la cuenta y perfil de un nuevo médico</p>
        </div>
        <button
          onClick={() => navigate('/medical/doctors')}
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
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Dr. Juan Pérez" className={`${inputCls} pl-10`} />
            </div>
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Correo Electrónico *</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="medico@ejemplo.com" className={`${inputCls} pl-10`} />
            </div>
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Contraseña *</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Mínimo 6 caracteres" className={`${inputCls} pl-10`} />
            </div>
          </div>
        </div>

        <h3 className="text-sm font-bold text-white flex items-center gap-2 pt-2 border-t border-white/[0.06]">
          <Stethoscope className="w-4 h-4 text-cyan-400" />
          Datos del Médico
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Licencia *</label>
            <div className="relative">
              <BadgeCheck className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
              <input value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} required placeholder="LIC-000" className={`${inputCls} pl-10`} />
            </div>
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Especialidad *</label>
            <div className="relative">
              <Briefcase className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
              <input value={specialty} onChange={(e) => setSpecialty(e.target.value)} required placeholder="Oftalmología" className={`${inputCls} pl-10`} />
            </div>
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Hospital</label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
              <input value={hospital} onChange={(e) => setHospital(e.target.value)} placeholder="Clínica EliaOcular" className={`${inputCls} pl-10`} />
            </div>
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Años de Experiencia</label>
            <input type="number" value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)} placeholder="10" className={inputCls} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Biografía</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Breve descripción del médico" className={`${inputCls} h-20 resize-none`} />
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
              <span>Crear Médico</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default DoctorCreate;
