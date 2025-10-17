import React from 'react';
import { supabase } from './supabase';

const AuthContext = React.createContext({
  user: null,
  userRole: null,
  loading: true,
  signInWithMagicLink: async () => {},
  signOutUser: async () => {},
});

// Function to check if user is a manager by querying the managers table directly
const checkUserRole = async (supabaseUser) => {
  if (!supabaseUser) {
    return null;
  }

  try {
    console.log('Checking role for user:', supabaseUser.email);

    // Add a timeout to prevent hanging forever
    const queryPromise = supabase
      .from('managers')
      .select('email')
      .eq('email', supabaseUser.email)
      .maybeSingle();

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Query timeout')), 5000)
    );

    const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

    if (error) {
      console.error('Error checking user role:', error);
      return 'tenant';
    }

    const role = data ? 'manager' : 'tenant';
    console.log('User role determined:', role);
    return role;
  } catch (error) {
    console.error('Error or timeout checking user role:', error);
    // Default to tenant if query fails
    return 'tenant';
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [userRole, setUserRole] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    let isProcessing = false;

    const processSession = async (session, source) => {
      if (!mounted || isProcessing) return;
      isProcessing = true;

      console.log('Processing session from:', source);

      if (session?.user) {
        setUser(session.user);
        const role = await checkUserRole(session.user);
        if (mounted) {
          setUserRole(role);
          console.log('User role:', role);
        }
      } else {
        setUser(null);
        setUserRole(null);
      }

      if (mounted) {
        setLoading(false);
      }

      isProcessing = false;
    };

    // Check current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      // Only process if we have a session, otherwise let onAuthStateChange handle it
      if (session) {
        processSession(session, 'getSession');
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('Auth event:', event, session?.user ? 'User signed in' : 'User signed out');

      // Process INITIAL_SESSION (most reliable for magic links) and SIGNED_OUT
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_OUT') {
        await processSession(session, event);
      }
      // For SIGNED_IN, only process if we don't already have a user (avoid duplicate)
      else if (event === 'SIGNED_IN' && !isProcessing) {
        await processSession(session, event);
      }
      // Ignore other events like TOKEN_REFRESHED
      else {
        console.log('Ignoring auth event:', event);
      }
    });

    return () => {
      mounted = false;
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


