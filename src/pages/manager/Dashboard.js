import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Nav from '../../components/nav/Nav.js';
import { useAuth } from '../../contexts/AuthContext';
import {
    Wrench,
    LayoutDashboard,
    Users,
    AlertCircle,
    Clock,
    CheckCircle,
    Activity,
    TrendingUp,
    TrendingDown,
    ArrowRight,
    Calendar,
    Eye
} from "lucide-react";
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
                    title="Dashboard"
                    actions={
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                leftIcon={<Calendar />}
                            >
                                Last 30 Days
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
                        Here's what's happening with your properties today
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    <Card variant="elevated" padding="lg" className="group hover:shadow-xl transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                                <Activity size={24} />
                            </div>
                            <div className="flex items-center gap-1 text-xs font-medium text-success-600">
                                <TrendingUp size={14} />
                                <span>12%</span>
                            </div>
                        </div>
                        <p className="text-sm font-medium text-secondary-600 mb-1">Total Reports</p>
                        <p className="text-3xl font-bold text-secondary-900">{stats.total}</p>
                        <p className="text-xs text-secondary-500 mt-2">All time</p>
                    </Card>

                    <Card variant="elevated" padding="lg" className="group hover:shadow-xl transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-error-500 to-error-600 text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                                <AlertCircle size={24} />
                            </div>
                            {stats.open > 0 && (
                                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-error-50 text-error-700 text-xs font-semibold animate-pulse-subtle">
                                    Needs attention
                                </div>
                            )}
                        </div>
                        <p className="text-sm font-medium text-secondary-600 mb-1">Open</p>
                        <p className="text-3xl font-bold text-secondary-900">{stats.open}</p>
                        <p className="text-xs text-secondary-500 mt-2">Requires action</p>
                    </Card>

                    <Card variant="elevated" padding="lg" className="group hover:shadow-xl transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-warning-500 to-warning-600 text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                                <Clock size={24} />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-secondary-600 mb-1">In Progress</p>
                        <p className="text-3xl font-bold text-secondary-900">{stats.inProgress}</p>
                        <p className="text-xs text-secondary-500 mt-2">Being resolved</p>
                    </Card>

                    <Card variant="elevated" padding="lg" className="group hover:shadow-xl transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-success-500 to-success-600 text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                                <CheckCircle size={24} />
                            </div>
                            <div className="flex items-center gap-1 text-xs font-medium text-success-600">
                                <TrendingUp size={14} />
                                <span>8%</span>
                            </div>
                        </div>
                        <p className="text-sm font-medium text-secondary-600 mb-1">Resolved</p>
                        <p className="text-3xl font-bold text-secondary-900">{stats.resolved}</p>
                        <p className="text-xs text-secondary-500 mt-2">This month</p>
                    </Card>

                    <Card variant="elevated" padding="lg" className="group hover:shadow-xl transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                                <Users size={24} />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-secondary-600 mb-1">Active Tenants</p>
                        <p className="text-3xl font-bold text-secondary-900">{stats.tenantCount}</p>
                        <p className="text-xs text-secondary-500 mt-2">With reports</p>
                    </Card>
                </div>

                {/* Recent Activity */}
                <Card variant="elevated">
                    <Card.Header withBorder>
                        <div className="flex items-center justify-between">
                            <Card.Title subtitle="Recent maintenance requests">
                                Recent Activity
                            </Card.Title>
                            <Button
                                variant="ghost-secondary"
                                size="sm"
                                rightIcon={<ArrowRight />}
                                onClick={() => navigate('/manager/reports')}
                            >
                                View All
                            </Button>
                        </div>
                    </Card.Header>
                    <Card.Content>
                        {recentReports.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary-100 flex items-center justify-center">
                                    <Activity size={32} className="text-secondary-400" />
                                </div>
                                <p className="text-secondary-600 font-medium">No recent reports</p>
                                <p className="text-sm text-secondary-500 mt-1">New maintenance requests will appear here</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {recentReports.map((report, index) => (
                                    <div
                                        key={report.id}
                                        onClick={() => navigate(`/manager/reports/${report.id}`)}
                                        className="group p-4 -mx-2 rounded-xl cursor-pointer transition-all duration-300 hover:bg-secondary-50 hover:shadow-sm animate-fade-in-up"
                                        style={{animationDelay: `${index * 0.05}s`}}
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Icon */}
                                            <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                                                report.severity === 'urgent' ? 'bg-error-100 text-error-600' :
                                                report.severity === 'high' ? 'bg-warning-100 text-warning-600' :
                                                'bg-primary-100 text-primary-600'
                                            }`}>
                                                <AlertCircle size={20} />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4 mb-2">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-secondary-900 mb-1 group-hover:text-primary-600 transition-colors truncate">
                                                            {report.description}
                                                        </p>
                                                        <div className="flex items-center gap-2 text-xs text-secondary-600">
                                                            <span className="font-medium">{report.tenant}</span>
                                                            <span className="text-secondary-400">•</span>
                                                            <span>Unit {report.unit}</span>
                                                            <span className="text-secondary-400">•</span>
                                                            <span>{report.date}</span>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost-secondary"
                                                        size="xs"
                                                        leftIcon={<Eye />}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                                    >
                                                        View
                                                    </Button>
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
                            </div>
                        )}
                    </Card.Content>
                </Card>
            </div>
        </div>
    );
}

export default ManagerDashboard;
