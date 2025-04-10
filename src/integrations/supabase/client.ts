
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { User } from '@supabase/supabase-js';

const SUPABASE_URL = "https://msqdjwwvcnyxptbqijqs.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zcWRqd3d2Y255eHB0YnFpanFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNzgxMTIsImV4cCI6MjA1OTY1NDExMn0.v5_4f1rE5Z8di3LhQ16ut2_icq7JS0gcMOmKToO-htU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Helper functions for auth
export const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });
  
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Define a type for the extended user with profile
export type UserWithProfile = User & {
  profile?: {
    id: string;
    name: string;
    email: string;
    role: 'customer' | 'vendor' | 'admin';
    created_at?: string;
    updated_at?: string;
  } | null;
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (user) {
    // Get the user profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    // Create a merged user object with profile
    const userWithProfile = {
      ...user,
      profile
    } as UserWithProfile;
    
    return { user: userWithProfile, error };
  }
  
  return { user, error };
};
