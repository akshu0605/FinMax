import { supabase } from './supabase';

interface User {
  id: string;
  email: string;
  name: string;
}

interface Session {
  user: User;
  access_token: string;
}

export const auth = {
  /** Register a new user with Supabase Auth */
  signUp: async (
    email: string,
    password: string,
    name: string,
  ): Promise<{ session: Session | null; error: string | null }> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) return { session: null, error: error.message };
    if (!data.session || !data.user) return { session: null, error: 'Failed to create session' };

    return {
      session: {
        user: { id: data.user.id, email: data.user.email || '', name: data.user.user_metadata?.name || '' },
        access_token: data.session.access_token,
      },
      error: null,
    };
  },

  /** Sign in with Supabase Auth */
  signIn: async (
    email: string,
    password: string,
  ): Promise<{ session: Session | null; error: string | null }> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { session: null, error: error.message };
    if (!data.session || !data.user) return { session: null, error: 'Invalid session' };

    return {
      session: {
        user: { id: data.user.id, email: data.user.email || '', name: data.user.user_metadata?.name || '' },
        access_token: data.session.access_token,
      },
      error: null,
    };
  },

  /** Restore Supabase Session */
  getSession: async (): Promise<{ session: Session | null; error: string | null }> => {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) return { session: null, error: error.message };
    if (!session || !session.user) return { session: null, error: null };

    return {
      session: {
        user: { id: session.user.id, email: session.user.email || '', name: session.user.user_metadata?.name || '' },
        access_token: session.access_token,
      },
      error: null,
    };
  },

  /** Sign in with Google OAuth via Supabase */
  signInWithGoogle: async (): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) return { error: error.message };
    return { error: null };
  },

  /** Sign out of Supabase */
  signOut: async (): Promise<void> => {
    await supabase.auth.signOut();
  },

  /** Returns current token based on Supabase session */
  getToken: async (): Promise<string | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  },
};
