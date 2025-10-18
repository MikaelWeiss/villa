import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Nav from '../../components/nav/Nav.js';
import { useAuth } from '../../contexts/AuthContext';
import { Wrench, LayoutDashboard, Users, AlertCircle, Clock, CheckCircle, Activity } from "lucide-react";
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';

function ManagerDashboard() {
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        open: 0,
        inProgress: 0,
        resolved: 0,
        tenantCount: 0
    });
    const [recentReports, setRecentReports] = useState([]);

    const fetchDashboardData = useCallback(async () => {
        try {
            const { data: reports, error } = await supabase
                .from('reports')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Calculate stats
            const total = reports.length;
            const open = reports.filter(r => r.status === 'open').length;
            const inProgress = reports.filter(r => r.status === 'in-progress').length;
            const resolved = reports.filter(r => r.status === 'resolved').length;
            const uniqueTenants = new Set(reports.map(r => r.tenant_id));

            setStats({
                total,
                open,
                inProgress,
                resolved,
                tenantCount: uniqueTenants.size
            });

            // Get recent 5 reports
            setRecentReports(reports.slice(0, 5).map(report => ({
                id: report.id,
                description: report.description?.substring(0, 60) + '...' || 'No description',
                unit: report.unit,
                tenant: report.tenant_name || 'Unknown',
                status: report.status || 'open',
                severity: report.severity || 'medium',
                date: new Date(report.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                })
            })));

            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        document.title = 'Manager Dashboard - Villa';
        fetchDashboardData();
    }, [fetchDashboardData]);

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

    if (loading) {
        return (
            <div className="flex min-h-screen">
                {nav}
                <div className="ml-315 p-10 bg-background min-h-screen flex-1">
                    <PageHeader
                        title="Manager Dashboard"
                        actions={<Button variant="danger" onClick={signOut}>Sign Out</Button>}
                    />
                    <p className="text-secondary-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            {nav}
            <div className="ml-315 p-10 bg-background min-h-screen flex-1">
                <PageHeader
                    title="Manager Dashboard"
                    actions={<Button variant="danger" onClick={signOut}>Sign Out</Button>}
                />

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    <StatCard
                        title="Total Reports"
                        value={stats.total}
                        icon={<Activity size={24} />}
                        color="primary"
                    />
                    <StatCard
                        title="Open"
                        value={stats.open}
                        icon={<AlertCircle size={24} />}
                        color="error"
                    />
                    <StatCard
                        title="In Progress"
                        value={stats.inProgress}
                        icon={<Clock size={24} />}
                        color="warning"
                    />
                    <StatCard
                        title="Resolved"
                        value={stats.resolved}
                        icon={<CheckCircle size={24} />}
                        color="success"
                    />
                    <StatCard
                        title="Active Tenants"
                        value={stats.tenantCount}
                        icon={<Users size={24} />}
                        color="secondary"
                    />
                </div>

                {/* Recent Activity */}
                <Card>
                    <Card.Header>
                        <Card.Title>Recent Activity</Card.Title>
                    </Card.Header>
                    <Card.Content>
                        {recentReports.length === 0 ? (
                            <p className="text-secondary-500">No recent reports</p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {recentReports.map(report => (
                                    <div
                                        key={report.id}
                                        onClick={() => navigate(`/manager/reports/${report.id}`)}
                                        className="p-4 border border-secondary-200 rounded-lg cursor-pointer transition-all hover:bg-secondary-50 hover:border-secondary-300"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-secondary-800 mb-1">
                                                    {report.description}
                                                </p>
                                                <p className="text-sm text-secondary-600">
                                                    {report.tenant} - Unit {report.unit}
                                                </p>
                                            </div>
                                            <span className="text-xs text-secondary-500 ml-3">
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
                                ))}
                            </div>
                        )}
                    </Card.Content>
                    <Card.Footer>
                        <Button onClick={() => navigate('/manager/reports')}>
                            View All Reports →
                        </Button>
                    </Card.Footer>
                </Card>
            </div>
        </div>
    );
}

export default ManagerDashboard;
