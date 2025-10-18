import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Nav from '../../components/nav/Nav';
import StatusSelector from '../../components/StatusSelector';
import styles from './ReportDetails.module.css';
import { Wrench, House, Users } from 'lucide-react';

function ManagerMaintenanceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { signOut } = useAuth();
    const [maintenanceRequest, setMaintenanceRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const nav = (
        <Nav navElements={[
            {
                name: "Dashboard",
                id: crypto.randomUUID(),
                icon: <House size={20} />,
                path: "/manager/dashboard",
            },
            {
                name: "Maintenance",
                id: crypto.randomUUID(),
                icon: <Wrench size={20} />,
                path: "/manager/reports"
            },
            {
                name: "Tenants",
                id: crypto.randomUUID(),
                icon: <Users size={20} />,
                path: "/manager/tenants"
            }
        ]}
        />
    );

    const fetchMaintenanceRequest = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error: fetchError } = await supabase
                .from('reports')
                .select('*')
                .eq('id', id)
                .single();

            if (fetchError) throw fetchError;

            if (data) {
                setMaintenanceRequest({
                    id: data.id,
                    title: data.description?.substring(0, 50) + '...' || 'Maintenance Request',
                    description: data.description || 'No description',
                    date: data.created_at ? new Date(data.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    }) : 'Unknown date',
                    severity: data.severity || 'medium',
                    status: data.status || 'open',
                    unitNumber: data.unit,
                    updatedAt: data.updated_at || data.created_at
                });
            } else {
                setError('Maintenance request not found');
            }
        } catch (err) {
            console.error('Error fetching maintenance request:', err);
            setError('Failed to load maintenance request');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchMaintenanceRequest();
    }, [fetchMaintenanceRequest]);

    const handleStatusChange = async (newStatus) => {
        try {
            const { error: updateError } = await supabase
                .from('reports')
                .update({
                    status: newStatus,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id);

            if (updateError) throw updateError;

            setMaintenanceRequest(prev => ({
                ...prev,
                status: newStatus,
                updatedAt: new Date().toISOString()
            }));
        } catch (err) {
            console.error('Error updating status:', err);
            throw err;
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'urgent':
                return '#f44336';
            case 'high':
                return '#ff9800';
            case 'medium':
                return '#1976d2';
            case 'low':
                return '#4caf50';
            default:
                return '#1976d2';
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                {nav}
                <div className={styles.content}>
                    <div className={styles.loading}>Loading...</div>
                </div>
            </div>
        );
    }

    if (error || !maintenanceRequest) {
        return (
            <div className={styles.container}>
                {nav}
                <div className={styles.content}>
                    <div className={styles.error}>
                        <h2>{error || 'Maintenance request not found'}</h2>
                        <button
                            className={styles.backButton}
                            onClick={() => navigate('/manager/reports')}
                        >
                            Back to List
                        </button>
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
                    <div className={styles.headerLeft}>
                        <button
                            className={styles.backButton}
                            onClick={() => navigate('/manager/reports')}
                        >
                            ← Back
                        </button>
                        <h1 className={styles.title}>Maintenance Request Details</h1>
                    </div>
                    <button className={styles.signOutBtn} onClick={signOut}>
                        Sign Out
                    </button>
                </div>

                <div className={styles.detailsContainer}>
                    <div className={styles.mainInfo}>
                        <div className={styles.requestCard}>
                            <div className={styles.requestHeader}>
                                <h2>{maintenanceRequest.title}</h2>
                                <span
                                    className={styles.severity}
                                    style={{ backgroundColor: getSeverityColor(maintenanceRequest.severity) }}
                                >
                                    {maintenanceRequest.severity || 'medium'}
                                </span>
                            </div>

                            <div className={styles.metaInfo}>
                                <div className={styles.metaItem}>
                                    <span className={styles.metaLabel}>Date Submitted:</span>
                                    <span className={styles.metaValue}>{maintenanceRequest.date}</span>
                                </div>
                                {maintenanceRequest.unitNumber && (
                                    <div className={styles.metaItem}>
                                        <span className={styles.metaLabel}>Unit:</span>
                                        <span className={styles.metaValue}>{maintenanceRequest.unitNumber}</span>
                                    </div>
                                )}
                                {maintenanceRequest.updatedAt && (
                                    <div className={styles.metaItem}>
                                        <span className={styles.metaLabel}>Last Updated:</span>
                                        <span className={styles.metaValue}>
                                            {new Date(maintenanceRequest.updatedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className={styles.descriptionSection}>
                                <h3>Description</h3>
                                <p className={styles.description}>{maintenanceRequest.description}</p>
                            </div>
                        </div>

                        <StatusSelector
                            currentStatus={maintenanceRequest.status || 'open'}
                            onStatusChange={handleStatusChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagerMaintenanceDetail;
