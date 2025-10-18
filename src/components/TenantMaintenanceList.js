import styles from './TenantMaintenanceList.module.css';
import { Wrench } from 'lucide-react';

function TenantMaintenanceList({ tickets }) {
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
                <Wrench size={64} style={{ marginBottom: '16px', opacity: 0.3 }} />
                <p style={{ margin: '0', fontSize: '18px', fontWeight: '500', color: '#6b7280' }}>
                    No maintenance requests yet
                </p>
                <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
                    Click "New Request" to submit your first maintenance request
                </p>
            </div>
        );
    }

    return (
        <div>
            <ul className={styles.ul}>
                {tickets.map((ticket) => (
                    <li className={styles.li}
                        key={ticket.id}>
                        <Ticket ticket={ticket} />
                    </li>
                ))}
            </ul>
        </div>
    )

    function Ticket({ ticket }) {
        return (
            <div className={styles.ticketContainer}>
                <h3>{ticket.title}</h3>
                <div className={styles.ticketInfo}>
                    <p>{ticket.date}</p>
                    <p className={styles.severity}>{ticket.severity}</p>
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

export default TenantMaintenanceList;
