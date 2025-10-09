import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../authentication';
import SignInPage from '../pages/SignInPage';
import TenantDashboard from "../pages/tenant/TenantDashboard";
import TenantPayments from "../pages/tenant/TenantPayments";
import TenantMaintenance from "../pages/tenant/TenantMaintenance";
import ManagerMaintenanceList from "../pages/manager/ManagerMaintenanceList";
import ManagerDashboard from "../pages/manager/ManagerDashboard";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/signin" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? <Navigate to="/tenantDashboard" replace /> : children;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/tenantDashboard" replace />} />
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SignInPage />
            </PublicRoute>
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
          <Route
              path="/managerMaintenance"
              element={
                  <ProtectedRoute>
                      <ManagerMaintenanceList />
                  </ProtectedRoute>
              }
          />
          <Route
              path="/managerPage"
              element={
                  <ProtectedRoute>
                      <ManagerDashboard />
                  </ProtectedRoute>
              }
          />
      </Routes>
    </BrowserRouter>
  );
}
