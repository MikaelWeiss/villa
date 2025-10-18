import styles from './TenantMaintenanceList.module.css';
import ButtonLink from "./ButtonLink";

function TenantMaintenanceList({ tickets }) {
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
            </div>
        )
    }
}

export default TenantMaintenanceList;
