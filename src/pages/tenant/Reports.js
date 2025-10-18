import Nav from '../../components/nav/Nav.js';
import styles from "./Dashboard.module.css";
import TenantMaintenanceList from "../../components/TenantMaintenanceList";
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { House, CreditCard, Wrench } from 'lucide-react';

function TenantReports() {
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
            // Error fetching reports - fail silently and show empty state
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        document.title = 'Maintenance - Villa';
        fetchReports();
    }, [fetchReports]);

    const nav = (
        <Nav navElements={[
            {
                name: "Dashboard",
                id: crypto.randomUUID(),
                icon: <House size={20} />,
                path: "/tenant/dashboard",
            },
            {
                name: "Payments",
                id: crypto.randomUUID(),
                icon: <CreditCard size={20} />,
                path: "/tenant/payments",
            },
            {
                name: "Maintenance",
                id: crypto.randomUUID(),
                icon: <Wrench size={20} />,
                path: "/tenant/reports"
            }
        ]}
        />)

    // Transform reports data to match the UI component's expected format
    const formattedTickets = reports.map(report => ({
        id: report.id,
        title: `Unit ${report.unit}`,
        date: new Date(report.created_at).toLocaleDateString(),
        severity: report.severity || 'medium',
        description: report.description
    }));

    return (
        <div className={styles.container}>
            {nav}
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Maintenance</h1>
                    <button className={styles.signOutBtn} onClick={signOut}>
                        Sign Out
                    </button>
                </div>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <TenantMaintenanceList tickets={formattedTickets} />
                )}
            </div>
        </div>
    )
}

export default TenantReports;
