import React from 'react';
import Nav from '../../components/nav/Nav.js';
import styles from "./Dashboard.module.css";
import { useAuth } from '../../contexts/AuthContext';
import { House, CreditCard, Wrench, Clock } from 'lucide-react';

function TenantPayments() {
    const { signOut } = useAuth();

    React.useEffect(() => {
        document.title = 'Payments - Villa';
    }, []);

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

    return (
        <div className={styles.container}>
            {nav}
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Payments</h1>
                    <button className={styles.signOutBtn} onClick={signOut}>
                        Sign Out
                    </button>
                </div>

                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    marginBottom: '24px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                    <h2 style={{
                        margin: '0 0 8px 0',
                        color: '#1f2937',
                        fontSize: '20px',
                        fontWeight: '600'
                    }}>
                        Current Balance
                    </h2>
                    <p style={{
                        margin: '0',
                        fontSize: '36px',
                        fontWeight: 'bold',
                        color: '#059669'
                    }}>
                        $0.00
                    </p>
                    <p style={{
                        margin: '16px 0 0 0',
                        color: '#6b7280',
                        fontSize: '14px'
                    }}>
                        You're all caught up! No outstanding balance.
                    </p>
                </div>

                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    marginBottom: '24px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                    <h2 style={{
                        margin: '0 0 16px 0',
                        color: '#1f2937',
                        fontSize: '20px',
                        fontWeight: '600'
                    }}>
                        Payment History
                    </h2>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '40px',
                        color: '#9ca3af'
                    }}>
                        <Clock size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                        <p style={{ margin: '0', fontSize: '16px' }}>No payment history yet</p>
                    </div>
                </div>

                <div style={{
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '8px',
                    padding: '16px',
                    color: '#1e40af'
                }}>
                    <p style={{ margin: '0', fontSize: '14px' }}>
                        <strong>Note:</strong> Payment processing is coming soon! You'll be able to pay rent and view your payment history here.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default TenantPayments;
