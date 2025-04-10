
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, getCurrentUser, signIn, signUp, signOut, UserWithProfile } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextProps {
  user: UserWithProfile | null;
  profile: any | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserWithProfile | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsLoading(true);
        
        if (session?.user) {
          const { user: userData, error } = await getCurrentUser();
          
          if (userData) {
            setUser(userData as UserWithProfile);
            setProfile(userData.profile);
            
            // Save to localStorage for Navbar to access (temporary solution)
            localStorage.setItem('currentUser', JSON.stringify({
              ...userData.profile,
              id: userData.id,
              email: userData.email,
            }));
          }
        } else {
          setUser(null);
          setProfile(null);
          localStorage.removeItem('currentUser');
        }
        
        setIsLoading(false);
      }
    );

    // Initialize by getting current user
    const initializeAuth = async () => {
      const { user: userData, error } = await getCurrentUser();
      
      if (userData) {
        setUser(userData as UserWithProfile);
        setProfile(userData.profile);
        
        // Save to localStorage for Navbar to access (temporary solution)
        localStorage.setItem('currentUser', JSON.stringify({
          ...userData.profile,
          id: userData.id,
          email: userData.email,
        }));
      }
      
      setIsLoading(false);
    };

    initializeAuth();

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        toast.error(error.message);
        return { success: false, error: error.message };
      }
      
      toast.success('Signed in successfully');
      return { success: true };
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      return { success: false, error: error.message };
    }
  };

  const handleSignUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await signUp(email, password, name);
      
      if (error) {
        toast.error(error.message);
        return { success: false, error: error.message };
      }
      
      toast.success('Account created successfully. Please check your email to confirm your account.');
      return { success: true };
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      return { success: false, error: error.message };
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      
      if (error) {
        toast.error(error.message);
        return { success: false, error: error.message };
      }
      
      toast.success('Signed out successfully');
      return { success: true };
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut
      }}
    >
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
