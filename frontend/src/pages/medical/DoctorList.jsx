import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listDoctors, updateDoctor, deleteDoctor } from '../../api/medical';
import { useAuth } from '../../context/AuthContext';
import { Stethoscope, Search, Pencil, Trash2, X, Loader2, CheckCircle, AlertCircle, Plus } from 'lucide-react';

const DoctorList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const isAdmin = user?.role === 'administrador';

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const data = await listDoctors();
      setDoctors(data);
    } catch (error) {
      console.error('Error loading doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openEdit = (doctor) => {
    setEditingDoctor(doctor);
    setForm({
      license_number: doctor.license_number || '',
      specialty: doctor.specialty || '',
      hospital: doctor.hospital || '',
      years_experience: doctor.years_experience || '',
      bio: doctor.bio || '',
    });
    setMessage({ type: '', text: '' });
  };

  const closeEdit = () => {
    setEditingDoctor(null);
    setForm({});
  };

  const handleSave = async () => {
    if (!editingDoctor) return;
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await updateDoctor(editingDoctor.id, {
        license_number: form.license_number,
        specialty: form.specialty,
        hospital: form.hospital || null,
        years_experience: form.years_experience ? Number(form.years_experience) : null,
        bio: form.bio || null,
      });
      await loadDoctors();
      closeEdit();
      setMessage({ type: 'success', text: 'Médico actualizado correctamente' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.detail || 'Error al actualizar el médico' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    setMessage({ type: '', text: '' });
    try {
      await deleteDoctor(confirmDelete.id);
      await loadDoctors();
      setConfirmDelete(null);
      setMessage({ type: 'success', text: 'Médico eliminado correctamente' });
    } catch (error) {
      setConfirmDelete(null);
      setMessage({ type: 'error', text: error.response?.data?.detail || 'Error al eliminar el médico' });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Médicos</h1>
          <p className="text-slate-400">{doctors.length} médicos registrados</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => navigate('/medical/doctors/new')}
            className="btn-primary px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Médico</span>
          </button>
        )}
      </div>

      {message.text && (
        <div className={`p-3.5 rounded-xl text-xs flex items-center gap-3 ${
          message.type === 'error' ? 'bg-red-500/[0.08] border border-red-500/20 text-red-300' :
          'bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-300'
        }`}>
          {message.type === 'error' ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle className="w-4 h-4 flex-shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="glass-card p-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por nombre o especialidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full glass-input pl-10 pr-4 py-3 rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="glass-card p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{doctor.full_name}</h3>
                <p className="text-sm text-cyan-400">{doctor.specialty}</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <Stethoscope className="w-5 h-5 text-indigo-400" />
                </div>
                {isAdmin && (
                  <div className="flex space-x-1.5">
                    <button
                      onClick={() => openEdit(doctor)}
                      title="Editar"
                      className="p-2 rounded-lg bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(doctor)}
                      title="Eliminar"
                      className="p-2 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Licencia</span>
                <span className="text-white">{doctor.license_number}</span>
              </div>
              {doctor.hospital && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Hospital</span>
                  <span className="text-white">{doctor.hospital}</span>
                </div>
              )}
              {doctor.years_experience && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Experiencia</span>
                  <span className="text-white">{doctor.years_experience} años</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Registro</span>
                <span className="text-white">
                  {new Date(doctor.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {doctor.bio && (
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-300">{doctor.bio}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="glass-card p-6 text-center">
          <Stethoscope className="w-16 h-16 mx-auto text-slate-500 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">
            {searchTerm ? 'No se encontraron médicos' : 'No hay médicos'}
          </h2>
          <p className="text-slate-400">
            {searchTerm ? 'Intente con otros términos de búsqueda' : 'No hay médicos registrados en el sistema'}
          </p>
        </div>
      )}

      {editingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg glass-card rounded-xl border border-white/[0.08] p-6 space-y-4 animate-scaleIn">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Editar Médico</h2>
              <button onClick={closeEdit} className="p-2 rounded-lg hover:bg-white/[0.06] text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Nombre</label>
                <input value={editingDoctor.full_name} disabled className="w-full bg-slate-800/50 border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white opacity-60 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Licencia *</label>
                <input value={form.license_number} onChange={(e) => setForm({ ...form, license_number: e.target.value })} className="w-full bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:border-cyan-500/50 focus:outline-none" />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Especialidad *</label>
                <input value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} className="w-full bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:border-cyan-500/50 focus:outline-none" />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Hospital</label>
                <input value={form.hospital} onChange={(e) => setForm({ ...form, hospital: e.target.value })} className="w-full bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:border-cyan-500/50 focus:outline-none" />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Años de Experiencia</label>
                <input type="number" value={form.years_experience} onChange={(e) => setForm({ ...form, years_experience: e.target.value })} className="w-full bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:border-cyan-500/50 focus:outline-none" />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Biografía</label>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="w-full bg-slate-800 border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:border-cyan-500/50 focus:outline-none h-20 resize-none" />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                <span>Guardar</span>
              </button>
              <button onClick={closeEdit} className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-slate-400 text-sm font-semibold transition-colors">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm glass-card rounded-xl border border-white/[0.08] p-6 space-y-4 animate-scaleIn text-center">
            <div className="w-14 h-14 mx-auto rounded-xl bg-red-500/15 flex items-center justify-center">
              <Trash2 className="w-7 h-7 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Eliminar Médico</h2>
              <p className="text-sm text-slate-400 mt-1">¿Estás seguro de eliminar a <strong className="text-white">{confirmDelete.full_name}</strong>? Esta acción no se puede deshacer.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleDelete} disabled={deleting} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>Eliminar</span>
              </button>
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-slate-400 text-sm font-semibold transition-colors">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorList;
