import styles from './ButtonLink.module.css'
import {Link} from "react-router-dom";
function ButtonLink({ text, link }) {
    return (
        <Link to={link}>
            <button className={styles.button}>
                {text}
            </button>
        </Link>
    )
}

export default ButtonLink;