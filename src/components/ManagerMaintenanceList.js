import { useState } from 'react';
import { Inbox } from 'lucide-react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import EmptyState from './ui/EmptyState';
import TicketDetailModal from './TicketDetailModal';
import { supabase } from '../lib/supabase';

function ManagerMaintenanceList({ tickets }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [loadingTicket, setLoadingTicket] = useState(false);

    const handleTicketClick = async (ticketId) => {
        setLoadingTicket(true);
        setIsModalOpen(true);

        try {
            const { data, error } = await supabase
                .from('reports')
                .select('*, organization:organizations(name)')
                .eq('id', ticketId)
                .single();

            if (error) throw error;

            const fullTicket = {
                ...data,
                title: data.description && data.description.length > 50
                    ? data.description.substring(0, 50) + '...'
                    : data.description || 'No title',
                date: data.created_at ? new Date(data.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                }) : 'Unknown date',
                tenantName: data.tenant_name || 'Unknown tenant',
                organizationName: data.organization?.name || 'Unknown Organization',
            };

            setSelectedTicket(fullTicket);
        } catch (error) {
            console.error('Error fetching ticket details:', error);
        } finally {
            setLoadingTicket(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTicket(null);
    };

    if (tickets.length === 0) {
        return (
            <EmptyState
                icon={<Inbox size={64} />}
                title="No maintenance requests found"
                description="All maintenance requests from tenants will appear here"
            />
        );
    }

    return (
        <>
            <div className="space-y-4">
                {tickets.map((ticket) => (
                    <div
                        key={ticket.id}
                        onClick={() => handleTicketClick(ticket.id)}
                        className="hover:bg-secondary-50 transition-smooth cursor-pointer"
                    >
                        <Ticket ticket={ticket} />
                    </div>
                ))}
            </div>

            <TicketDetailModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                ticket={selectedTicket}
                loading={loadingTicket}
                canEditStatus={true}
            />
        </>
    )

    function Ticket({ ticket }) {
        return (
            <Card>
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-secondary-800 mb-1">
                            {ticket.title}
                        </h3>
                        <span className="text-sm text-secondary-600">
                            {ticket.tenantName} - {ticket.property || ticket.unit} ({ticket.organizationName})
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3 mb-3 text-sm text-secondary-500">
                    <span>{ticket.date}</span>
                    <Badge variant={ticket.severity || 'medium'}>
                        {ticket.severity || 'medium'}
                    </Badge>
                    <Badge variant={ticket.status || 'open'}>
                        {(ticket.status || 'open').replace('_', ' ')}
                    </Badge>
                </div>
                <p className="text-secondary-700 mb-3">{ticket.description}</p>
                {ticket.image_urls && ticket.image_urls.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-4">
                        {ticket.image_urls.map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt={`Attachment ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                            />
                        ))}
                    </div>
                )}
            </Card>
        )
    }
}

export default ManagerMaintenanceList;
