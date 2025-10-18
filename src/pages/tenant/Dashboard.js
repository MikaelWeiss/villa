import Nav from '../../components/nav/Nav.js';
import TenantPreviewCard from "../../components/TenantPreviewCard";
import TenantMaintenanceList from "../../components/TenantMaintenanceList";
import NewTicketModal from "../../components/NewTicketModal";
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Wrench, House, CreditCard } from "lucide-react";
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import PageHeader from '../../components/ui/PageHeader';

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
            // Error fetching reports - fail silently and show empty state
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        document.title = 'Dashboard - Villa';
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

    const balanceContent = (
        <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-secondary-700">Balance</h3>
            <p className="text-3xl font-bold text-success">$0.00</p>
        </div>
    )

    // Transform reports data to match the UI component's expected format
    const formattedTickets = reports.map(report => ({
        id: report.id,
        title: `Unit ${report.unit}`,
        date: new Date(report.created_at).toLocaleDateString(),
        severity: report.severity || 'medium',
        description: report.description,
        image_urls: report.image_urls || []
    }));

    const maintenanceContent = (
        <Card>
            <Card.Header>
                <div className="flex items-center justify-between">
                    <Card.Title>Maintenance Requests</Card.Title>
                    <Button onClick={() => setIsOpen(true)}>
                        New Request
                    </Button>
                </div>
            </Card.Header>
            <Card.Content>
                {loading ? (
                    <p className="text-secondary-500">Loading...</p>
                ) : (
                    <TenantMaintenanceList tickets={formattedTickets} />
                )}
            </Card.Content>
        </Card>
    )

    return (
        <div className="flex">
            {nav}
            {isOpen && (<NewTicketModal setIsOpen={setIsOpen} onReportCreated={fetchReports} />)}
            <div className="ml-315 p-10 bg-background min-h-screen flex-1">
                <PageHeader
                    title="Dashboard"
                    actions={
                        <Button variant="danger" onClick={signOut}>
                            Sign Out
                        </Button>
                    }
                />
                <div className="mb-8">
                    <TenantPreviewCard
                        icon={<CreditCard size={130} />}
                        infoComponent={balanceContent}
                        buttons={[
                            { link: "/tenant/payments", text: "Pay Now" },
                            { link: "/tenant/payments", text: "History" }
                        ]}

                    />
                </div>
                {maintenanceContent}
            </div>
        </div>
    )
}

export default TenantDashboard;
