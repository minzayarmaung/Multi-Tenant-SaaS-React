
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Role } from "../../../data/enums/Role";
import { useAuth } from "../../../security/hooks/useAuth";

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location         = useLocation();
    const navigate         = useNavigate();

    const handleLogout = async () => {
        await logout();
        toast.success("Logged out successfully.");
    };

    const navItems = [
        {
            label: "Dashboard",
            path: "/dashboard",
            icon: <DashboardIcon />,
            show: true,
        },
        {
            label: "Companies",
            path: "/companies",
            icon: <BuildingIcon />,
            show: user?.role === Role.SYSTEM_ADMIN,
        },
        {
            label: "Users",
            path: "/users",
            icon: <UsersIcon />,
            show: user?.role !== Role.USER,
        },
        {
            label: "Leads",
            path: "/leads",
            icon: <LeadsIcon />,
            show: user?.role !== Role.SYSTEM_ADMIN,
        },
    ].filter((item) => item.show);

    return (
        <aside className="w-64 min-h-screen bg-slate-800 border-r border-slate-700
                          flex flex-col">

            {/* Brand */}
            <div className="px-6 py-5 border-b border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center
                                    justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-white font-semibold text-sm">LeadFlow</p>
                        <p className="text-slate-400 text-xs">Management</p>
                    </div>
                </div>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                                        text-sm font-medium transition-all duration-150 text-left
                                        ${isActive
                                            ? "bg-blue-600 text-white"
                                            : "text-slate-400 hover:text-white hover:bg-slate-700"
                                        }`}
                        >
                            <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            {/* User Info + Logout */}
            <div className="px-3 py-4 border-t border-slate-700">
                <div className="px-3 py-2 mb-2">
                    <p className="text-white text-sm font-medium truncate">{user?.email}</p>
                    <span className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400
                                     border border-blue-500/20 rounded-full mt-1 inline-block">
                        {user?.role}
                    </span>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                               text-sm font-medium text-slate-400 hover:text-red-400
                               hover:bg-red-500/10 transition-all duration-150"
                >
                    <LogoutIcon />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

// ── Icons ─────────────────────────────────────────────
const DashboardIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0
                 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2
                 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2
                 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0
                 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);
const BuildingIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9
                 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1
                 1 0 011 1v5m-4 0h4" />
    </svg>
);
const UsersIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7
                 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0
                 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const LeadsIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0
                 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2
                 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2
                 2 0 01-2-2z" />
    </svg>
);
const LogoutIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 flex-shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0
                 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

export default Sidebar;