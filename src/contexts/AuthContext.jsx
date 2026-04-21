import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { validateCredentials } from '../utils/demoAccounts';

const AuthContext = createContext();

const STORAGE_KEY = 'iot-rfid-auth';

function loadStoredSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.user && parsed?.isLoggedIn) {
      return parsed.user;
    }
  } catch (_) {
    localStorage.removeItem(STORAGE_KEY);
  }
  return null;
}

function saveSession(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, isLoggedIn: true }));
}

function clearStoredSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadStoredSession();
    if (stored) {
      setUser(stored);
      setIsLoggedIn(true);
    }
    setHydrated(true);
  }, []);

  const login = useCallback((username, password, rememberMe = true) => {
    const account = validateCredentials(username, password);

    if (account) {
      const nextUser = {
        id: account.id,
        username: account.username,
        email: account.email,
        avatar: account.avatar,
        role: account.role,
        createdAt: new Date().toLocaleDateString('vi-VN'),
      };
      setUser(nextUser);
      setIsLoggedIn(true);
      if (rememberMe) {
        saveSession(nextUser);
      } else {
        clearStoredSession();
      }
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    clearStoredSession();
  }, []);

  const updateProfile = useCallback((updatedData) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedData };
      try {
        if (localStorage.getItem(STORAGE_KEY)) {
          saveSession(next);
        }
      } catch (_) {}
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, hydrated, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
