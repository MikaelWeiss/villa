import styles from './ManagerMaintenanceList.module.css';

function ManagerMaintenanceList({ tickets }) {
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
                <div className={styles.ticketHeader}>
                    <h3>{ticket.title}</h3>
                    <span className={styles.tenantInfo}>{ticket.tenantName} - {ticket.property}</span>
                </div>
                <div className={styles.ticketInfo}>
                    <p>{ticket.date}</p>
                    <p className={styles.severity}>{ticket.severity}</p>
                </div>
                <p>{ticket.description}</p>
            </div>
        )
    }
}

export default ManagerMaintenanceList;
