import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, tokenStore } from '../services/api.js';
import { isApiEnabled } from '../config/siteConfig.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(Boolean(tokenStore.get()) && isApiEnabled());

  useEffect(() => {
    if (!checking) return;
    api
      .me()
      .then((d) => setAdmin(d.admin))
      .catch(() => tokenStore.clear())
      .finally(() => setChecking(false));
  }, [checking]);

  useEffect(() => {
    const onUnauthorized = () => setAdmin(null);
    window.addEventListener('momentra:unauthorized', onUnauthorized);
    return () => window.removeEventListener('momentra:unauthorized', onUnauthorized);
  }, []);

  const login = useCallback(async (email, password) => {
    const d = await api.login(email, password);
    tokenStore.set(d.token);
    setAdmin(d.admin);
    return d.admin;
  }, []);

  const logout = useCallback(() => {
    tokenStore.clear();
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, checking, login, logout }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
