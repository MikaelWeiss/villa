import { useNavigate } from 'react-router-dom';
import { Inbox } from 'lucide-react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import EmptyState from './ui/EmptyState';

function ManagerMaintenanceList({ tickets }) {
    const navigate = useNavigate();

    const handleTicketClick = (ticketId) => {
        // Updated to match villa-two's route structure
        navigate(`/manager/reports/${ticketId}`);
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
                            {ticket.tenantName} - {ticket.property || ticket.unit}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3 mb-3 text-sm text-secondary-500">
                    <span>{ticket.date}</span>
                    <Badge variant={ticket.severity || 'medium'}>
                        {ticket.severity || 'medium'}
                    </Badge>
                </div>
                <p className="text-secondary-700 mb-3">{ticket.description}</p>
                {ticket.image_urls && ticket.image_urls.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-4">
                        {ticket.image_urls.map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt={`Report image ${index + 1}`}
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
