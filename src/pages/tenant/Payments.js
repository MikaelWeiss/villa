import React from 'react';
import Nav from '../../components/nav/Nav.js';
import { useAuth } from '../../contexts/AuthContext';
import { House, CreditCard, Wrench, Clock } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';

function TenantPayments() {
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
        <div className="flex">
            {nav}
            <div className="ml-315 p-10 bg-background min-h-screen flex-1">
                <PageHeader
                    title="Payments"
                />

                <Card className="mb-6">
                    <Card.Header>
                        <Card.Title>Current Balance</Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <p className="text-4xl font-bold text-success mb-4">
                            $0.00
                        </p>
                        <p className="text-sm text-secondary-500">
                            You're all caught up! No outstanding balance.
                        </p>
                    </Card.Content>
                </Card>

                <Card className="mb-6">
                    <Card.Header>
                        <Card.Title>Payment History</Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <EmptyState
                            icon={<Clock size={48} />}
                            title="No payment history yet"
                            description="Your payment transactions will appear here once you make your first payment."
                        />
                    </Card.Content>
                </Card>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
                    <p className="text-sm m-0">
                        <strong>Note:</strong> Payment processing is coming soon! You'll be able to pay rent and view your payment history here.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default TenantPayments;
