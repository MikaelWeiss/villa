import './App.css';
import TenantDashboard from "./pages/tenant/TenantDashboard";
import TenantPayments from "./pages/tenant/TenantPayments";
import TenantMaintenance from "./pages/tenant/TenantMaintenance";
import Layout from "./components/Layout.js"
import Nav from "./components/nav/Nav.js"
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    const routes = (
        <Routes>
            <Route path="/pages/tenant/TenantDashboard" element={<TenantDashboard />} />
            <Route path="/pages/tenant/TenantPayments" element={<TenantPayments />} />
            <Route path="/pages/tenant/TenantMaintenance" element={<TenantMaintenance />} />
        </Routes>
            )

    return (
        <BrowserRouter>
            <>
                <Layout
                    nav={<Nav navElements={[
                        {
                            name: "Dashboard",
                            id: crypto.randomUUID(),
                            icon: "https://placehold.co/30",
                            path: "/pages/tenant/TenantDashboard",
                        },
                        {
                            name: "Payments",
                            id: crypto.randomUUID(),
                            icon: "https://placehold.co/30",
                            path: "/pages/tenant/TenantPayments",
                        },
                        {
                            name: "Maintenance",
                            id: crypto.randomUUID(),
                            icon: "https://placehold.co/30",
                            path: "/pages/tenant/TenantMaintenance"
                        }
                    ]}
                    />}
                    routes={routes}
                />
            </>
        </BrowserRouter>
    )
    
    
    
    
    
    
    // return (
    //     <>
    //         <Layout 
    //             nav={<Nav navElements={[
    //                 {
    //                     name: "Dashboard",
    //                     id: crypto.randomUUID(),
    //                     icon: "https://placehold.co/30",
    //                     path: "/pages/tenant/TenantDashboard",
    //                 },
    //                 {
    //                     name: "Payments",
    //                     id: crypto.randomUUID(),
    //                     icon: "https://placehold.co/30",
    //                     path: "/pages/tenant/TenantPayments",
    //                 },
    //                 {
    //                     name: "Maintenance",
    //                     id: crypto.randomUUID(),
    //                     icon: "https://placehold.co/30",
    //                     path: "/pages/tenant/TenantMaintenance"
    //                 }
    //                 ]}
    //             />}
    //             page={<TenantDashboard />}
    //         />
    //     </>
    // )
}

export default App;
