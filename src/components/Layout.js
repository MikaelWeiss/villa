import styles from "./Layout.module.css";
import { Outlet } from "react-router-dom";

function Layout({ nav, routes }) {
    return (
        <div className={styles.appLayout}>
            <span className={styles.nav}>{nav}</span>
            <span className={styles.page}>{routes}</span>
        </div>
    );
}


// function Layout({ nav, page }) {
//     return (
//         <div className={styles.appLayout}>
//             <span className={styles.nav}>{nav}</span>
//             <span className={styles.page}>{page}</span>
//         </div>
//     );
// }

export default Layout;