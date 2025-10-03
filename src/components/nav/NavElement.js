import styles from "./NavElement.module.css";
import { NavLink} from "react-router-dom";

function NavElement({ elementInfo }) {
    return (
        <li key={elementInfo.id} className={styles.li}>
            <NavLink to={elementInfo.path}  className={styles.navLink}>
                {elementInfo.icon}{elementInfo.name}
            </NavLink>
        </li>
    )
    
    
}

export default NavElement;