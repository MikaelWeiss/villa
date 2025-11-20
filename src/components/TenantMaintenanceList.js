import { Wrench } from 'lucide-react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import EmptyState from './ui/EmptyState';

function TenantMaintenanceList({ tickets, onTicketClick }) {
    if (tickets.length === 0) {
        return (
            <EmptyState
                icon={<Wrench size={64} />}
                title="No maintenance requests yet"
                description='Click "New Request" to submit your first maintenance request'
            />
        );
    }

    return (
        <div className="space-y-4">
            {tickets.map((ticket) => (
                <div key={ticket.id}>
                    <Ticket ticket={ticket} />
                </div>
            ))}
        </div>
    )

    function Ticket({ ticket }) {
        return (
            <Card 
                interactive={true}
                onClick={() => onTicketClick && onTicketClick(ticket)}
                className="cursor-pointer hover:shadow-lg transition-all duration-200"
            >
                <h3 className="text-lg font-semibold text-secondary-800 mb-3">
                    {ticket.title}
                </h3>
                <div className="flex items-center gap-3 mb-3 text-sm text-secondary-500">
                    <span>{ticket.date}</span>
                    <Badge variant={ticket.severity}>
                        {ticket.severity}
                    </Badge>
                    <Badge variant={ticket.status || 'open'}>
                        {(ticket.status || 'open').replace('_', ' ')}
                    </Badge>
                </div>
                <p className="text-secondary-700 mb-3 line-clamp-3">{ticket.description}</p>
                {ticket.image_urls && ticket.image_urls.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-4">
                        {ticket.image_urls.slice(0, 4).map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt={`Attachment ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                            />
                        ))}
                        {ticket.image_urls.length > 4 && (
                            <div className="w-full h-24 bg-secondary-200 rounded-lg flex items-center justify-center">
                                <span className="text-secondary-500 text-sm font-medium">
                                    +{ticket.image_urls.length - 4} more
                                </span>
                            </div>
                        )}
                    </div>
                )}
                <div className="mt-4 pt-3 border-t border-secondary-100">
                    <p className="text-sm text-secondary-500 text-center">
                        Click to view details
                    </p>
                </div>
            </Card>
        )
    }
}

export default TenantMaintenanceList;
