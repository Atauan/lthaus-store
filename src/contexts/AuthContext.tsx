
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, AuthContextType, UserRole } from '@/types/auth';
import { toast } from 'sonner';

// Create a default user for development
const defaultDevUser: UserProfile = {
  id: 'dev-user-id',
  first_name: 'Developer',
  last_name: 'User',
  role: 'admin', // Give admin role for development
  created_at: new Date().toISOString(),
};

// Create a default session for development
const defaultDevSession = {
  user: {
    id: defaultDevUser.id,
    email: 'dev@example.com',
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
  // Use development user in development mode
  const [user, setUser] = useState<UserProfile | null>(defaultDevUser);
  const [session, setSession] = useState<any | null>(defaultDevSession);
  const [isLoading, setIsLoading] = useState(false); // Set to false immediately

  // Commented out the original authentication logic for now
  /*
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setIsLoading(true);
      
      if (session?.user?.id) {
        // Fetch the user profile when session changes
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (!error && data) {
          setUser(data as UserProfile);
        }
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    });

    // Initial session check
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (!error && data) {
          setUser(data as UserProfile);
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  */

  // Mock authentication functions for development
  const signIn = async (email: string, password: string) => {
    // Just return success for development
    toast.success('Login realizado com sucesso! (modo desenvolvimento)');
    return { error: null };
  };

  const signUp = async (email: string, password: string, userData?: Partial<UserProfile>) => {
    // Just return success for development
    toast.success('Conta criada com sucesso! (modo desenvolvimento)');
    return { error: null };
  };

  const signOut = async () => {
    // For development, just show a toast notification
    toast.info('Logout realizado (modo desenvolvimento)');
    // Don't actually sign out during development
    // setUser(null);
    // setSession(null);
  };

  const updateProfile = async (profile: Partial<UserProfile>) => {
    // Mock profile update
    setUser(prev => prev ? { ...prev, ...profile } : null);
    toast.success('Perfil atualizado com sucesso! (modo desenvolvimento)');
    return { error: null };
  };

  const updateUserRole = async (userId: string, role: UserRole) => {
    toast.success(`Função do usuário atualizada para ${role} (modo desenvolvimento)`);
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
