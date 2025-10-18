import Nav from '../../components/nav/Nav.js';
import styles from "./Reports.module.css";
import { useAuth } from '../../contexts/AuthContext';
import { Wrench, LayoutDashboard, Users } from "lucide-react";

function ManagerDashboard() {
    const { signOut } = useAuth();

    const nav = (
        <Nav navElements={[
            {
                name: "Dashboard",
                id: crypto.randomUUID(),
                icon: <LayoutDashboard size={20} />,
                path: "/manager/dashboard",
            },
            {
                name: "Tenants",
                id: crypto.randomUUID(),
                icon: <Users size={20} />,
                path: "/manager/tenants",
            },
            {
                name: "Maintenance",
                id: crypto.randomUUID(),
                icon: <Wrench size={20} />,
                path: "/manager/reports"
            }
        ]}
        />)

    return (
        <div className={styles.container}>
            {nav}
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Manager Dashboard</h1>
                    <button className={styles.signOutBtn} onClick={signOut}>
                        Sign Out
                    </button>
                </div>
                <div style={{ padding: 24 }}>
                    <p style={{ marginTop: 8 }}>Welcome back. Choose a section from the navigation.</p>
                </div>
            </div>
        </div>
    );
}

export default ManagerDashboard;
