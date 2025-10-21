import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../authentication';
import SignInPage from '../pages/SignInPage';
import TenantDashboard from "../pages/tenant/TenantDashboard";
import TenantPayments from "../pages/tenant/TenantPayments";
import TenantMaintenance from "../pages/tenant/TenantMaintenance";
import ManagerMaintenanceDetail from "../pages/manager/ManagerMaintenanceDetail";
import ManagerMaintenanceDetailMock from "../pages/manager/ManagerMaintenanceDetailMock";
import ManagerMaintenanceList from "../pages/manager/ManagerMaintenanceList";
import ManagerDashboard from '../pages/manager/ManagerDashboard';

function ProtectedRoute({ children }) {
  const { user, userRole, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/signin" replace />;
}

function PublicRoute({ children }) {
  const { user, userRole, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (user) {
    // Redirect based on user role
    const redirectPath = userRole === 'manager' ? '/managerPage' : '/tenantDashboard';
    return <Navigate to={redirectPath} replace />;
  }
  return children;
}

// Component to handle role-based routing from root path
function RoleBasedRedirect() {
  const { user, userRole, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/signin" replace />;
  
  const redirectPath = userRole === 'manager' ? '/managerPage' : '/tenantDashboard';
  return <Navigate to={redirectPath} replace />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleBasedRedirect />} />
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

          <Route
              path="/manager/maintenance/:id"
              element={
                  <ProtectedRoute>
                      <ManagerMaintenanceDetail />
                  </ProtectedRoute>
              }
          />
          <Route
              path="/mock/manager/maintenance"
              element={<ManagerMaintenanceDetailMock />}
          />
      </Routes>
    </BrowserRouter>
  );
}
