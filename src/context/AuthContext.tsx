import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile } from '../types';
import { api } from '../lib/api';

interface AuthContextType {
  user: Profile | null;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  register: (data: { email: string; full_name: string; role: 'candidate' | 'recruiter'; bio?: string }) => Promise<void>;
  switchRole: (role: 'candidate' | 'recruiter') => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const refreshUser = async () => {
    try {
      const data = await api.getMe();
      setUser(data.user);
    } catch (err) {
      console.warn('[Auth] Failed fetching current user session:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string) => {
    const res = await api.login(email);
    setUser(res.user);
    localStorage.setItem('pos_token', res.token);
    setIsAuthModalOpen(false);
  };

  const register = async (data: { email: string; full_name: string; role: 'candidate' | 'recruiter'; bio?: string }) => {
    const res = await api.register(data);
    setUser(res.user);
    localStorage.setItem('pos_token', 'user-' + res.user.id);
    setIsAuthModalOpen(false);
  };

  const switchRole = async (role: 'candidate' | 'recruiter') => {
    const res = await api.switchRole(role);
    setUser(res.user);
  };

  const logout = async () => {
    await api.logout();
    localStorage.removeItem('pos_token');
    await refreshUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        switchRole,
        logout,
        refreshUser,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
