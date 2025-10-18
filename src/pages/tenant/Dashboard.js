import Nav from '../../components/nav/Nav.js';
import TenantPreviewCard from "../../components/TenantPreviewCard";
import styles from "./Dashboard.module.css";
import TenantMaintenanceList from "../../components/TenantMaintenanceList";
import NewTicketModal from "../../components/NewTicketModal";
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

function TenantDashboard() {
    const [isOpen, setIsOpen] = useState(false);
    const { signOut, user } = useAuth();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReports = useCallback(async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('reports')
                .select('*')
                .eq('tenant_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setReports(data || []);
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

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

    const balanceContent = (
        <div className={styles.textContainer}>
            <h3>Balance</h3>
            <p>$0.00</p>
        </div>
    )

    // Transform reports data to match the UI component's expected format
    const formattedTickets = reports.map(report => ({
        id: report.id,
        title: `Unit ${report.unit}`,
        date: new Date(report.created_at).toLocaleDateString(),
        severity: report.severity || 'medium',
        description: report.description
    }));

    const maintenanceContent = (
        <div className={styles.maintenanceContainer}>
            <div className={styles.maintenanceHeader}>
                <h2>Maintenance Requests</h2>
                <button
                    className={styles.button}
                    onClick={() => setIsOpen(true)}>
                    New Request
                </button>
            </div>
            <hr />
            {loading ? (
                <p>Loading...</p>
            ) : (
                <TenantMaintenanceList tickets={formattedTickets} />
            )}
        </div>
    )

    return (
        <div className={styles.container}>
            {nav}
            {isOpen && (<NewTicketModal setIsOpen={setIsOpen} />)}
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Dashboard</h1>
                    <button className={styles.signOutBtn} onClick={signOut}>
                        Sign Out
                    </button>
                </div>
                <div className={styles.cardContainer}>
                    <TenantPreviewCard
                        icon={<span style={{ fontSize: 100 }} role="img" aria-label="card">💳</span>}
                        infoComponent={balanceContent}
                        buttons={[
                            { link: "#", text: "Pay Now" },
                            { link: "#", text: "History" }
                        ]}

                    />
                </div>
                {maintenanceContent}
            </div>
        </div>
    )
}

export default TenantDashboard;
