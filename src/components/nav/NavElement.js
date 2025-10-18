import { NavLink} from "react-router-dom";

function NavElement({ elementInfo }) {
    return (
        <li key={elementInfo.id} className="bg-transparent w-full m-0 rounded-lg">
            <NavLink
                to={elementInfo.path}
                className={({ isActive }) =>
                    `flex flex-row items-center justify-start gap-3 text-secondary-600 no-underline font-bold text-sm p-5 rounded-[15px] transition-smooth hover:bg-secondary-100 hover:text-primary ${
                        isActive ? 'bg-primary text-white hover:bg-primary-600 hover:text-white' : ''
                    }`
                }
            >
                {elementInfo.icon}{elementInfo.name}
            </NavLink>
        </li>
    )


}

export default NavElement;
