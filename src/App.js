import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import RequestQuote from './pages/RequestQuote';
import TenantDashboard from './pages/tenant/Dashboard';
import TenantReports from './pages/tenant/Reports';
import TenantPayments from './pages/tenant/Payments';
import ManagerDashboard from './pages/manager/Dashboard';
import ManagerReports from './pages/manager/Reports';
import ManagerTenants from './pages/manager/Tenants';

// Component to handle role-based redirect from root
function RootRedirect() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Landing />;
  }

  // Redirect authenticated users to their dashboard
  const redirectPath = role === 'manager' ? '/manager/dashboard' : '/tenant/dashboard';
  return <Navigate to={redirectPath} replace />;
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/quote" element={<RequestQuote />} />

          {/* Tenant Routes */}
          <Route
            path="/tenant/dashboard"
            element={
              <ProtectedRoute requireRole="tenant">
                <TenantDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tenant/reports"
            element={
              <ProtectedRoute requireRole="tenant">
                <TenantReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tenant/payments"
            element={
              <ProtectedRoute requireRole="tenant">
                <TenantPayments />
              </ProtectedRoute>
            }
          />

          {/* Manager Routes */}
          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute requireRole="manager">
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/tenants"
            element={
              <ProtectedRoute requireRole="manager">
                <ManagerTenants />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/reports"
            element={
              <ProtectedRoute requireRole="manager">
                <ManagerReports />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
    </ErrorBoundary>
  );
}

export default App;
