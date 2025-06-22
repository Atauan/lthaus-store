import { Session, User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'manager' | 'salesperson';

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
  isDevMode: boolean;
  // Additional functions for UserManagement
  updateProfile?: (data: Partial<UserProfile>) => Promise<{error: any | null}>;
  updateUserRole?: (userId: string, role: UserRole) => Promise<{error: any | null}>;
  getUsers?: () => Promise<{data: UserProfile[] | null, error: any | null}>;
  isLoading?: boolean;
}

// Interface for user profile with created_at field
export interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  role?: UserRole;
  created_at?: string;
}

export type { Session, User };