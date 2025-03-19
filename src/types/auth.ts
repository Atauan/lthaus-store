
import { Database } from "@/integrations/supabase/types";

// User profile type definition
export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Auth context type definition
export interface AuthContextType {
  user: UserProfile | null;
  session: any | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, userData?: Partial<UserProfile>) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<{ error: any | null }>;
}

// Auth user type based on the Supabase database
export type AuthUser = Database['public']['Tables']['profiles']['Row'];
