import { NavLink } from "react-router-dom";

function NavElement({ elementInfo }) {
    return (
        <li key={elementInfo.id} className="w-full m-0">
            <NavLink
                to={elementInfo.path}
                className={({ isActive }) =>
                    `group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 no-underline ${
                        isActive
                            ? 'bg-primary-50 text-primary-700 shadow-sm'
                            : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                    }`
                }
            >
                {({ isActive }) => (
                    <>
                        {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-600 rounded-r-full transition-all duration-300"></div>
                        )}
                        <span className={`flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                            {elementInfo.icon}
                        </span>
                        <span className="flex-1">{elementInfo.name}</span>
                        {elementInfo.badge && (
                            <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                                isActive
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-secondary-200 text-secondary-700 group-hover:bg-secondary-300'
                            }`}>
                                {elementInfo.badge}
                            </span>
                        )}
                    </>
                )}
            </NavLink>
        </li>
    );
}

export default NavElement;
