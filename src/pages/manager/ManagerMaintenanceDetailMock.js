import { useState } from 'react';
import Nav from '../../components/nav/Nav';
import StatusSelector from '../../components/StatusSelector';
import styles from './ManagerMaintenanceDetail.module.css';
import { Wrench, House, Users } from 'lucide-react';

function ManagerMaintenanceDetailMock() {
    const [maintenanceRequest] = useState({
        id: 'mock-123',
        title: 'Dishwasher Not Working',
        description: 'The dishwasher in unit A-203 has stopped working completely. When I press the start button, nothing happens. The lights turn on but the machine doesn\'t fill with water or start any cycles. I\'ve checked the circuit breaker and it\'s not tripped. This has been an issue for about 3 days now and we\'ve been washing dishes by hand.',
        date: 'Oct 9, 2025',
        severity: 'urgent',
        status: 'open',
        unitNumber: 'A-203',
        updatedAt: '2025-10-09T10:30:00'
    });

    const nav = (
        <Nav navElements={[
            {
                name: "Dashboard",
                id: crypto.randomUUID(),
                icon: <House size={20} />,
                path: "/managerDashboard",
            },
            {
                name: "Maintenance",
                id: crypto.randomUUID(),
                icon: <Wrench size={20} />,
                path: "/managerMaintenance"
            },
            {
                name: "Tenants",
                id: crypto.randomUUID(),
                icon: <Users size={20} />,
                path: "/managerTenants"
            }
        ]}
        />
    );

    const handleStatusChange = async (newStatus) => {
        console.log('Mock status change to:', newStatus);
        // In the real implementation, this would update Firestore
        await new Promise(resolve => setTimeout(resolve, 500));
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

    return (
        <div className={styles.container}>
            {nav}
            <div className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <button
                            className={styles.backButton}
                            onClick={() => console.log('Back clicked')}
                        >
                            ← Back
                        </button>
                        <h1 className={styles.title}>Maintenance Request Details</h1>
                    </div>
                    <button
                        className={styles.signOutBtn}
                        onClick={() => console.log('Sign out clicked')}
                    >
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
                                    {maintenanceRequest.severity}
                                </span>
                            </div>

                            <div className={styles.metaInfo}>
                                <div className={styles.metaItem}>
                                    <span className={styles.metaLabel}>Date Submitted:</span>
                                    <span className={styles.metaValue}>{maintenanceRequest.date}</span>
                                </div>
                                <div className={styles.metaItem}>
                                    <span className={styles.metaLabel}>Unit:</span>
                                    <span className={styles.metaValue}>{maintenanceRequest.unitNumber}</span>
                                </div>
                                <div className={styles.metaItem}>
                                    <span className={styles.metaLabel}>Last Updated:</span>
                                    <span className={styles.metaValue}>
                                        {new Date(maintenanceRequest.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.descriptionSection}>
                                <h3>Description</h3>
                                <p className={styles.description}>{maintenanceRequest.description}</p>
                            </div>
                        </div>

                        <StatusSelector
                            currentStatus={maintenanceRequest.status}
                            onStatusChange={handleStatusChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagerMaintenanceDetailMock;
