import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('csas_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (username, password) => {
    const data = await apiFetch('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    
    setUser(data.user);
    localStorage.setItem('csas_user', JSON.stringify(data.user));
    localStorage.setItem('csas_access', data.access);
    localStorage.setItem('csas_refresh', data.refresh);
    return data.user;
  };

  const register = async (username, email, password, role) => {
    const data = await apiFetch('/auth/register/', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, role })
    });
    
    setUser(data.user);
    localStorage.setItem('csas_user', JSON.stringify(data.user));
    localStorage.setItem('csas_access', data.access);
    localStorage.setItem('csas_refresh', data.refresh);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('csas_user');
    localStorage.removeItem('csas_access');
    localStorage.removeItem('csas_refresh');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);