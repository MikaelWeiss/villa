import { useAuth } from '../authentication';
import Reports from '../reports/Reports';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user, signOutUser } = useAuth();
  
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="dashboard-title">Damage Reports</h1>
            <p className="welcome-text">Welcome back, {user?.displayName || user?.email}</p>
          </div>
          <div className="header-right">
            <button className="sign-out-btn" onClick={signOutUser}>
              Sign Out
            </button>
          </div>
        </div>
      </header>
      
      <main className="dashboard-main">
        <div className="dashboard-container">
          <Reports />
        </div>
      </main>
    </div>
  );
}
