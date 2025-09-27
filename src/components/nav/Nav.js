import style from "./Nav.module.css";
import NavElement from "./NavElement";

function Nav({ navElements }) {
    return (
        <nav>
            <ul>
                {navElements.map((element) => (
                    <NavElement elementInfo={element} />
                ))}
            </ul>
        </nav>
    )
}

export default Nav;