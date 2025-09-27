import styles from "./NavElement.module.css";

function NavElement({ elementInfo }) {
    return (
        <li key={elementInfo.id} className={styles.li}>
            <a href="#" className={styles.a}>
                <img src={elementInfo.icon} alt="#" className={styles.img}/><span className={styles.name}>{elementInfo.name}</span>
            </a>
        </li>
    )
}

export default NavElement;