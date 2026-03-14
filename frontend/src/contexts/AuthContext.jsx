import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/users/profile', { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
      }
    } catch (err) {
      console.log('Not authenticated');
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    checkAuth();
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:3000/api/auth/logout', { 
        method: 'POST', 
        credentials: 'include' 
      });
    } catch (err) {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

