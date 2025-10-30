import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import Nav from '../../components/nav/Nav.js';
import ManagerMaintenanceList from "../../components/ManagerMaintenanceList";
import {Wrench, LayoutDashboard, Users, Calendar} from "lucide-react";
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import Select from '../../components/ui/Select';

function ManagerMaintenanceListPage() {
    const { signOut } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dayRange, setDayRange] = useState(30);

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
        setLoading(true);
        try {
            let query = supabase.from('reports').select('*');

            if (dayRange > 0) {
                const startDate = new Date();
                if (dayRange === 1) {
                    startDate.setHours(0, 0, 0, 0);
                } else {
                    startDate.setDate(startDate.getDate() - dayRange);
                }
                query = query.gte('created_at', startDate.toISOString());
            }

            query = query.order('created_at', { ascending: false });

            const { data, error: fetchError } = await query;

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
        } catch (err) {
            setError('Failed to load maintenance requests');
        } finally {
            setLoading(false);
        }
    }, [dayRange]);

    useEffect(() => {
        document.title = 'Maintenance Reports - Villa';
        fetchReports();
    }, [fetchReports]);

    useEffect(() => {
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

        const channel = supabase
            .channel('all-reports-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    const newTicket = transformReportToTicket(payload.new);
                    setTickets(prev => [newTicket, ...prev]);
                } else if (payload.eventType === 'UPDATE') {
                    const updatedTicket = transformReportToTicket(payload.new);
                    setTickets(prev => prev.map(ticket =>
                        ticket.id === updatedTicket.id ? updatedTicket : ticket
                    ));
                } else if (payload.eventType === 'DELETE') {
                    setTickets(prev => prev.filter(ticket => ticket.id !== payload.old.id));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleDayRangeChange = (event) => {
        const value = parseInt(event.target.value, 10);
        setDayRange(value);
    };

    const dayRangeOptions = [
        { value: 1, label: 'Today' },
        { value: 7, label: 'Last 7 Days' },
        { value: 30, label: 'Last 30 Days' },
        { value: 90, label: 'Last 90 Days' },
        { value: 0, label: 'All Time' },
    ];

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
                    actions=
                        {<div className="flex items-center gap-4">
                            <Select value={dayRange} onChange={handleDayRangeChange}>
                                {dayRangeOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Select>
                            <Button variant="danger" onClick={signOut}>Sign Out</Button>
                        </div>}
                />
                {tickets.length === 0 ? (
                    <EmptyState
                        icon={<Wrench size={48} />}
                        title="No maintenance requests"
                        description="There are no maintenance requests for the selected period."
                    />
                ) : (
                    <ManagerMaintenanceList tickets={tickets} />
                )}
            </div>
        </div>
    )
}

export default ManagerMaintenanceListPage;
