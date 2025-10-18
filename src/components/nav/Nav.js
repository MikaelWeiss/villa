import styles from "./Nav.module.css";
import NavElement from "./NavElement";

function Nav({ navElements }) {
    return (
        <nav className={styles.nav}>
            <ul className={styles.elementsList}>
                {navElements.map((element) => (
                    <NavElement key={element.id} elementInfo={element} />
                ))}
            </ul>
        </nav>
    )
}

export default Nav;
