
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, AuthContextType, UserRole } from '@/types/auth';
import { toast } from 'sonner';

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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData?: Partial<UserProfile>) => {
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: userData || {},
        }
      });
      
      if (error) throw error;
      toast.success('Conta criada com sucesso! Verifique seu email.');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta');
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const updateProfile = async (profile: Partial<UserProfile>) => {
    try {
      if (!user?.id) throw new Error('Usuário não autenticado');
      
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update the local user state with the new profile data
      setUser(prev => prev ? { ...prev, ...profile } : null);
      toast.success('Perfil atualizado com sucesso!');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar perfil');
      return { error };
    }
  };

  // New function to update a user's role (admin only)
  const updateUserRole = async (userId: string, role: UserRole) => {
    try {
      if (!user?.role || user.role !== 'admin') {
        throw new Error('Permissão negada. Apenas administradores podem alterar funções.');
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast.success(`Função do usuário atualizada para ${role}`);
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar função do usuário');
      return { error };
    }
  };

  // New function to get all users (admin only)
  const getUsers = async () => {
    try {
      if (!user?.role || user.role !== 'admin') {
        throw new Error('Permissão negada. Apenas administradores podem visualizar todos os usuários.');
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return { data: data as UserProfile[], error: null };
    } catch (error: any) {
      toast.error(error.message || 'Erro ao buscar usuários');
      return { data: null, error };
    }
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
