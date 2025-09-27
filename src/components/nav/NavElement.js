import style from "./NavElement.module.css";

function NavElement({ elementInfo }) {
    return (
        <li key={elementInfo.id} className={style.li}>
            <a href="#" className={style.a}>
                <img src={elementInfo.icon} alt="#" /><span>{elementInfo.name}</span>
            </a>
        </li>
    )
}

export default NavElement;