import React, { useState, useEffect } from 'react';
import { listDoctors } from '../../api/medical';
import { Stethoscope, Search } from 'lucide-react';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Médicos</h1>
        <p className="text-slate-400">{doctors.length} médicos registrados</p>
      </div>

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
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <Stethoscope className="w-5 h-5 text-indigo-400" />
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
    </div>
  );
};

export default DoctorList;