import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Upload, BarChart3, Brain, Target, 
  FileText, Image, Activity, ChevronLeft, ChevronRight, Eye,
  Users, Stethoscope, Heart, ClipboardCheck
} from 'lucide-react';

const analysisSidebarItems = [
  { path: '/analisis-ocular', icon: LayoutDashboard, label: 'Vista General', end: true },
  { path: '/analisis-ocular/subir-datos', icon: Upload, label: 'Subir Dataset' },
  { path: '/analisis-ocular/distribucion', icon: BarChart3, label: 'Distribución de Clases' },
  { path: '/analisis-ocular/imagenes', icon: Image, label: 'Imágenes de Ejemplo' },
  { path: '/analisis-ocular/entrenamiento', icon: Brain, label: 'Entrenamiento CNN' },
  { path: '/analisis-ocular/evaluacion', icon: Activity, label: 'Evaluación del Modelo' },
  { path: '/analisis-ocular/matriz-confusion', icon: Target, label: 'Matriz de Confusión' },
  { path: '/analisis-ocular/reporte', icon: FileText, label: 'Reporte de Clasificación' },
  { path: '/analisis-ocular/predicciones', icon: Activity, label: 'Predicciones' },
];

const medicalSidebarItems = [
  { path: '/medical', icon: LayoutDashboard, label: 'Panel Médico', end: true },
  { path: '/medical/upload', icon: Upload, label: 'Subir Imagen' },
  { path: '/medical/results', icon: ClipboardCheck, label: 'Resultados' },
  { path: '/medical/patients', icon: Users, label: 'Pacientes' },
  { path: '/medical/doctors', icon: Stethoscope, label: 'Médicos' },
];

const PlantLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const isMedicalRoute = location.pathname.startsWith('/medical');
  const currentSidebarItems = isMedicalRoute ? medicalSidebarItems : analysisSidebarItems;
  const sidebarTitle = isMedicalRoute ? 'Diagnóstico Médico' : 'Análisis Ocular';
  const sidebarSubtitle = isMedicalRoute ? 'Gestión de Pacientes' : 'CNN - Enfermedades Oculares';
  const SidebarIcon = isMedicalRoute ? Heart : Eye;

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-slate-900/60 border-r border-white/[0.06] flex flex-col sticky top-16 h-[calc(100vh-4rem)] z-40`}>
        
        {/* Header */}
        <div className={`p-4 border-b border-white/[0.06] flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg ${
            isMedicalRoute 
              ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20' 
              : 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/20'
          }`}>
            <SidebarIcon className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h2 className="text-xs font-bold text-white whitespace-nowrap">{sidebarTitle}</h2>
              <p className={`text-[9px] whitespace-nowrap ${
                isMedicalRoute ? 'text-emerald-400/70' : 'text-cyan-400/70'
              }`}>{sidebarSubtitle}</p>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto">
          {currentSidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 group
                  ${collapsed ? 'justify-center' : ''}
                  ${isActive 
                    ? isMedicalRoute
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'}`
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-3 border-t border-white/[0.06] flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default PlantLayout;
