import Nav from '../../components/nav/Nav.js';
import TenantPreviewCard from "../../components/TenantPreviewCard";
import TenantMaintenanceList from "../../components/TenantMaintenanceList";
import NewTicketModal from "../../components/NewTicketModal";
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Wrench, House, CreditCard, Plus, DollarSign, Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import PageHeader from '../../components/ui/PageHeader';
import Badge from '../../components/ui/Badge';

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

    // Transform reports data to match the UI component's expected format
    const formattedTickets = reports.map(report => ({
        id: report.id,
        title: `Unit ${report.unit}`,
        date: new Date(report.created_at).toLocaleDateString(),
        severity: report.severity || 'medium',
        description: report.description,
        image_urls: report.image_urls || [],
        status: report.status || 'open'
    }));

    // Get recent reports (limit to 3)
    const recentReports = formattedTickets.slice(0, 3);

    // Calculate stats
    const openCount = reports.filter(r => r.status === 'open').length;
    const inProgressCount = reports.filter(r => r.status === 'in-progress').length;
    const resolvedCount = reports.filter(r => r.status === 'resolved').length;

    return (
        <div className="flex">
            {nav}
            {isOpen && (<NewTicketModal setIsOpen={setIsOpen} onReportCreated={fetchReports} />)}
            <div className="ml-315 p-10 bg-background min-h-screen flex-1">
                <PageHeader
                    title="Dashboard"
                    actions={
                        <div className="flex items-center gap-3">
                            <Button
                                variant="primary"
                                size="sm"
                                leftIcon={<Plus />}
                                onClick={() => setIsOpen(true)}
                            >
                                New Request
                            </Button>
                            <Button variant="danger" onClick={signOut} size="sm">
                                Sign Out
                            </Button>
                        </div>
                    }
                />

                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-secondary-900 mb-2">
                        Welcome back
                    </h2>
                    <p className="text-secondary-600">
                        Manage your apartment maintenance and payments
                    </p>
                </div>

                {/* Balance & Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Balance Card */}
                    <Card variant="elevated" className="bg-gradient-to-br from-success-500 to-success-600 text-white border-none shadow-xl">
                        <Card.Header>
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-success-100 text-sm mb-1">Current Balance</p>
                                    <h2 className="text-4xl font-bold text-white mb-4">$0.00</h2>
                                    <div className="flex items-center gap-2 text-sm text-success-100">
                                        <CheckCircle2 size={16} />
                                        <span>All caught up!</span>
                                    </div>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <DollarSign size={28} className="text-white" />
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Footer withBorder={false} className="mt-6 flex gap-3">
                            <Button
                                variant="secondary"
                                size="sm"
                                className="bg-white text-success-700 hover:bg-success-50"
                            >
                                Pay Now
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-white border-white/30 hover:bg-white/10"
                            >
                                View History
                            </Button>
                        </Card.Footer>
                    </Card>

                    {/* Maintenance Overview */}
                    <Card variant="elevated">
                        <Card.Header withBorder>
                            <Card.Title subtitle="Your maintenance requests">
                                Requests Overview
                            </Card.Title>
                        </Card.Header>
                        <Card.Content>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-error-100 flex items-center justify-center">
                                        <AlertCircle size={24} className="text-error-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-secondary-900">{openCount}</p>
                                    <p className="text-xs text-secondary-600 mt-1">Open</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-warning-100 flex items-center justify-center">
                                        <Clock size={24} className="text-warning-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-secondary-900">{inProgressCount}</p>
                                    <p className="text-xs text-secondary-600 mt-1">In Progress</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-success-100 flex items-center justify-center">
                                        <CheckCircle2 size={24} className="text-success-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-secondary-900">{resolvedCount}</p>
                                    <p className="text-xs text-secondary-600 mt-1">Resolved</p>
                                </div>
                            </div>
                        </Card.Content>
                        <Card.Footer withBorder={false}>
                            <Button
                                variant="ghost-secondary"
                                size="sm"
                                fullWidth
                                onClick={() => window.location.href = '/tenant/reports'}
                            >
                                View All Requests
                            </Button>
                        </Card.Footer>
                    </Card>
                </div>

                {/* Recent Maintenance Requests */}
                <Card variant="elevated">
                    <Card.Header withBorder>
                        <div className="flex items-center justify-between">
                            <Card.Title subtitle="Latest updates on your requests">
                                Recent Requests
                            </Card.Title>
                            <Button
                                variant="primary"
                                size="sm"
                                leftIcon={<Plus />}
                                onClick={() => setIsOpen(true)}
                            >
                                New Request
                            </Button>
                        </div>
                    </Card.Header>
                    <Card.Content>
                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <Card key={i} loading />
                                ))}
                            </div>
                        ) : recentReports.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
                                    <Wrench size={32} className="text-primary-600" />
                                </div>
                                <p className="text-secondary-900 font-semibold mb-2">No maintenance requests yet</p>
                                <p className="text-sm text-secondary-600 mb-6">
                                    Report an issue and we'll help you resolve it quickly
                                </p>
                                <Button
                                    variant="primary"
                                    leftIcon={<Plus />}
                                    onClick={() => setIsOpen(true)}
                                >
                                    Create First Request
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentReports.map((report, index) => (
                                    <div
                                        key={report.id}
                                        className="p-4 border border-secondary-200 rounded-xl hover:border-primary-200 hover:shadow-sm transition-all duration-300 animate-fade-in-up"
                                        style={{animationDelay: `${index * 0.1}s`}}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                                                report.severity === 'urgent' ? 'bg-error-100 text-error-600' :
                                                report.severity === 'high' ? 'bg-warning-100 text-warning-600' :
                                                'bg-primary-100 text-primary-600'
                                            }`}>
                                                <Wrench size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4 mb-2">
                                                    <div>
                                                        <p className="font-semibold text-secondary-900 mb-1">
                                                            {report.title}
                                                        </p>
                                                        <p className="text-sm text-secondary-600 line-clamp-2">
                                                            {report.description}
                                                        </p>
                                                    </div>
                                                    <span className="text-xs text-secondary-500 flex-shrink-0">
                                                        {report.date}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2 items-center">
                                                    <Badge variant={report.status}>
                                                        {report.status}
                                                    </Badge>
                                                    <Badge variant={report.severity}>
                                                        {report.severity}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {reports.length > 3 && (
                                    <Button
                                        variant="outline-secondary"
                                        fullWidth
                                        onClick={() => window.location.href = '/tenant/reports'}
                                    >
                                        View All {reports.length} Requests
                                    </Button>
                                )}
                            </div>
                        )}
                    </Card.Content>
                </Card>
            </div>
        </div>
    )
}

export default TenantDashboard;
