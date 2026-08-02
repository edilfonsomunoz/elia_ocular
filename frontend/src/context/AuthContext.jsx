import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, getMeApi } from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const userData = await getMeApi();
          setUser(userData);
          setToken(storedToken);
        } catch (error) {
          console.error("Error al cargar la sesión inicial:", error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await loginApi({ email, password });
      const newToken = data.access_token;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);

      // Obtener datos del usuario recién autenticado
      const userData = await getMeApi();
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.detail || 'Error al iniciar sesión. Verifica tus credenciales.';
      return { success: false, error: message };
    }
  };

  const register = async (fullName, email, password, role = 'paciente', patientData = {}, doctorId = null) => {
    try {
      await registerApi({
        full_name: fullName,
        email: email,
        password: password,
        role: role,
        doctor_id: doctorId,
        ...patientData,
      });

      // Luego del registro exitoso, iniciar sesión automáticamente
      return await login(email, password);
    } catch (error) {
      const message = error.response?.data?.detail || 'Error al registrar el usuario. Intenta nuevamente.';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
