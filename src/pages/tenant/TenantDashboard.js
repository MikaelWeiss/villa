import Nav from '../../components/nav/Nav.js';
import TenantPreviewCard from "../../components/TenantPreviewCard";
import ButtonLink from "../../components/ButtonLink";
import Layout from "../../components/Layout.js";
import styles from "./TenantDashboard.module.css";


function TenantDashboard() {
    const balanceContent = (
        <div className={styles.textContainer}>
            <h2>Balance</h2>
            <p>$0.00</p>
        </div>
    )
    
    const maintenanceContent = (
        <div className={styles.textContainer}>
            <h2>Maintenance Requests</h2>
            <p>some requests here</p>
            <a href="#">see all</a>
        </div>
    )
    
    return (
        <div className={styles.content}>
            <h1 className={styles.title}>Dashboard</h1>
            <div className={styles.cardContainer}>
                <TenantPreviewCard
                    icon="https://placehold.co/50"
                    infoComponent={balanceContent}
                    buttons={[
                        {link: "#", text: "Pay Now"},
                        {link: "#", text: "History"}
                    ]}
        
                ></TenantPreviewCard>
        
                <TenantPreviewCard
                    icon="https://placehold.co/50"
                    infoComponent={maintenanceContent}
                    buttons={[
                        {link: "#", text: "New Request"}
                    ]}
        
                ></TenantPreviewCard>
            </div>
        </div>
    )
}

export default TenantDashboard;