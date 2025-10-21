import { Wrench } from 'lucide-react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import EmptyState from './ui/EmptyState';

function TenantMaintenanceList({ tickets }) {
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
            <Card>
                <h3 className="text-lg font-semibold text-secondary-800 mb-3">
                    {ticket.title}
                </h3>
                <div className="flex items-center gap-3 mb-3 text-sm text-secondary-500">
                    <span>{ticket.date}</span>
                    <Badge variant={ticket.severity}>
                        {ticket.severity}
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

export default TenantMaintenanceList;
