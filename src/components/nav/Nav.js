import NavElement from "./NavElement";

function Nav({ navElements }) {
    return (
        <nav className="fixed w-315 h-screen bg-white p-0">
            <ul className="flex flex-col m-0 rounded-lg w-full list-none gap-2 p-2.5">
                {navElements.map((element) => (
                    <NavElement key={element.id} elementInfo={element} />
                ))}
            </ul>
        </nav>
    )
}

export default Nav;
