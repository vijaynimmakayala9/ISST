import React, { createContext, useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  clearSession,
  readSession,
  saveSession,
  sessionKey,
} from "./sessionManager";
export const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);
  const logout = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);
  const login = useCallback(async (email, password) => {
    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL || "http://31.97.228.17:4479"}/api/admin/login`,
      { email, password },
    );
    if (!data.token) throw Error("Login response has no token");
    const next = saveSession(data.token, data.admin);
    setSession(next);
    return next;
  }, []);
  useEffect(() => {
    const sync = (e) => {
      if (e.key === sessionKey || e.key === null) setSession(readSession());
    };
    const expired = () => logout();
    window.addEventListener("storage", sync);
    window.addEventListener("isst-session-expired", expired);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("isst-session-expired", expired);
    };
  }, [logout]);
  useEffect(() => {
    if (!session) return;
    const ms = session.expiresAt - Date.now();
    if (ms <= 0) {
      logout();
      return;
    }
    const timer = setTimeout(logout, Math.min(ms, 2147483647));
    const check = () => {
      if (!readSession()) logout();
    };
    window.addEventListener("focus", check);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", check);
    };
  }, [session, logout]);
  return (
    <AuthContext.Provider value={{ session, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
import { useContext } from "react";
export const useAuth = () => useContext(AuthContext);
