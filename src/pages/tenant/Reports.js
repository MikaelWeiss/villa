import Nav from '../../components/nav/Nav.js';
import TenantMaintenanceList from "../../components/TenantMaintenanceList";
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { House, CreditCard, Wrench } from 'lucide-react';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';

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
        <div className="flex">
            {nav}
            <div className="ml-315 p-10 bg-background min-h-screen flex-1">
                <PageHeader
                    title="Maintenance"
                    actions={
                        <Button variant="danger" onClick={signOut}>
                            Sign Out
                        </Button>
                    }
                />
                {loading ? (
                    <p className="text-secondary-500">Loading...</p>
                ) : (
                    <TenantMaintenanceList tickets={formattedTickets} />
                )}
            </div>
        </div>
    )
}

export default TenantReports;
