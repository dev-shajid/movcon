'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { mockUsers } from '@/data/mockData';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const login = (role: UserRole) => {
    setLoading(true);
    const foundUser = mockUsers.find(u => u.role === role);
    if (foundUser) {
      // Set cookie
      document.cookie = `mock_user_id=${foundUser.id}; path=/`;
      setUser(foundUser);
    }
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    document.cookie = 'mock_user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    router.push('/login');
  };

  useEffect(() => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('mock_user_id='));
    if (cookieValue) {
      const userId = cookieValue.split('=')[1];
      const foundUser = mockUsers.find(u => u.id === userId);
      if (foundUser) {
        setUser(foundUser);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <Skeleton className="w-16 h-16 rounded-md" />
    </div>;
  }
  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
