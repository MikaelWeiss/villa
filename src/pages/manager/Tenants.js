import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import Nav from '../../components/nav/Nav.js';
import { Wrench, LayoutDashboard, Users } from "lucide-react";
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';

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
            <div className="flex min-h-screen">
                {nav}
                <div className="ml-315 p-10 bg-background min-h-screen flex-1">
                    <PageHeader
                        title="Tenants"
                        actions={<Button variant="danger" onClick={signOut}>Sign Out</Button>}
                    />
                    <p className="text-secondary-600">Loading tenants...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex min-h-screen">
                {nav}
                <div className="ml-315 p-10 bg-background min-h-screen flex-1">
                    <PageHeader
                        title="Tenants"
                        actions={<Button variant="danger" onClick={signOut}>Sign Out</Button>}
                    />
                    <p className="text-error-600">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen">
            {nav}
            <div className="ml-315 p-10 bg-background min-h-screen flex-1">
                <PageHeader
                    title="Tenants"
                    actions={<Button variant="danger" onClick={signOut}>Sign Out</Button>}
                />
                {tenants.length === 0 ? (
                    <EmptyState
                        icon={<Users size={48} />}
                        title="No tenants found"
                        description="There are no tenants with maintenance requests at this time."
                    />
                ) : (
                    <div className="w-full">
                        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                            <thead>
                                <tr className="bg-secondary-50 border-b-2 border-secondary-200">
                                    <th className="p-4 text-left font-semibold text-secondary-800">
                                        Tenant Name
                                    </th>
                                    <th className="p-4 text-left font-semibold text-secondary-800">
                                        Units
                                    </th>
                                    <th className="p-4 text-center font-semibold text-secondary-800">
                                        Open Reports
                                    </th>
                                    <th className="p-4 text-center font-semibold text-secondary-800">
                                        Total Reports
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {tenants.map((tenant, index) => (
                                    <tr
                                        key={tenant.tenant_id}
                                        className={`border-b border-secondary-200 last:border-b-0 ${
                                            index % 2 === 0 ? 'bg-white' : 'bg-secondary-25'
                                        }`}
                                    >
                                        <td className="p-4 text-secondary-800">
                                            {tenant.tenant_name || 'Unknown'}
                                        </td>
                                        <td className="p-4 text-secondary-600">
                                            {tenant.units}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${
                                                tenant.openReports > 0
                                                    ? 'bg-error-100 text-error-700'
                                                    : 'bg-success-100 text-success-700'
                                            }`}>
                                                {tenant.openReports}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center text-secondary-600">
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
    )
}

export default ManagerTenantsPage;
