
import React, { createContext, useContext } from 'react';
import { UserProfile, AuthContextType } from '@/types/auth';
import { toast } from 'sonner';

// Create a default user for development
const defaultDevUser: UserProfile = {
  id: null,
  first_name: 'Developer',
  last_name: 'User',
  role: 'admin',
  created_at: new Date().toISOString(),
};

// Create a default session for development
const defaultDevSession = {
  access_token: 'fake-token',
  refresh_token: 'fake-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: {
    id: 'dev-user-id',
    email: 'dev@gmail.com',
  }
};

const AuthContext = createContext<AuthContextType>({
  user: defaultDevUser,
  session: defaultDevSession,
  loading: false,
  error: null,
  signIn: async () => ({ data: null, error: null }),
  signUp: async () => ({ data: null, error: null }),
  signOut: async () => ({ error: null }),
  requestPasswordReset: async () => ({ error: null }),
  updatePassword: async () => ({ error: null }),
  clearError: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mock authentication functions for development
  const signIn = async () => {
    toast.success('Login realizado com sucesso! (modo desenvolvimento)');
    return { data: defaultDevSession, error: null };
  };

  const signUp = async () => {
    toast.success('Conta criada com sucesso! (modo desenvolvimento)');
    return { data: defaultDevSession, error: null };
  };

  const signOut = async () => {
    toast.info('Logout realizado (modo desenvolvimento)');
    return { error: null };
  };

  const requestPasswordReset = async () => {
    toast.success('Instruções de recuperação de senha enviadas! (modo desenvolvimento)');
    return { error: null };
  };

  const updatePassword = async () => {
    toast.success('Senha atualizada com sucesso! (modo desenvolvimento)');
    return { error: null };
  };

  const clearError = () => {};

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
    user: defaultDevUser,
    session: defaultDevSession,
    loading: false,
    error: null,
    isLoading: false,
    signIn,
    signUp,
    signOut,
    updateProfile,
    updateUserRole,
    getUsers,
    requestPasswordReset,
    updatePassword,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
