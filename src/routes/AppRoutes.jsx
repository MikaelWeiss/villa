import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../authentication';
import SignInPage from '../pages/SignInPage';
import DashboardPage from '../pages/DashboardPage';
import TenantDashboard from "../pages/tenant/TenantDashboard";
import TenantPayments from "../pages/tenant/TenantPayments";
import TenantMaintenance from "../pages/tenant/TenantMaintenance";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/signin" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route 
          path="/signin" 
          element={
            <PublicRoute>
              <SignInPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
          <Route 
          path="/tenantDashboard" 
          element={
            <ProtectedRoute>
              <TenantDashboard />
            </ProtectedRoute>
          } 
        />
          <Route
              path="/tenantPayments"
              element={
                  <ProtectedRoute>
                      <TenantPayments />
                  </ProtectedRoute>
              }
          />
          <Route
              path="/tenantMaintenance"
              element={
                  <ProtectedRoute>
                      <TenantMaintenance />
                  </ProtectedRoute>
              }
          />
      </Routes>
    </BrowserRouter>
  );
}
