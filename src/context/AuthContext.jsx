import React, { createContext, useContext, useState, useCallback } from 'react';
import { loginUser as apiLoginUser } from '../api/authApi';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem('quizapp_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser); // { userId, username, role }
  const [token, setToken] = useState(() => localStorage.getItem('quizapp_token'));

  const login = useCallback(async (username, password) => {
    const data = await apiLoginUser({ username, password });
    // LoginResponse: { token, userId, username, role }
    const nextUser = { userId: data.userId, username: data.username, role: data.role };
    localStorage.setItem('quizapp_token', data.token);
    localStorage.setItem('quizapp_user', JSON.stringify(nextUser));
    setToken(data.token);
    setUser(nextUser);
    return nextUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('quizapp_token');
    localStorage.removeItem('quizapp_user');
    setToken(null);
    setUser(null);
  }, []);

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!token, isAdmin, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
