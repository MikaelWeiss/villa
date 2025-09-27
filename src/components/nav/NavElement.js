import styles from "./NavElement.module.css";
import { NavLink} from "react-router-dom";

function NavElement({ elementInfo }) {
    return (
        <li key={elementInfo.id} className={styles.li}>
            <NavLink to={elementInfo.path}  className={({ isActive }) =>
                isActive ? styles.activeLink : styles.inactiveLink
            }>
                <img src={elementInfo.icon} alt="#" className={styles.img}/><span className={styles.name}>{elementInfo.name}</span>
            </NavLink>
        </li>
    )
    
    
}

export default NavElement;