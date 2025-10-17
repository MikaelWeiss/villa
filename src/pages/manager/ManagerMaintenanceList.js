import { useState, useEffect } from 'react';
import { supabase } from '../../authentication';
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
        // Initial fetch
        const fetchReports = async () => {
            try {
                const { data, error: fetchError } = await supabase
                    .from('reports')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (fetchError) throw fetchError;

                const fetchedTickets = data.map(report => ({
                    id: report.id,
                    title: report.description?.substring(0, 50) + '...' || 'No title',
                    date: report.created_at ? new Date(report.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    }) : 'Unknown date',
                    severity: report.severity || 'medium',
                    description: report.description || 'No description',
                    tenantName: report.tenant_name || 'Unknown tenant',
                    property: report.unit || 'Unknown unit',
                    unit: report.unit,
                    status: report.status || 'open'
                }));

                setTickets(fetchedTickets);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching maintenance requests:', err);
                setError('Failed to load maintenance requests');
                setLoading(false);
            }
        };

        fetchReports();

        // Helper function to transform report to ticket format
        const transformReportToTicket = (report) => ({
            id: report.id,
            title: report.description?.substring(0, 50) + '...' || 'No title',
            date: report.created_at ? new Date(report.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }) : 'Unknown date',
            severity: report.severity || 'medium',
            description: report.description || 'No description',
            tenantName: report.tenant_name || 'Unknown tenant',
            property: report.unit || 'Unknown unit',
            unit: report.unit,
            status: report.status || 'open'
        });

        // Set up real-time subscription
        const channel = supabase
            .channel('all-reports-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'reports'
                },
                (payload) => {
                    console.log('Report inserted:', payload.new);
                    const newTicket = transformReportToTicket(payload.new);
                    setTickets(prev => [newTicket, ...prev]);
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'reports'
                },
                (payload) => {
                    console.log('Report updated:', payload.new);
                    const updatedTicket = transformReportToTicket(payload.new);
                    setTickets(prev => prev.map(ticket =>
                        ticket.id === updatedTicket.id ? updatedTicket : ticket
                    ));
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'reports'
                },
                (payload) => {
                    console.log('Report deleted:', payload.old);
                    setTickets(prev => prev.filter(ticket => ticket.id !== payload.old.id));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
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
