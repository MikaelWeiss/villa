import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import Nav from '../../components/nav/Nav.js';
import ManagerMaintenanceList from "../../components/ManagerMaintenanceList";
import {Wrench, LayoutDashboard, Users, Shield} from "lucide-react";
import { useAuth } from '../../contexts/AuthContext';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import Select from '../../components/ui/Select';

function ManagerMaintenanceListPage() {
    const { profile, role } = useAuth();
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
            },
            ...(role === 'admin' ? [{
                name: "Admin Roles",
                id: crypto.randomUUID(),
                icon: <Shield size={20} />,
                path: "/admin/roles"
            }] : [])
        ]}
        />)

    const fetchReports = useCallback(async () => {
        if (role && !profile) return;
        setLoading(true);
        try {
            let query = supabase.from('reports').select('*, organization:organizations(name)');

            if (role === 'manager' && profile?.organization_ids) {
                query = query.in('organization_id', profile.organization_ids);
            }

            if (dayRange > 0) {
                const startDate = new Date();
                if (dayRange === 1) {
                    startDate.setHours(0, 0, 0, 0);
                } else {
                    startDate.setDate(startDate.getDate() - dayRange);
                }
                query = query.gte('created_at', startDate.toISOString());
            }

            const { data, error: fetchError } = await query;

            if (fetchError) throw fetchError;

            const statusPriority = {
                'open': 1,
                'in_progress': 2,
                'closed': 3,
                'cancelled': 4
            };

            const sortedData = data.sort((a, b) => {
                const statusA = statusPriority[a.status] || 999;
                const statusB = statusPriority[b.status] || 999;

                if (statusA !== statusB) {
                    return statusA - statusB;
                }

                const dateA = new Date(a.updated_at || a.created_at);
                const dateB = new Date(b.updated_at || b.created_at);
                return dateB - dateA;
            });

            const fetchedTickets = sortedData.map(report => ({
                id: report.id,
                title: report.title || 'No title',
                date: report.created_at ? new Date(report.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                }) : 'Unknown date',
                severity: report.severity || 'medium',
                description: report.description && report.description.length > 50
                    ? report.description.substring(0, 50) + '...'
                    : report.description || 'No description',
                tenantName: report.tenant_name || 'Unknown tenant',
                property: report.unit || 'Unknown unit',
                unit: report.unit,
                status: report.status || 'open',
                image_urls: report.image_urls || [],
                organizationName: report.organization?.name || 'Unknown Organization',
                created_at: report.created_at,
                updated_at: report.updated_at,
            }));

            setTickets(fetchedTickets);
        } catch (err) {
            setError('Failed to load maintenance requests');
        } finally {
            setLoading(false);
        }
    }, [dayRange, profile, role]);

    useEffect(() => {
        document.title = 'Maintenance Reports - Villa';
        fetchReports();
    }, [fetchReports]);

    useEffect(() => {
        const statusPriority = {
            'open': 1,
            'in_progress': 2,
            'closed': 3,
            'cancelled': 4
        };

        const sortTickets = (tickets) => {
            return [...tickets].sort((a, b) => {
                const statusA = statusPriority[a.status] || 999;
                const statusB = statusPriority[b.status] || 999;

                if (statusA !== statusB) {
                    return statusA - statusB;
                }

                const dateA = new Date(a.updated_at || a.created_at);
                const dateB = new Date(b.updated_at || b.created_at);
                return dateB - dateA;
            });
        };

        const transformReportToTicket = (report) => ({
            id: report.id,
            title: report.description && report.description.length > 50
                ? report.description.substring(0, 50) + '...'
                : report.description || 'No title',
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
            image_urls: report.image_urls || [],
            organizationName: report.organization?.name || 'Unknown Organization',
            created_at: report.created_at,
            updated_at: report.updated_at,
        });

        const channel = supabase
            .channel('all-reports-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, (payload) => {
                if (role === 'manager' && profile?.organization_ids && !profile.organization_ids.includes(payload.new.organization_id)) {
                    return;
                }

                if (payload.eventType === 'INSERT') {
                    const newTicket = transformReportToTicket(payload.new);
                    setTickets(prev => sortTickets([newTicket, ...prev]));
                } else if (payload.eventType === 'UPDATE') {
                    const updatedTicket = transformReportToTicket(payload.new);
                    setTickets(prev => sortTickets(prev.map(ticket =>
                        ticket.id === updatedTicket.id ? updatedTicket : ticket
                    )));
                } else if (payload.eventType === 'DELETE') {
                    setTickets(prev => prev.filter(ticket => ticket.id !== payload.old.id));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [profile, role]);

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

    const { loading: authLoading } = useAuth();

    if (loading || authLoading) {
        return (
            <div className="flex min-h-screen">
                {nav}
                <div className="ml-315 p-10 bg-background min-h-screen flex-1">
                    <PageHeader
                        title="All Maintenance Requests"
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
                    actions={
                        <Select value={dayRange} onChange={handleDayRangeChange}>
                            {dayRangeOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Select>
                    }
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