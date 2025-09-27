import styles from "./Layout.module.css";

function Layout({ nav, content }) {
    return (
        <div className={styles.appLayout}>
            <span className={styles.nav}>{nav}</span>
            <span className={styles.content}>{content}</span>
        </div>
    )
}

export default Layout;