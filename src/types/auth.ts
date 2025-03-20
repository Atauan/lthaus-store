
import { Session, User } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthState {
  session: Session | null;
  user: AuthUser | null;
  loading: boolean;
  error: Error | null;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, data: { firstName: string, lastName: string }) => Promise<void>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  clearError: () => void;
}

// Esta é uma interface temporária para representar o perfil do usuário
// já que não temos acesso ao tipo completo em Database
export interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  role?: string;
}

export type { Session, User };
