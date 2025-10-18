import Nav from '../../components/nav/Nav.js';
import styles from "./Dashboard.module.css";
import { useAuth } from '../../contexts/AuthContext';

function TenantPayments() {
    const { signOut } = useAuth();

    const nav = (
        <Nav navElements={[
            {
                name: "Dashboard",
                id: crypto.randomUUID(),
                icon: <span role="img" aria-label="home">🏠</span>,
                path: "/tenant/dashboard",
            },
            {
                name: "Payments",
                id: crypto.randomUUID(),
                icon: <span role="img" aria-label="card">💳</span>,
                path: "/tenant/payments",
            },
            {
                name: "Maintenance",
                id: crypto.randomUUID(),
                icon: <span role="img" aria-label="wrench">🔧</span>,
                path: "/tenant/reports"
            }
        ]}
        />)

    return (
        <div className={styles.container}>
            {nav}
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Payments</h1>
                    <button className={styles.signOutBtn} onClick={signOut}>
                        Sign Out
                    </button>
                </div>
                <h2 style={{ color: 'black' }}>This is a payment page</h2>
            </div>
        </div>
    )
}

export default TenantPayments;
