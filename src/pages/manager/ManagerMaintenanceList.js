import Nav from '../../components/nav/Nav.js';
import styles from "./ManagerMaintenanceList.module.css";
import ManagerMaintenanceList from "../../components/ManagerMaintenanceList";
import { Wrench, LayoutDashboard, Users } from "lucide-react";
import { useAuth } from '../../authentication';

function ManagerMaintenanceListPage() {
    const { signOutUser } = useAuth();
    const nav =
        (<Nav navElements={[
            {
                name: "Dashboard",
                id: crypto.randomUUID(),
                icon: <LayoutDashboard size={20} />,
                path: "/managerDashboard",
            },
            {
                name: "Tenants",
                id: crypto.randomUUID(),
                icon: <Users size={20} />,
                path: "/managerTenants",
            },
            {
                name: "Maintenance",
                id: crypto.randomUUID(),
                icon: <Wrench size={20} />,
                path: "/managerMaintenance"
            }
        ]}
        />)

    const placeholderTickets = [
        {
            id: crypto.randomUUID(),
            title: "Dishwasher Not Working",
            date: "Oct 2, 2025",
            severity: "urgent",
            description: "The dishwasher in unit 3B is not draining properly and making unusual noises. Water is backing up into the sink.",
            tenantName: "John Smith",
            property: "Building A - Unit 3B"
        },
        {
            id: crypto.randomUUID(),
            title: "Leaking Faucet",
            date: "Oct 5, 2025",
            severity: "medium",
            description: "Kitchen faucet has been dripping constantly for the past week. Tried tightening but issue persists.",
            tenantName: "Sarah Johnson",
            property: "Building B - Unit 1A"
        },
        {
            id: crypto.randomUUID(),
            title: "Screen Door Torn",
            date: "Oct 7, 2025",
            severity: "low",
            description: "The screen door on the patio has a large tear in the mesh. Needs replacement.",
            tenantName: "Mike Davis",
            property: "Building A - Unit 2C"
        },
        {
            id: crypto.randomUUID(),
            title: "HVAC Not Heating",
            date: "Oct 8, 2025",
            severity: "urgent",
            description: "Heater is not turning on. Thermostat shows correct temperature but no heat is being produced.",
            tenantName: "Emily Wilson",
            property: "Building C - Unit 4D"
        },
    ]

    return (
        <div className={styles.container}>
            {nav}
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1 className={styles.title}>All Maintenance Requests</h1>
                    <button className={styles.signOutBtn} onClick={signOutUser}>
                        Sign Out
                    </button>
                </div>
                <div className={styles.maintenanceContainer}>
                    <ManagerMaintenanceList tickets={placeholderTickets} />
                </div>
            </div>
        </div>
    )
}

export default ManagerMaintenanceListPage;
