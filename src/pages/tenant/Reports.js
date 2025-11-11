import Nav from '../../components/nav/Nav.js';
import TenantMaintenanceList from "../../components/TenantMaintenanceList";
import TicketDetailModal from "../../components/TicketDetailModal";
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
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const fetchReports = useCallback(async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('reports')
                .select('*')
                .eq('tenant_id', user.id);

            if (error) throw error;

            const statusPriority = {
                'open': 1,
                'in_progress': 2,
                'closed': 3,
                'cancelled': 4
            };

            const sortedData = (data || []).sort((a, b) => {
                const statusA = statusPriority[a.status] || 999;
                const statusB = statusPriority[b.status] || 999;

                if (statusA !== statusB) {
                    return statusA - statusB;
                }

                const dateA = new Date(a.updated_at || a.created_at);
                const dateB = new Date(b.updated_at || b.created_at);
                return dateB - dateA;
            });

            setReports(sortedData);
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

    useEffect(() => {
        if (!user) return;

        const statusPriority = {
            'open': 1,
            'in_progress': 2,
            'closed': 3,
            'cancelled': 4
        };

        const sortReports = (reports) => {
            return [...reports].sort((a, b) => {
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

        const channel = supabase
            .channel('tenant-reports-changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'reports',
                filter: `tenant_id=eq.${user.id}`
            }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setReports(prev => sortReports([payload.new, ...prev]));
                } else if (payload.eventType === 'UPDATE') {
                    setReports(prev => sortReports(prev.map(report =>
                        report.id === payload.new.id ? payload.new : report
                    )));
                } else if (payload.eventType === 'DELETE') {
                    setReports(prev => prev.filter(report => report.id !== payload.old.id));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

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
        description: report.description,
        image_urls: report.image_urls || [],
        status: report.status || 'open',
        created_at: report.created_at,
        updated_at: report.updated_at
    }));

    const handleTicketClick = (ticket) => {
        setSelectedTicket(ticket);
        setIsDetailModalOpen(true);
    };

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
                    <TenantMaintenanceList 
                        tickets={formattedTickets} 
                        onTicketClick={handleTicketClick}
                    />
                )}
            </div>
            
            {/* Ticket Detail Modal */}
            <TicketDetailModal 
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setSelectedTicket(null);
                }}
                ticket={selectedTicket}
            />
        </div>
    )
}

export default TenantReports;
