import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const applyTheme = (userData) => {
    if (!userData) return;
    const theme = userData.preferences?.theme;
    if (theme?.mode === 'light') {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
    }

    // Ensure the website's signature dark yellow / amber gold theme (#f59e0b) is applied
    const accent = (theme?.accent && theme.accent !== '#f83a26') ? theme.accent : '#f59e0b';
    document.documentElement.style.setProperty('--primary', accent);
    document.documentElement.style.setProperty('--primary-glow', `${accent}66`);
    if (accent === '#f59e0b') {
      document.documentElement.style.setProperty('--primary-light', '#fbbf24');
      document.documentElement.style.setProperty('--primary-dark', '#d97706');
    }
  };

  const loadUser = async () => {
    const token = localStorage.getItem('fitTrackToken');
    if (token) {
      try {
        const res = await fetch('http://localhost:5000/api/users/me', {
          headers: { 'x-auth-token': token }
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          localStorage.setItem('fitTrackUser', JSON.stringify(userData));
          applyTheme(userData);
        } else {
          localStorage.removeItem('fitTrackToken');
          localStorage.removeItem('fitTrackUser');
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to load user:', err);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('fitTrackUser', JSON.stringify(userData));
    applyTheme(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fitTrackUser');
    localStorage.removeItem('fitTrackToken');
    document.body.classList.remove('theme-light');
    document.documentElement.style.setProperty('--primary', '#f59e0b');
    document.documentElement.style.setProperty('--primary-glow', 'rgba(245, 158, 11, 0.4)');
  };

  const updateUser = (updated) => {
    const merged = { ...user, ...updated };
    setUser(merged);
    localStorage.setItem('fitTrackUser', JSON.stringify(merged));
    applyTheme(merged);
  };

  // Measurement unit conversion helpers
  const formatWeight = (kgVal) => {
    if (kgVal === undefined || kgVal === null) return '-';
    const isLbs = user?.preferences?.units?.weight === 'lbs';
    if (isLbs) {
      return `${(Number(kgVal) * 2.20462).toFixed(1)} lbs`;
    }
    return `${Number(kgVal)} kg`;
  };

  const formatLength = (cmVal) => {
    if (cmVal === undefined || cmVal === null) return '-';
    const isIn = user?.preferences?.units?.measurements === 'in';
    if (isIn) {
      return `${(Number(cmVal) / 2.54).toFixed(1)} in`;
    }
    return `${Number(cmVal)} cm`;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, refreshUser: loadUser, updateUser, formatWeight, formatLength }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
