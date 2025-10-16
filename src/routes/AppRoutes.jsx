import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../authentication';
import SignInPage from '../pages/SignInPage';
import TenantDashboard from "../pages/tenant/TenantDashboard";
import TenantPayments from "../pages/tenant/TenantPayments";
import TenantMaintenance from "../pages/tenant/TenantMaintenance";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import LandingPage from "../pages/LandingPage";
import RequestQuote from "../pages/RequestQuote";

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
  if (!user) return <LandingPage />;
  const redirectPath = userRole === 'manager' ? '/managerPage' : '/tenantDashboard';
  return <Navigate to={redirectPath} replace />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleBasedRedirect />} />
        <Route path="/quote" element={<PublicRoute><RequestQuote /></PublicRoute>} />
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
