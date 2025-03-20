
import React, { createContext, useContext, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, AuthContextType, UserRole } from '@/types/auth';
import { toast } from 'sonner';

// Create a default user for development with proper UUID format
const defaultDevUser: UserProfile = {
  id: '00000000-0000-0000-0000-000000000000', // Valid UUID format
  first_name: 'Developer',
  last_name: 'User',
  role: 'admin', // Give admin role for development
  created_at: new Date().toISOString(),
};

// Create a default session for development
const defaultDevSession = {
  user: {
    id: defaultDevUser.id,
    email: 'dev@gmail.com',
  }
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  updateProfile: async () => ({ error: null }),
  updateUserRole: async () => ({ error: null }),
  getUsers: async () => ({ data: null, error: null }),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always provide the development user - now that authentication is not required
  const [user] = useState<UserProfile | null>(defaultDevUser);
  const [session] = useState<any | null>(defaultDevSession);
  const [isLoading] = useState(false);

  // Mock authentication functions for development
  const signIn = async () => {
    toast.success('Login realizado com sucesso! (modo desenvolvimento)');
    return { error: null };
  };

  const signUp = async () => {
    toast.success('Conta criada com sucesso! (modo desenvolvimento)');
    return { error: null };
  };

  const signOut = async () => {
    toast.info('Logout realizado (modo desenvolvimento)');
  };

  const updateProfile = async () => {
    toast.success('Perfil atualizado com sucesso! (modo desenvolvimento)');
    return { error: null };
  };

  const updateUserRole = async () => {
    toast.success('Função do usuário atualizada (modo desenvolvimento)');
    return { error: null };
  };

  const getUsers = async () => {
    // Return a mock list of users for development
    const mockUsers: UserProfile[] = [
      defaultDevUser,
      {
        id: 'user-1',
        first_name: 'João',
        last_name: 'Silva',
        role: 'salesperson',
        created_at: new Date().toISOString(),
      },
      {
        id: 'user-2',
        first_name: 'Maria',
        last_name: 'Souza',
        role: 'manager',
        created_at: new Date().toISOString(),
      }
    ];
    
    return { data: mockUsers, error: null };
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    updateUserRole,
    getUsers,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
