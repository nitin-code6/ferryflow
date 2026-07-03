import { NavLink } from "react-router";
import {
    LayoutDashboard,
    Ship,
    Map,
    CalendarDays,
    Ticket,
    Bell,
    Users,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

const menuItems = [
    {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/admin/dashboard",
    },
    {
        name: "Ferries",
        icon: Ship,
        path: "/admin/ferries",
    },
    {
        name: "Routes",
        icon: Map,
        path: "/admin/routes",
    },
    {
        name: "Schedules",
        icon: CalendarDays,
        path: "/admin/schedules",
    },
    {
        name: "Bookings",
        icon: Ticket,
        path: "/admin/bookings",
    },
    {
        name: "Alerts",
        icon: Bell,
        path: "/admin/alerts",
    },
    {
        name: "Users",
        icon: Users,
        path: "/admin/users",
    },
    {
        name: "Settings",
        icon: Settings,
        path: "/admin/settings",
    },
];

const AdminSidebar = ({
    isMobileOpen,
    setIsMobileOpen,
    isCollapsed,
    setIsCollapsed,
}) => {
    return (
        <aside
            className={`
            fixed
            top-0
            bottom-0
            left-0
            z-50
            flex
            flex-col
            bg-base-100/50
            backdrop-blur-xl
            border-r
            border-base-300/30
            transition-all
            duration-300
            ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            ${isCollapsed ? "w-20" : "w-64"}
            `}
        >
            {/* Header / Logo */}
            <div className="flex items-center h-16 px-6 border-b border-base-300/20 shrink-0 select-none">
                {isCollapsed ? (
                    <span className="text-2xl mx-auto" title="FerryFlow">🚢</span>
                ) : (
                    <h1 className="text-2xl font-black bg-gradient-to-r from-[#2563EB] via-[#0EA5E9] to-[#22D3EE] bg-clip-text text-transparent">
                        🚢 FerryFlow
                    </h1>
                )}
            </div>

            {/* Menu Links */}
            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2.5 scrollbar-thin">
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsMobileOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                                    isActive
                                        ? "bg-gradient-to-r from-[#2563EB]/15 via-[#0EA5E9]/10 to-[#22D3EE]/5 border-l-4 border-[#0EA5E9] text-primary font-bold shadow-[0_4px_20px_rgba(14,165,233,0.06)] pl-3"
                                        : "text-base-content/70 hover:text-base-content hover:bg-base-200/50 border-l-4 border-transparent"
                                } ${isCollapsed ? "justify-center px-0 pl-0 border-l-0" : ""}`
                            }
                            title={isCollapsed ? item.name : ""}
                        >
                            <Icon size={20} className="shrink-0" />
                            <span
                                className={`
                                transition-all
                                duration-200
                                ${isCollapsed ? "hidden opacity-0" : "block opacity-100"}
                                `}
                            >
                                {item.name}
                            </span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* Sticky Actions Footer */}
            <div className="p-4 border-t border-base-300/20 shrink-0 flex flex-col gap-2.5">
                {/* Logout Button */}
                {isCollapsed ? (
                    <button
                        className="flex items-center justify-center p-3 rounded-xl border border-rose-500/20 hover:border-rose-500 bg-rose-500/5 hover:bg-rose-500 text-rose-500 hover:text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] w-full"
                        title="Logout"
                        aria-label="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                ) : (
                    <button className="btn border border-rose-500/20 hover:border-rose-500 bg-rose-500/5 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl w-full gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] font-semibold">
                        <LogOut size={18} />
                        Logout
                    </button>
                )}

                {/* Sidebar Collapse Toggle Button (Tablet/Desktop only) */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden md:flex items-center justify-center p-2.5 rounded-xl border border-base-300/30 bg-base-200/50 hover:bg-base-200 text-base-content/70 hover:text-base-content transition-all duration-200 w-full"
                    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;