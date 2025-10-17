import React from 'react';
import { supabase } from './supabase';

const AuthContext = React.createContext({
  user: null,
  userRole: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOutUser: async () => {},
});

// Function to check if user is a manager
const checkUserRole = async (supabaseUser) => {
  if (!supabaseUser) {
    return null;
  }

  try {
    // Use the is_manager RPC function to check if user is a manager
    const { data, error } = await supabase.rpc('is_manager', {
      user_email: supabaseUser.email
    });

    if (error) {
      console.error('Error checking user role:', error);
      return 'tenant'; // Default to tenant if there's an error
    }

    return data ? 'manager' : 'tenant';
  } catch (error) {
    console.error('Error checking user role:', error);
    return 'tenant'; // Default to tenant if there's an error
  }
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
        checkUserRole(session.user).then(setUserRole);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', session?.user ? 'User signed in' : 'User signed out');
      setUser(session?.user ?? null);

      if (session?.user) {
        const role = await checkUserRole(session.user);
        setUserRole(role);
        console.log('User role determined:', role);
      } else {
        setUserRole(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = React.useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      }
    });

    if (error) {
      console.error('Error signing in with Google:', error);
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

  const value = React.useMemo(() => ({ user, userRole, loading, signInWithGoogle, signOutUser }), [user, userRole, loading, signInWithGoogle, signOutUser]);

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


