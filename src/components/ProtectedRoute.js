import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children, requireRole }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (requireRole && role !== requireRole) {
    // Redirect to appropriate dashboard based on role
    return <Navigate to={role === 'manager' ? '/manager/dashboard' : '/tenant/dashboard'} replace />;
  }

  return children;
};
