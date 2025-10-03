import './App.css';
import { AuthProvider } from './authentication';
import AppRoutes from './routes/AppRoutes';

// function App() {
//     const routes = (
//         <Routes>
//             <Route path="/pages/tenant/TenantDashboard" element={<TenantDashboard />} />
//             <Route path="/pages/tenant/TenantPayments" element={<TenantPayments />} />
//             <Route path="/pages/tenant/TenantMaintenance" element={<TenantMaintenance />} />
//         </Routes>
//             )
//
//     return (
//         <BrowserRouter>
//             <>
//                 <Layout
//                     nav={<Nav navElements={[
//                         {
//                             name: "Dashboard",
//                             id: crypto.randomUUID(),
//                             icon: "https://placehold.co/30",
//                             path: "/pages/tenant/TenantDashboard",
//                         },
//                         {
//                             name: "Payments",
//                             id: crypto.randomUUID(),
//                             icon: "https://placehold.co/30",
//                             path: "/pages/tenant/TenantPayments",
//                         },
//                         {
//                             name: "Maintenance",
//                             id: crypto.randomUUID(),
//                             icon: "https://placehold.co/30",
//                             path: "/pages/tenant/TenantMaintenance"
//                         }
//                     ]}
//                     />}
//                     routes={routes}
//                 />
//             </>
//         </BrowserRouter>
//     )}

function App() {

    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    )}

export default App;

