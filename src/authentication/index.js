import React from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';

const AuthContext = React.createContext({
  user: null,
  userRole: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOutUser: async () => {},
});

// Function to check if user is a manager
const checkUserRole = async (firebaseUser) => {
  if (!firebaseUser) {
    return null;
  }

  try {
    // Check if user email exists in managers collection
    const managerDocRef = doc(db, 'managers', firebaseUser.email);
    const managerDoc = await getDoc(managerDocRef);
    
    if (managerDoc.exists()) {
      return 'manager';
    } else {
      return 'tenant';
    }
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
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser ? 'User signed in' : 'User signed out');
      setUser(firebaseUser);
      
      if (firebaseUser) {
        const role = await checkUserRole(firebaseUser);
        setUserRole(role);
        console.log('User role determined:', role);
      } else {
        setUserRole(null);
      }
      
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signInWithGoogle = React.useCallback(async () => {
    await signInWithPopup(auth, googleProvider);
  }, []);

  const signOutUser = React.useCallback(async () => {
    await signOut(auth);
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

export { db } from './firebase';


