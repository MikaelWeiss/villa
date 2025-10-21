import React from 'react';
import Modal from './ui/Modal';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { Calendar, User, AlertCircle, Image, Clock, CheckCircle } from 'lucide-react';

function TicketDetailModal({ isOpen, onClose, ticket }) {
    if (!ticket) return null;

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'urgent':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'high':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'open':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'in_progress':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'resolved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'closed':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <Modal.Header onClose={onClose}>
                <Modal.Title>Maintenance Request Details</Modal.Title>
            </Modal.Header>

            <Modal.Content>
                <div className="space-y-6">
                    {/* Header Section */}
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-secondary-800 mb-2">
                                {ticket.title}
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-secondary-500">
                                <div className="flex items-center gap-1">
                                    <Calendar size={16} />
                                    <span>{ticket.date}</span>
                                </div>
                                {ticket.unit && (
                                    <div className="flex items-center gap-1">
                                        <User size={16} />
                                        <span>Unit {ticket.unit}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Badge variant={ticket.severity}>
                                {ticket.severity}
                            </Badge>
                            {ticket.status && (
                                <Badge variant={ticket.status}>
                                    {ticket.status}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Description Section */}
                    <div>
                        <h4 className="text-lg font-semibold text-secondary-800 mb-3 flex items-center gap-2">
                            <AlertCircle size={20} />
                            Description
                        </h4>
                        <div className="bg-secondary-50 rounded-lg p-4">
                            <p className="text-secondary-700 leading-relaxed whitespace-pre-wrap">
                                {ticket.description}
                            </p>
                        </div>
                    </div>

                    {/* Images Section */}
                    {ticket.image_urls && ticket.image_urls.length > 0 && (
                        <div>
                            <h4 className="text-lg font-semibold text-secondary-800 mb-3 flex items-center gap-2">
                                <Image size={20} />
                                Attached Images ({ticket.image_urls.length})
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {ticket.image_urls.map((url, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={url}
                                            alt={`Report image ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg border border-secondary-200 cursor-pointer hover:shadow-md transition-shadow"
                                            onClick={() => window.open(url, '_blank')}
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                                            <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                                                Click to enlarge
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Additional Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ticket.created_at && (
                            <div className="bg-secondary-50 rounded-lg p-4">
                                <h5 className="font-semibold text-secondary-800 mb-2 flex items-center gap-2">
                                    <Clock size={16} />
                                    Submitted
                                </h5>
                                <p className="text-secondary-600 text-sm">
                                    {formatDate(ticket.created_at)}
                                </p>
                            </div>
                        )}
                        
                        {ticket.updated_at && ticket.updated_at !== ticket.created_at && (
                            <div className="bg-secondary-50 rounded-lg p-4">
                                <h5 className="font-semibold text-secondary-800 mb-2 flex items-center gap-2">
                                    <CheckCircle size={16} />
                                    Last Updated
                                </h5>
                                <p className="text-secondary-600 text-sm">
                                    {formatDate(ticket.updated_at)}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Status History (if available) */}
                    {ticket.status_history && ticket.status_history.length > 0 && (
                        <div>
                            <h4 className="text-lg font-semibold text-secondary-800 mb-3">
                                Status History
                            </h4>
                            <div className="space-y-2">
                                {ticket.status_history.map((entry, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 bg-secondary-50 rounded-lg">
                                        <div className={`w-3 h-3 rounded-full ${getStatusColor(entry.status).split(' ')[0]}`}></div>
                                        <div className="flex-1">
                                            <p className="font-medium text-secondary-800 capitalize">
                                                {entry.status.replace('_', ' ')}
                                            </p>
                                            <p className="text-sm text-secondary-500">
                                                {formatDate(entry.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Manager Notes (if available) */}
                    {ticket.manager_notes && (
                        <div>
                            <h4 className="text-lg font-semibold text-secondary-800 mb-3">
                                Manager Notes
                            </h4>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-secondary-700 leading-relaxed whitespace-pre-wrap">
                                    {ticket.manager_notes}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </Modal.Content>

            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={onClose}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default TicketDetailModal;
