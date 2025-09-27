import Nav from '../../components/nav/Nav.js';
function TenantDashboard() {
    return (
        <Nav navElements={[
            {
                name: "Dashboard",
                id: crypto.randomUUID(),
                icon: "https://placehold.co/30"
            },
            {
                name: "Payments",
                id: crypto.randomUUID(),
                icon: "https://placehold.co/30"
            },
            {
                name: "Maintenance",
                id: crypto.randomUUID(),
                icon: "https://placehold.co/30"
            },

        ]} />
    )
}

export default TenantDashboard;