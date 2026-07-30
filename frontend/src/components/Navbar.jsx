import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  ShieldCheck, 
  LogOut, 
  User as UserIcon, 
  ChevronDown, 
  Settings, 
  Bell,
  LayoutDashboard,
  Eye,
  Activity,
  Sun,
  Moon,
  X
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-slate-950/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to={user ? "/dashboard" : "/login"} className="flex items-center space-x-3 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-500 flex items-center justify-center shadow-glow-brand group-hover:shadow-glow-lg transition-shadow duration-300">
              <ShieldCheck className="w-5 h-5 text-white" />
              <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                EliaOcular
              </span>
              <span className="text-[9px] text-brand-400/80 font-semibold tracking-[0.2em] uppercase -mt-0.5">
                Sistema de Diagnóstico Ocular
              </span>
            </div>
          </Link>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                {/* Nav Links */}
                <div className="hidden md:flex items-center space-x-1">
                  <Link
                    to="/dashboard"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                      ${location.pathname === '/dashboard' 
                        ? 'bg-white/[0.08] text-white border border-white/[0.08]' 
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'}`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Dashboard
                  </Link>
                  <Link
                    to="/analisis-ocular"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                      ${location.pathname.startsWith('/analisis-ocular') 
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'}`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Análisis Ocular
                  </Link>
                  <Link
                    to="/medical"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                      ${location.pathname.startsWith('/medical') 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'}`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    Diagnóstico Médico
                  </Link>
                </div>

                {/* Theme Switcher Button */}
                <button
                  onClick={toggleTheme}
                  title={theme === 'dark' ? "Cambiar a Vista Claro" : "Cambiar a Vista Oscuro"}
                  className="p-2 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-amber-400 hover:text-amber-300 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 text-xs font-medium"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span className="hidden sm:inline text-xs text-slate-300">Vista Claro</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-indigo-400" />
                      <span className="hidden sm:inline text-xs text-slate-700">Vista Oscuro</span>
                    </>
                  )}
                </button>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all duration-200 cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                      {getInitials(user.full_name)}
                    </div>
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-xs font-semibold text-slate-200 leading-tight max-w-[120px] truncate">
                        {user.full_name}
                      </span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 glass-card rounded-xl border border-white/[0.08] shadow-2xl overflow-hidden animate-scaleIn origin-top-right">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-brand-500/20">
                            {getInitials(user.full_name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{user.full_name}</p>
                            <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-1.5">
                        <button
                          onClick={toggleTheme}
                          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all text-xs font-medium cursor-pointer"
                        >
                          {theme === 'dark' ? (
                            <>
                              <Sun className="w-4 h-4 text-amber-400" />
                              <span>Cambiar a Vista Claro</span>
                            </>
                          ) : (
                            <>
                              <Moon className="w-4 h-4 text-indigo-400" />
                              <span>Cambiar a Vista Oscuro</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setDropdownOpen(false)}
                          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all text-xs font-medium cursor-pointer"
                        >
                          <UserIcon className="w-4 h-4 text-slate-500" />
                          <span>Mi Perfil</span>
                        </button>
                        <button
                          onClick={() => setDropdownOpen(false)}
                          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all text-xs font-medium cursor-pointer"
                        >
                          <Settings className="w-4 h-4 text-slate-500" />
                          <span>Configuración</span>
                        </button>
                        <button
                          onClick={() => setDropdownOpen(false)}
                          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all text-xs font-medium cursor-pointer"
                        >
                          <Bell className="w-4 h-4 text-slate-500" />
                          <span>Notificaciones</span>
                        </button>
                      </div>

                      {/* Logout */}
                      <div className="p-1.5 border-t border-white/[0.06]">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/[0.08] transition-all text-xs font-medium cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Cerrar Sesión</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                {/* Theme Switcher for Guests */}
                <button
                  onClick={toggleTheme}
                  title={theme === 'dark' ? "Cambiar a Vista Claro" : "Cambiar a Vista Oscuro"}
                  className="p-2 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-amber-400 hover:text-amber-300 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 text-xs font-medium"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span className="hidden sm:inline text-xs text-slate-300">Vista Claro</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-indigo-400" />
                      <span className="hidden sm:inline text-xs text-slate-700">Vista Oscuro</span>
                    </>
                  )}
                </button>

                <Link
                  to="/login"
                  className="text-xs font-medium text-slate-300 hover:text-white px-4 py-2 rounded-lg hover:bg-white/[0.04] transition-all duration-200"
                >
                  Ingresar
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-semibold text-white btn-primary px-4 py-2 rounded-lg"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
