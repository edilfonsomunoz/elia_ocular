import React from 'react';
import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';
import { 
  Check, Eye, Upload, BarChart3, Brain, Target, 
  FileText, Activity, Image, Shield, ChevronRight,
  Users, Stethoscope, Heart
} from 'lucide-react';

const adminMenuItems = [
  { path: '/dashboard', icon: Eye, label: 'Inicio', end: true },
  { path: '/analisis-ocular/subir-datos', icon: Upload, label: 'Subir Dataset' },
  { path: '/analisis-ocular/distribucion', icon: BarChart3, label: 'Distribución de Clases' },
  { path: '/analisis-ocular/imagenes', icon: Image, label: 'Clases del Dataset' },
  { path: '/analisis-ocular/entrenamiento', icon: Brain, label: 'Entrenamiento CNN' },
  { path: '/analisis-ocular/evaluacion', icon: Activity, label: 'Evaluación del Modelo' },
  { path: '/analisis-ocular/matriz-confusion', icon: Target, label: 'Matriz de Confusión' },
  { path: '/analisis-ocular/reporte', icon: FileText, label: 'Reporte de Clasificación' },
  { path: '/analisis-ocular/predicciones', icon: Activity, label: 'Predicciones' },
  { path: '/medical/patients', icon: Users, label: 'Pacientes' },
  { path: '/medical/doctors', icon: Stethoscope, label: 'Médicos' },
  { path: '/medical/upload', icon: Upload, label: 'Subir Imagen' },
];

const doctorMenuItems = [
  { path: '/dashboard', icon: Eye, label: 'Inicio', end: true },
  { path: '/medical/patients', icon: Users, label: 'Pacientes' },
  { path: '/medical/upload', icon: Upload, label: 'Subir Imagen' },
  { path: '/medical/doctors', icon: Stethoscope, label: 'Médicos' },
];

const patientMenuItems = [
  { path: '/dashboard', icon: Eye, label: 'Inicio', end: true },
  { path: '/medical/upload', icon: Upload, label: 'Subir Imagen' },
];

const Dashboard = () => {
  const { user } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getMenuItems = () => {
    switch (user?.role) {
      case 'administrador':
        return adminMenuItems;
      case 'medico':
        return doctorMenuItems;
      case 'paciente':
        return patientMenuItems;
      default:
        return adminMenuItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      
      {/* Left Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-slate-900/60 border-r border-white/[0.06] sticky top-16 h-[calc(100vh-4rem)]">
        <div className="p-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">Panel de Control</h2>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            {user?.role === 'administrador' ? 'Administrador' : user?.role === 'medico' ? 'Médico' : 'Paciente'}
          </p>
        </div>
        <nav className="p-2 space-y-0.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 group
                  ${isActive 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'}`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 truncate">{item.label}</span>
                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
          
          {/* Logo */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
              <Eye className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
                Elia<span className="text-cyan-400">Ocular</span>
              </h1>
              <p className="text-sm text-slate-500">Sistema de Diagnóstico Ocular con Inteligencia Artificial</p>
            </div>
          </div>

          {/* Description */}
          <div className="glass-card rounded-2xl p-8 border border-white/[0.06]">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              ¿Qué es EliaOcular?
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              <strong className="text-white">EliaOcular</strong> es un sistema de diagnóstico de enfermedades oculares basado en 
              <strong className="text-cyan-400"> Redes Neuronales Convolucionales (CNN)</strong> con arquitectura 
              <strong className="text-indigo-400"> EfficientNetB0</strong> para la clasificación 
              automática de imágenes médicas oculares.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Permite subir imágenes médicas (retina, fondo de ojo, OCT, iris, conjuntiva) y genera diagnósticos 
              automáticos con nivel de probabilidad, confianza y recomendaciones clínicas.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Upload, title: 'Carga de Imágenes', desc: 'Imágenes médicas en múltiples formatos', color: 'cyan' },
              { icon: Brain, title: 'Redes CNN', desc: 'EfficientNetB0 entrenado desde cero', color: 'purple' },
              { icon: Target, title: 'Diagnóstico', desc: 'Probabilidad, nivel y confianza del diagnóstico', color: 'emerald' },
              { icon: Activity, title: 'Historial', desc: 'Seguimiento clínico y reportes PDF', color: 'amber' },
            ].map((f, i) => (
              <div key={i} className="glass-card-hover rounded-xl p-5 border border-white/[0.06]">
                <div className={`w-10 h-10 rounded-xl bg-${f.color}-500/10 flex items-center justify-center mb-3`}>
                  <f.icon className={`w-5 h-5 text-${f.color}-400`} />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{f.title}</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Tech */}
          <div className="glass-card rounded-xl p-6 border border-white/[0.06]">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-[0.15em] mb-3">Tecnologías</h3>
            <div className="flex flex-wrap gap-2">
              {['Python', 'FastAPI', 'TensorFlow', 'EfficientNetB0', 'OpenCV', 'MySQL', 'React', 'Tailwind CSS'].map((t) => (
                <span key={t} className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">{t}</span>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
