import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Settings, 
  HelpCircle, 
  LogOut,
  ChevronDown,
  Shield,
  Palette,
  ShieldCheck,
  Fingerprint,
  Globe,
  FileText
} from 'lucide-react';

const UserPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expandedItem, setExpandedItem] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const menuOptions = [
    {
      id: 'profile',
      icon: User,
      label: 'Mi Perfil',
      description: 'Editar información personal',
      gradient: 'from-brand-500 to-brand-600',
      content: (
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03]">
            <span className="text-slate-500">Estado</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Activo
            </span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03]">
            <span className="text-slate-500">Rol</span>
            <span className="text-slate-300 font-medium">Usuario</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03]">
            <span className="text-slate-500">MFA</span>
            <span className="text-amber-400 font-medium">No configurado</span>
          </div>
        </div>
      )
    },
    {
      id: 'security',
      icon: Shield,
      label: 'Seguridad',
      description: 'Gestionar sesión y dispositivos',
      gradient: 'from-purple-500 to-indigo-500',
      content: (
        <div className="space-y-3 text-xs">
          <div className="p-2.5 rounded-lg bg-white/[0.03] flex items-center justify-between">
            <span className="text-slate-500">Sesiones activas</span>
            <span className="text-slate-300 font-semibold">1</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white/[0.03] flex items-center justify-between">
            <span className="text-slate-500">Último acceso</span>
            <span className="text-slate-300 font-medium">Ahora</span>
          </div>
          <button className="w-full p-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 transition-colors text-left flex items-center justify-between cursor-pointer">
            <span>Cerrar todas las sesiones</span>
            <Fingerprint className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    },
    {
      id: 'notifications',
      icon: Bell,
      label: 'Notificaciones',
      description: 'Configurar alertas y avisos',
      gradient: 'from-emerald-500 to-teal-500',
      content: (
        <div className="space-y-2.5 text-xs">
          {['Nuevos inicios de sesión', 'Cambios de contraseña', 'Actualizaciones del sistema'].map((item, i) => (
            <label key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] cursor-pointer hover:bg-white/[0.05] transition-colors">
              <span className="text-slate-400">{item}</span>
              <div className={`w-8 h-4.5 rounded-full relative transition-colors ${i < 2 ? 'bg-brand-500' : 'bg-slate-700'}`}>
                <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-transform ${i < 2 ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </div>
            </label>
          ))}
        </div>
      )
    },
    {
      id: 'appearance',
      icon: Palette,
      label: 'Apariencia',
      description: 'Personalizar tema visual',
      gradient: 'from-pink-500 to-rose-500',
      content: (
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-3 gap-2">
            {[
              { name: 'Sistema', active: true },
              { name: 'Claro', active: false },
              { name: 'Oscuro', active: false }
            ].map((theme) => (
              <button
                key={theme.name}
                className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                  theme.active
                    ? 'border-brand-500/50 bg-brand-500/10 text-brand-400'
                    : 'border-white/[0.06] bg-white/[0.02] text-slate-500 hover:text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <div className="w-6 h-6 rounded-md mx-auto mb-1.5 bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10" />
                <span className="font-medium">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'help',
      icon: HelpCircle,
      label: 'Ayuda y Soporte',
      description: 'Documentación y asistencia',
      gradient: 'from-sky-500 to-cyan-500',
      content: (
        <div className="space-y-2.5 text-xs">
          <a href="/docs" className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 transition-colors">
            <span>API Documentation</span>
            <Globe className="w-3.5 h-3.5" />
          </a>
          <a href="#" className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 transition-colors">
            <span>Guía de uso</span>
            <FileText className="w-3.5 h-3.5" />
          </a>
          <a href="#" className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 transition-colors">
            <span>Reportar problema</span>
            <HelpCircle className="w-3.5 h-3.5" />
          </a>
        </div>
      )
    }
  ];

  return (
    <div className="glass-card rounded-2xl border border-white/[0.06] overflow-hidden sticky top-24 animate-slideInRight">
      
      {/* User Profile Header */}
      <div className="p-5 bg-gradient-to-br from-white/[0.04] to-transparent relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-[50px] pointer-events-none" />
        <div className="flex items-center space-x-3.5 relative z-10">
          <div className="relative">
            <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-500 flex items-center justify-center text-white text-base font-bold shadow-lg shadow-brand-500/20">
              {getInitials(user?.full_name)}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-white truncate">{user?.full_name}</h3>
            <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                <ShieldCheck className="w-2.5 h-2.5" /> Verificado
              </span>
              <span className="text-[10px] text-slate-600 font-mono">#{user?.id}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-3 py-2 space-y-0.5">
        {menuOptions.map((option, index) => {
          const Icon = option.icon;
          const isExpanded = expandedItem === option.id;
          
          return (
            <div key={option.id} className="animate-slideUp" style={{ animationDelay: `${index * 0.05}s` }}>
              <button
                onClick={() => setExpandedItem(isExpanded ? null : option.id)}
                className={`w-full flex items-center space-x-3 p-2.5 rounded-xl transition-all duration-200 cursor-pointer group
                  ${isExpanded
                    ? 'bg-white/[0.06]'
                    : 'hover:bg-white/[0.04]'
                  }`}
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${option.gradient} flex items-center justify-center shadow-sm opacity-80 group-hover:opacity-100 transition-opacity`}>
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-[13px] font-semibold text-slate-200 group-hover:text-white block leading-tight">
                    {option.label}
                  </span>
                  <span className="text-[10px] text-slate-600 block leading-tight">
                    {option.description}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-600 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-slate-400' : ''}`} />
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="ml-11 mr-2 mb-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] animate-fadeIn">
                  {option.content}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Session Footer */}
      <div className="mx-3 mb-3 mt-1">
        <div className="h-px bg-white/[0.06] mb-3" />
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-red-500/[0.06] hover:bg-red-500/[0.12] text-red-400 hover:text-red-300 text-xs font-semibold border border-red-500/[0.08] transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default UserPanel;
