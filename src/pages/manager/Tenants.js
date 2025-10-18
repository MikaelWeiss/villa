import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import Nav from '../../components/nav/Nav.js';
import styles from "./Reports.module.css";
import { Wrench, LayoutDashboard, Users } from "lucide-react";
import { useAuth } from '../../contexts/AuthContext';

function ManagerTenantsPage() {
    const { signOut } = useAuth();
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const fetchTenants = useCallback(async () => {
        try {
            // Get all unique tenants from reports
            const { data: reports, error: fetchError } = await supabase
                .from('reports')
                .select('tenant_id, tenant_name, unit, status')
                .order('tenant_name', { ascending: true });

            if (fetchError) throw fetchError;

            // Group reports by tenant and aggregate data
            const tenantMap = new Map();

            reports.forEach(report => {
                if (!tenantMap.has(report.tenant_id)) {
                    tenantMap.set(report.tenant_id, {
                        tenant_id: report.tenant_id,
                        tenant_name: report.tenant_name,
                        units: new Set(),
                        totalReports: 0,
                        openReports: 0
                    });
                }

                const tenant = tenantMap.get(report.tenant_id);
                tenant.units.add(report.unit);
                tenant.totalReports += 1;
                if (report.status === 'open') {
                    tenant.openReports += 1;
                }
            });

            // Convert to array and format units
            const formattedTenants = Array.from(tenantMap.values()).map(tenant => ({
                ...tenant,
                units: Array.from(tenant.units).join(', ')
            }));

            setTenants(formattedTenants);
            setLoading(false);
        } catch (err) {
            setError('Failed to load tenants');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        document.title = 'Tenants - Villa';
        fetchTenants();

        // Set up real-time subscription to refresh when reports change
        const channel = supabase
            .channel('tenants-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'reports'
                },
                () => {
                    // Refresh tenants list when reports change
                    fetchTenants();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchTenants])

    if (loading) {
        return (
            <div className={styles.container}>
                {nav}
                <div className={styles.content}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Tenants</h1>
                        <button className={styles.signOutBtn} onClick={signOut}>
                            Sign Out
                        </button>
                    </div>
                    <div className={styles.maintenanceContainer}>
                        <p>Loading tenants...</p>
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
                        <h1 className={styles.title}>Tenants</h1>
                        <button className={styles.signOutBtn} onClick={signOut}>
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
                    <h1 className={styles.title}>Tenants</h1>
                    <button className={styles.signOutBtn} onClick={signOut}>
                        Sign Out
                    </button>
                </div>
                <div className={styles.maintenanceContainer}>
                    {tenants.length === 0 ? (
                        <p>No tenants found.</p>
                    ) : (
                        <div style={{ width: '100%' }}>
                            <table style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                            }}>
                                <thead>
                                    <tr style={{
                                        backgroundColor: '#f5f7fa',
                                        borderBottom: '2px solid #e5e7eb'
                                    }}>
                                        <th style={{
                                            padding: '1rem',
                                            textAlign: 'left',
                                            fontWeight: '600',
                                            color: '#333'
                                        }}>
                                            Tenant Name
                                        </th>
                                        <th style={{
                                            padding: '1rem',
                                            textAlign: 'left',
                                            fontWeight: '600',
                                            color: '#333'
                                        }}>
                                            Units
                                        </th>
                                        <th style={{
                                            padding: '1rem',
                                            textAlign: 'center',
                                            fontWeight: '600',
                                            color: '#333'
                                        }}>
                                            Open Reports
                                        </th>
                                        <th style={{
                                            padding: '1rem',
                                            textAlign: 'center',
                                            fontWeight: '600',
                                            color: '#333'
                                        }}>
                                            Total Reports
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tenants.map((tenant, index) => (
                                        <tr key={tenant.tenant_id} style={{
                                            borderBottom: index !== tenants.length - 1 ? '1px solid #e5e7eb' : 'none',
                                            backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafbfc'
                                        }}>
                                            <td style={{
                                                padding: '1rem',
                                                color: '#333'
                                            }}>
                                                {tenant.tenant_name || 'Unknown'}
                                            </td>
                                            <td style={{
                                                padding: '1rem',
                                                color: '#666'
                                            }}>
                                                {tenant.units}
                                            </td>
                                            <td style={{
                                                padding: '1rem',
                                                textAlign: 'center',
                                                color: tenant.openReports > 0 ? '#d32f2f' : '#4caf50'
                                            }}>
                                                <span style={{
                                                    display: 'inline-block',
                                                    padding: '0.25rem 0.75rem',
                                                    backgroundColor: tenant.openReports > 0 ? '#ffe5e5' : '#e8f5e9',
                                                    borderRadius: '20px',
                                                    fontWeight: '600'
                                                }}>
                                                    {tenant.openReports}
                                                </span>
                                            </td>
                                            <td style={{
                                                padding: '1rem',
                                                textAlign: 'center',
                                                color: '#666'
                                            }}>
                                                {tenant.totalReports}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ManagerTenantsPage;
