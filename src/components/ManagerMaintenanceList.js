import { useNavigate } from 'react-router-dom';
import styles from './ManagerMaintenanceList.module.css';

function ManagerMaintenanceList({ tickets }) {
    const navigate = useNavigate();

    const handleTicketClick = (ticketId) => {
        // Updated to match villa-two's route structure
        navigate(`/manager/reports/${ticketId}`);
    };

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
            </div>
        )
    }
}

export default ManagerMaintenanceList;
