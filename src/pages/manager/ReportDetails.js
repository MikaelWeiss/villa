import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Nav from '../../components/nav/Nav';
import StatusSelector from '../../components/StatusSelector';
import { Wrench, LayoutDashboard, Users, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import PageHeader from '../../components/ui/PageHeader';
import Badge from '../../components/ui/Badge';

function ManagerMaintenanceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { signOut, profile, role } = useAuth();
    const [maintenanceRequest, setMaintenanceRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                path: "/manager/tenants"
            },
            {
                name: "Maintenance",
                id: crypto.randomUUID(),
                icon: <Wrench size={20} />,
                path: "/manager/reports"
            }
        ]}
        />
    );

    const fetchMaintenanceRequest = useCallback(async () => {
        if (role && !profile) return;
        try {
            setLoading(true);
            let query = supabase
                .from('reports')
                .select('*, organizations(name)')
                .eq('id', id);

            if (role === 'manager' && profile?.organization_ids) {
                query = query.in('organization_id', profile.organization_ids);
            }

            const { data, error: fetchError } = await query.single();

            if (fetchError) throw fetchError;

            if (data) {
                setMaintenanceRequest({
                    id: data.id,
                    title: data.description && data.description.length > 50
                        ? data.description.substring(0, 50) + '...'
                        : data.description || 'Maintenance Request',
                    description: data.description || 'No description',
                    date: data.created_at ? new Date(data.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    }) : 'Unknown date',
                    severity: data.severity || 'medium',
                    status: data.status || 'open',
                    unitNumber: data.unit,
                    updatedAt: data.updated_at || data.created_at,
                    image_urls: data.image_urls || [],
                    organizationName: data.organizations ? data.organizations.name : 'N/A'
                });
            } else {
                setError('Maintenance request not found');
            }
        } catch (err) {
            setError('Failed to load maintenance request');
        } finally {
            setLoading(false);
        }
    }, [id, profile, role]);

    useEffect(() => {
        document.title = 'Report Details - Villa';
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
            throw err;
        }
    };

    const { loading: authLoading } = useAuth();

    if (loading || authLoading) {
        return (
            <div className="flex min-h-screen">
                {nav}
                <div className="ml-315 p-10 bg-background min-h-screen flex-1">
                    <p className="text-secondary-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (error || !maintenanceRequest) {
        return (
            <div className="flex min-h-screen">
                {nav}
                <div className="ml-315 p-10 bg-background min-h-screen flex-1">
                    <div className="flex flex-col items-center justify-center py-16">
                        <h2 className="text-2xl font-bold text-secondary-800 mb-4">
                            {error || 'Maintenance request not found'}
                        </h2>
                        <Button onClick={() => navigate('/manager/reports')}>
                            Back to List
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            {nav}
            <div className="ml-315 p-10 bg-background min-h-screen flex-1">
                <PageHeader
                    title="Maintenance Request Details"
                    actions={
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                onClick={() => navigate('/manager/reports')}
                            >
                                <ArrowLeft size={16} className="mr-2" />
                                Back
                            </Button>
                            <Button variant="danger" onClick={signOut}>
                                Sign Out
                            </Button>
                        </div>
                    }
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card>
                            <Card.Header>
                                <div className="flex items-start justify-between">
                                    <Card.Title>{maintenanceRequest.title}</Card.Title>
                                    <Badge variant={maintenanceRequest.severity}>
                                        {maintenanceRequest.severity || 'medium'}
                                    </Badge>
                                </div>
                            </Card.Header>
                            <Card.Content>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <span className="text-sm font-medium text-secondary-500">Organization:</span>
                                            <p className="text-secondary-800">{maintenanceRequest.organizationName}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-secondary-500">Date Submitted:</span>
                                            <p className="text-secondary-800">{maintenanceRequest.date}</p>
                                        </div>
                                        {maintenanceRequest.unitNumber && (
                                            <div>
                                                <span className="text-sm font-medium text-secondary-500">Unit:</span>
                                                <p className="text-secondary-800">{maintenanceRequest.unitNumber}</p>
                                            </div>
                                        )}
                                        {maintenanceRequest.updatedAt && (
                                            <div>
                                                <span className="text-sm font-medium text-secondary-500">Last Updated:</span>
                                                <p className="text-secondary-800">
                                                    {new Date(maintenanceRequest.updatedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-secondary-800 mb-2">Description</h3>
                                        <p className="text-secondary-700 leading-relaxed">
                                            {maintenanceRequest.description}
                                        </p>
                                    </div>

                                    {maintenanceRequest.image_urls && maintenanceRequest.image_urls.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-secondary-800 mb-3">Photos</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {maintenanceRequest.image_urls.map((url, index) => (
                                                    <div
                                                        key={index}
                                                        className="rounded-lg overflow-hidden border border-secondary-200"
                                                    >
                                                        <img
                                                            src={url}
                                                            alt={`Report image ${index + 1}`}
                                                            className="w-full h-auto object-cover"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card.Content>
                        </Card>
                    </div>

                    <div className="lg:col-span-1">
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