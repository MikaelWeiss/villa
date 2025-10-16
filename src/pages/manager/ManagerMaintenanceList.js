import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../authentication/firebase';
import Nav from '../../components/nav/Nav.js';
import styles from "./ManagerMaintenanceList.module.css";
import ManagerMaintenanceList from "../../components/ManagerMaintenanceList";
import { Wrench, LayoutDashboard, Users } from "lucide-react";
import { useAuth } from '../../authentication';

function ManagerMaintenanceListPage() {
    const { signOutUser } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const nav =
        (<Nav navElements={[
            {
                name: "Dashboard",
                id: crypto.randomUUID(),
                icon: <LayoutDashboard size={20} />,
                path: "/managerDashboard",
            },
            {
                name: "Tenants",
                id: crypto.randomUUID(),
                icon: <Users size={20} />,
                path: "/managerTenants",
            },
            {
                name: "Maintenance",
                id: crypto.randomUUID(),
                icon: <Wrench size={20} />,
                path: "/managerMaintenance"
            }
        ]}
        />)

    useEffect(() => {
        const q = query(
            collection(db, 'reports'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const fetchedTickets = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        title: data.description?.substring(0, 50) + '...' || 'No title',
                        date: data.createdAt ? new Date(data.createdAt.toDate()).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        }) : 'Unknown date',
                        severity: data.severity || 'medium',
                        description: data.description || 'No description',
                        tenantName: data.tenantName || 'Unknown tenant',
                        property: data.unit || 'Unknown unit',
                        unit: data.unit,
                        status: data.status || 'open'
                    };
                });
                setTickets(fetchedTickets);
                setLoading(false);
            },
            (err) => {
                console.error('Error fetching maintenance requests:', err);
                setError('Failed to load maintenance requests');
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [])

    if (loading) {
        return (
            <div className={styles.container}>
                {nav}
                <div className={styles.content}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>All Maintenance Requests</h1>
                        <button className={styles.signOutBtn} onClick={signOutUser}>
                            Sign Out
                        </button>
                    </div>
                    <div className={styles.maintenanceContainer}>
                        <p>Loading maintenance requests...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className={styles.container}>
                {nav}
                <div className={styles.content}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>All Maintenance Requests</h1>
                        <button className={styles.signOutBtn} onClick={signOutUser}>
                            Sign Out
                        </button>
                    </div>
                    <div className={styles.maintenanceContainer}>
                        <p style={{ color: 'red' }}>{error}</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            {nav}
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1 className={styles.title}>All Maintenance Requests</h1>
                    <button className={styles.signOutBtn} onClick={signOutUser}>
                        Sign Out
                    </button>
                </div>
                <div className={styles.maintenanceContainer}>
                    {tickets.length === 0 ? (
                        <p>No maintenance requests found.</p>
                    ) : (
                        <ManagerMaintenanceList tickets={tickets} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ManagerMaintenanceListPage;
