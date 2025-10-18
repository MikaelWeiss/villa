import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Nav from '../../components/nav/Nav.js';
import styles from "./Reports.module.css";
import { useAuth } from '../../contexts/AuthContext';
import { Wrench, LayoutDashboard, Users, AlertCircle, Clock, CheckCircle, Activity } from "lucide-react";

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

    const StatCard = ({ title, value, icon, color }) => (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <div>
                <p style={{
                    margin: '0 0 4px 0',
                    fontSize: '14px',
                    color: '#6b7280',
                    fontWeight: '500'
                }}>
                    {title}
                </p>
                <p style={{
                    margin: '0',
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#1f2937'
                }}>
                    {value}
                </p>
            </div>
            <div style={{
                backgroundColor: color + '20',
                borderRadius: '50%',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {icon}
            </div>
        </div>
    );

    const getSeverityColor = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'urgent': return '#ef4444';
            case 'high': return '#f59e0b';
            case 'medium': return '#3b82f6';
            case 'low': return '#10b981';
            default: return '#3b82f6';
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'open': return '#ef4444';
            case 'in-progress': return '#f59e0b';
            case 'resolved': return '#10b981';
            default: return '#6b7280';
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                {nav}
                <div className={styles.content}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Manager Dashboard</h1>
                        <button className={styles.signOutBtn} onClick={signOut}>
                            Sign Out
                        </button>
                    </div>
                    <div style={{ padding: '24px' }}>
                        <p>Loading dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {nav}
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Manager Dashboard</h1>
                    <button className={styles.signOutBtn} onClick={signOut}>
                        Sign Out
                    </button>
                </div>

                <div style={{ padding: '24px' }}>
                    {/* Stats Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px',
                        marginBottom: '24px'
                    }}>
                        <StatCard
                            title="Total Reports"
                            value={stats.total}
                            icon={<Activity size={24} style={{ color: '#3b82f6' }} />}
                            color="#3b82f6"
                        />
                        <StatCard
                            title="Open"
                            value={stats.open}
                            icon={<AlertCircle size={24} style={{ color: '#ef4444' }} />}
                            color="#ef4444"
                        />
                        <StatCard
                            title="In Progress"
                            value={stats.inProgress}
                            icon={<Clock size={24} style={{ color: '#f59e0b' }} />}
                            color="#f59e0b"
                        />
                        <StatCard
                            title="Resolved"
                            value={stats.resolved}
                            icon={<CheckCircle size={24} style={{ color: '#10b981' }} />}
                            color="#10b981"
                        />
                        <StatCard
                            title="Active Tenants"
                            value={stats.tenantCount}
                            icon={<Users size={24} style={{ color: '#8b5cf6' }} />}
                            color="#8b5cf6"
                        />
                    </div>

                    {/* Recent Activity */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '24px',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h2 style={{
                            margin: '0 0 16px 0',
                            fontSize: '20px',
                            fontWeight: '600',
                            color: '#1f2937'
                        }}>
                            Recent Activity
                        </h2>
                        {recentReports.length === 0 ? (
                            <p style={{ color: '#6b7280', margin: '20px 0' }}>No recent reports</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {recentReports.map(report => (
                                    <div
                                        key={report.id}
                                        onClick={() => navigate(`/manager/reports/${report.id}`)}
                                        style={{
                                            padding: '16px',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            backgroundColor: '#fafbfc'
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                                            e.currentTarget.style.borderColor = '#d1d5db';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.backgroundColor = '#fafbfc';
                                            e.currentTarget.style.borderColor = '#e5e7eb';
                                        }}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            marginBottom: '8px'
                                        }}>
                                            <div style={{ flex: 1 }}>
                                                <p style={{
                                                    margin: '0 0 4px 0',
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    color: '#1f2937'
                                                }}>
                                                    {report.description}
                                                </p>
                                                <p style={{
                                                    margin: '0',
                                                    fontSize: '13px',
                                                    color: '#6b7280'
                                                }}>
                                                    {report.tenant} - Unit {report.unit}
                                                </p>
                                            </div>
                                            <span style={{
                                                fontSize: '12px',
                                                color: '#6b7280',
                                                marginLeft: '12px'
                                            }}>
                                                {report.date}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <span style={{
                                                fontSize: '12px',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                backgroundColor: getStatusColor(report.status) + '20',
                                                color: getStatusColor(report.status),
                                                fontWeight: '500'
                                            }}>
                                                {report.status}
                                            </span>
                                            <span style={{
                                                fontSize: '12px',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                backgroundColor: getSeverityColor(report.severity) + '20',
                                                color: getSeverityColor(report.severity),
                                                fontWeight: '500'
                                            }}>
                                                {report.severity}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button
                            onClick={() => navigate('/manager/reports')}
                            style={{
                                marginTop: '16px',
                                padding: '10px 20px',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}
                        >
                            View All Reports →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagerDashboard;
