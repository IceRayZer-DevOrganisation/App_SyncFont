import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getUser, signOut } from '../services/supabaseService';

interface UserContextType {
  user: any;
  loading: boolean;
  refreshUser: () => void;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    setLoading(true);
    const { data } = await getUser();
    setUser(data?.user || null);
    setLoading(false);
  };

  useEffect(() => {
    refreshUser();
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      refreshUser();
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await signOut();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, refreshUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser doit être utilisé dans UserProvider');
  return context;
}; 