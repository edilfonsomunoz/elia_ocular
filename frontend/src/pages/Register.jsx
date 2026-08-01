import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle, CheckCircle2, ArrowRight, UserCheck, Shield, CreditCard, Calendar, Users } from 'lucide-react';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('paciente');
  const [documentNumber, setDocumentNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Por favor completa todos los campos del formulario.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas ingresadas no coinciden.');
      return;
    }

    setIsSubmitting(true);
    const result = await register(
      fullName,
      email,
      password,
      role,
      role === 'paciente'
        ? {
            document_number: documentNumber,
            date_of_birth: dateOfBirth,
            gender: gender,
          }
        : {}
    );
    setIsSubmitting(false);

    if (result.success) {
      setSuccess('¡Cuenta creada exitosamente! Redirigiendo...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
    } else {
      setError(result.error);
    }
  };

  const passwordStrength = (pwd) => {
    if (!pwd) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { level: 1, label: 'Débil', color: 'bg-red-500' };
    if (score <= 3) return { level: 2, label: 'Media', color: 'bg-amber-500' };
    if (score <= 4) return { level: 3, label: 'Fuerte', color: 'bg-emerald-400' };
    return { level: 4, label: 'Muy fuerte', color: 'bg-emerald-400' };
  };

  const strength = passwordStrength(password);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="mesh-gradient" />
      <div className="noise-overlay" />

      <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-brand-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[420px] relative z-10 animate-scaleIn">
        
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="relative w-16 h-16 mx-auto mb-5">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-brand-500 opacity-20 blur-xl" />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-brand-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <UserCheck className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Crear una Cuenta</h1>
          <p className="text-sm text-slate-400 mt-1.5">
            Completa tus datos para registrarte en el sistema
          </p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8">
          
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/[0.08] border border-red-500/20 text-red-300 text-xs flex items-start space-x-3 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="flex-1 font-medium leading-relaxed">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-300 text-xs flex items-center space-x-3 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="flex-1 font-medium">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Role Selection */}
            <div className="animate-slideUp" style={{ animationDelay: '0s' }}>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-2">
                Tipo de Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Shield className="w-4 h-4" />
                </div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm outline-none appearance-none cursor-pointer"
                >
                  <option value="paciente">Paciente</option>
                  <option value="medico">Médico</option>
                </select>
              </div>
            </div>

            {/* Full Name */}
            <div className="animate-slideUp" style={{ animationDelay: '0.05s' }}>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-2">
                Nombre Completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Juan Pérez"
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="juan@ejemplo.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="animate-slideUp" style={{ animationDelay: '0.15s' }}>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Mínimo 6 caracteres"
                  className="w-full pl-10 pr-11 py-3 rounded-xl glass-input text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Strength Bar */}
              {password && (
                <div className="mt-2 flex items-center space-x-2 animate-fadeIn">
                  <div className="flex-1 flex space-x-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                          i <= strength.level ? strength.color : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">{strength.label}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Repite tu contraseña"
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm outline-none"
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-[11px] text-red-400 mt-1.5 animate-fadeIn">Las contraseñas no coinciden</p>
              )}
            </div>

            {/* Patient-only fields */}
            {role === 'paciente' && (
              <div className="space-y-4 animate-slideUp" style={{ animationDelay: '0.22s' }}>
                {/* Document Number */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-2">
                    Número de Documento *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={documentNumber}
                      onChange={(e) => setDocumentNumber(e.target.value)}
                      required
                      placeholder="Ej: 12345678"
                      className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm outline-none"
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-2">
                    Fecha de Nacimiento *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm outline-none"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-2">
                    Género *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Users className="w-4 h-4" />
                    </div>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm outline-none appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="text-slate-500">Seleccione su género</option>
                      <option value="M" className="text-slate-900">Masculino</option>
                      <option value="F" className="text-slate-900">Femenino</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="animate-slideUp" style={{ animationDelay: '0.25s' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-3 py-3 px-4 rounded-xl btn-primary text-white font-semibold text-sm flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Registrando...</span>
                  </>
                ) : (
                  <>
                    <span>Crear Cuenta</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
