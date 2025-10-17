import React from 'react';
import { supabase } from './supabase';

const AuthContext = React.createContext({
  user: null,
  userRole: null,
  loading: true,
  signInWithMagicLink: async () => {},
  signOutUser: async () => {},
});

// Function to get user role from JWT claims
const getUserRole = (supabaseUser) => {
  if (!supabaseUser) {
    return null;
  }

  // Read role from JWT custom claims (set by custom_access_token_hook)
  // This is instant and requires no database call
  const role = supabaseUser.user_metadata?.user_role;

  // Fallback to 'tenant' if role not found
  return role || 'tenant';
};

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [userRole, setUserRole] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        const role = getUserRole(session.user);
        setUserRole(role);
        console.log('User role from JWT:', role);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', session?.user ? 'User signed in' : 'User signed out');
      setUser(session?.user ?? null);

      if (session?.user) {
        const role = getUserRole(session.user);
        setUserRole(role);
        console.log('User role from JWT:', role);
      } else {
        setUserRole(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithMagicLink = React.useCallback(async (email) => {
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: window.location.origin,
      }
    });

    if (error) {
      console.error('Error sending magic link:', error);
      throw error;
    }
  }, []);

  const signOutUser = React.useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }, []);

  const value = React.useMemo(() => ({ user, userRole, loading, signInWithMagicLink, signOutUser }), [user, userRole, loading, signInWithMagicLink, signOutUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

export { supabase };


