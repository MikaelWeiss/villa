import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import Nav from '../../components/nav/Nav.js';
import ManagerMaintenanceList from "../../components/ManagerMaintenanceList";
import { Wrench, LayoutDashboard, Users } from "lucide-react";
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';

function ManagerMaintenanceListPage() {
    const { signOut } = useAuth();
    const [tickets, setTickets] = useState([]);
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

    const fetchReports = useCallback(async () => {
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
                status: report.status || 'open',
                image_urls: report.image_urls || []
            }));

            setTickets(fetchedTickets);
            setLoading(false);
        } catch (err) {
            setError('Failed to load maintenance requests');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        document.title = 'Maintenance Reports - Villa';
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
            status: report.status || 'open',
            image_urls: report.image_urls || []
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
                    setTickets(prev => prev.filter(ticket => ticket.id !== payload.old.id));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchReports])

    if (loading) {
        return (
            <div className="flex min-h-screen">
                {nav}
                <div className="ml-315 p-10 bg-background min-h-screen flex-1">
                    <PageHeader
                        title="All Maintenance Requests"
                        actions={<Button variant="danger" onClick={signOut}>Sign Out</Button>}
                    />
                    <p className="text-secondary-600">Loading maintenance requests...</p>
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
                        title="All Maintenance Requests"
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
                    title="All Maintenance Requests"
                    actions={<Button variant="danger" onClick={signOut}>Sign Out</Button>}
                />
                {tickets.length === 0 ? (
                    <EmptyState
                        icon={<Wrench size={48} />}
                        title="No maintenance requests"
                        description="There are no maintenance requests at this time."
                    />
                ) : (
                    <ManagerMaintenanceList tickets={tickets} />
                )}
            </div>
        </div>
    )
}

export default ManagerMaintenanceListPage;
