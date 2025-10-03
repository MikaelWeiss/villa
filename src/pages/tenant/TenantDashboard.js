import Nav from '../../components/nav/Nav.js';
import TenantPreviewCard from "../../components/TenantPreviewCard";
import styles from "./TenantDashboard.module.css";
import TenantMaintenanceList from "../../components/TenantMaintenanceList";
import NewTicketModal from "../../components/NewTicketModal";
import {useState} from "react";
import { Wrench, House, CreditCard } from "lucide-react";
import { useAuth } from '../../authentication';


function TenantDashboard() {
    const [isOpen, setIsOpen] = useState(false);
    const { signOutUser } = useAuth();
    const nav = 
        (<Nav navElements={[
            {
                name: "Dashboard",
                id: crypto.randomUUID(),
                icon: <House size={20} />,
                path: "/tenantDashboard",
            },
            {
                name: "Payments",
                id: crypto.randomUUID(),
                icon: <CreditCard size={20} />,
                path: "/tenantPayments",
            },
            {
                name: "Maintenance",
                id: crypto.randomUUID(),
                icon: <Wrench size={20} />,
                path: "/tenantMaintenance"
            }
        ]}
        />)
    
    
    const balanceContent = (
        <div className={styles.textContainer}>
            <h3>Balance</h3>
            <p>$0.00</p>
        </div>
    )
    
    const placeholderTxObjects = [
        {
            id: crypto.randomUUID(),
            title: "Dishwasher",
            date: "Oct 2, 2025",
            severity: "urgent",
            description: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
        },
        {
            id: crypto.randomUUID(),
            title: "Screen Door",
            date: "Oct 2, 2025",
            severity: "low",
            description: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
        },
    ]
    
    const maintenanceContent = (
        <div className={styles.maintenanceContainer}>
            <div className={styles.maintenanceHeader}>
                <h2>Maintenance Requests</h2> 
                <button 
                    className={styles.button}
                    onClick={() => setIsOpen(true)}>
                    New Request
                </button>
            </div>
            <hr />
            <TenantMaintenanceList tickets={placeholderTxObjects} />
        </div>
    )
    
    return (
        <div className={styles.container}>
            {nav}
            {isOpen && (<NewTicketModal setIsOpen={setIsOpen}/>)}
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Dashboard</h1>
                    <button className={styles.signOutBtn} onClick={signOutUser}>
                        Sign Out
                    </button>
                </div>
                <div className={styles.cardContainer}>
                    <TenantPreviewCard
                        icon=<CreditCard size={130} />
                        infoComponent={balanceContent}
                        buttons={[
                            {link: "#", text: "Pay Now"},
                            {link: "#", text: "History"}
                        ]}
            
                    />
                </div>
                {maintenanceContent}
            </div>
        </div>
    )
}

export default TenantDashboard;