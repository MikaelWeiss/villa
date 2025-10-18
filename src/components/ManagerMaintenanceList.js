import { useNavigate } from 'react-router-dom';
import styles from './ManagerMaintenanceList.module.css';
import { Inbox } from 'lucide-react';

function ManagerMaintenanceList({ tickets }) {
    const navigate = useNavigate();

    const handleTicketClick = (ticketId) => {
        // Updated to match villa-two's route structure
        navigate(`/manager/reports/${ticketId}`);
    };

    if (tickets.length === 0) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 20px',
                color: '#9ca3af'
            }}>
                <Inbox size={64} style={{ marginBottom: '16px', opacity: 0.3 }} />
                <p style={{ margin: '0', fontSize: '18px', fontWeight: '500', color: '#6b7280' }}>
                    No maintenance requests found
                </p>
                <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
                    All maintenance requests from tenants will appear here
                </p>
            </div>
        );
    }

    return (
        <div>
            <ul className={styles.ul}>
                {tickets.map((ticket) => (
                    <li className={styles.li}
                        key={ticket.id}
                        onClick={() => handleTicketClick(ticket.id)}
                        style={{ cursor: 'pointer' }}>
                        <Ticket ticket={ticket} />
                    </li>
                ))}
            </ul>
        </div>
    )

    function Ticket({ ticket }) {
        return (
            <div className={styles.ticketContainer}>
                <div className={styles.ticketHeader}>
                    <h3>{ticket.title}</h3>
                    <span className={styles.tenantInfo}>{ticket.tenantName} - {ticket.property || ticket.unit}</span>
                </div>
                <div className={styles.ticketInfo}>
                    <p>{ticket.date}</p>
                    <p className={styles.severity}>{ticket.severity || 'medium'}</p>
                </div>
                <p>{ticket.description}</p>
                {ticket.image_urls && ticket.image_urls.length > 0 && (
                    <div className={styles.imageGallery}>
                        {ticket.image_urls.map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt={`Report image ${index + 1}`}
                                className={styles.imageThumbnail}
                            />
                        ))}
                    </div>
                )}
            </div>
        )
    }
}

export default ManagerMaintenanceList;
