import NavElement from "./NavElement";
import { useAuth } from "../../contexts/AuthContext";
import { Building2, User } from "lucide-react";

function Nav({ navElements }) {
    const { user, role } = useAuth();

    // Get user initials for avatar
    const getUserInitials = () => {
        if (!user?.email) return 'U';
        const email = user.email;
        const parts = email.split('@')[0].split('.');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return email.substring(0, 2).toUpperCase();
    };

    return (
        <nav className="fixed w-315 h-screen bg-white border-r border-secondary-100 flex flex-col shadow-sm">
            {/* Logo and Brand */}
            <div className="px-6 py-6 border-b border-secondary-100">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-md">
                        <Building2 size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-secondary-900 leading-none mb-0.5">Villa</h1>
                        <p className="text-xs text-secondary-500 capitalize leading-none">
                            {role || 'User'} Portal
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation Items */}
            <ul className="flex flex-col flex-1 m-0 list-none gap-1 px-3 py-4 overflow-y-auto scrollbar-thin">
                {navElements.map((element) => (
                    <NavElement key={element.id} elementInfo={element} />
                ))}
            </ul>

            {/* User Profile Section */}
            <div className="px-4 py-4 border-t border-secondary-100 bg-secondary-25">
                <div className="flex items-center gap-3 px-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 text-white font-semibold text-sm shadow-sm flex-shrink-0">
                        {getUserInitials()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-secondary-900 truncate">
                            {user?.email?.split('@')[0] || 'User'}
                        </p>
                        <p className="text-xs text-secondary-500 truncate">
                            {user?.email || 'No email'}
                        </p>
                    </div>
                    <button
                        className="flex-shrink-0 p-1.5 rounded-lg hover:bg-secondary-100 transition-colors"
                        aria-label="User menu"
                    >
                        <User size={18} className="text-secondary-400" />
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Nav;
