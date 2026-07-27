import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { logoutAPI } from "../../services/authService";
import toast from "react-hot-toast";
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
    MessageSquare,
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
        name: "Inquiries",
        icon: MessageSquare,
        path: "/admin/inquiries",
    },
    {
        name: "User Management",
        icon: Users,
        path: "/admin/register",
        role: "admin",
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
    const navigate = useNavigate();
    const { user, setUser } = useAuth();

    const handleLogout = async () => {
        try {
            await logoutAPI();
            setUser(null);
            toast.success("Successfully logged out");
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Logout failed. Please try again.");
        }
    };

    const filteredMenuItems = menuItems.filter(
        (item) => !item.role || item.role === user?.role
    );

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
            bg-white
            dark:bg-[#0A1120]
            border-r
            border-slate-200
            dark:border-sky-950/40
            transition-all
            duration-300
            ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            ${isCollapsed ? "w-20" : "w-64"}
            `}
        >
            {/* Header / Logo */}
            <div className="flex items-center h-16 px-6 border-b border-slate-200/60 dark:border-sky-950/20 shrink-0 select-none">
                {isCollapsed ? (
                    <span className="text-2xl mx-auto" title="FerryFlow">🚢</span>
                ) : (
                    <h1 className="text-xl font-bold bg-gradient-to-r from-[#2563EB] to-[#00A8FF] bg-clip-text text-transparent">
                        🚢 FerryFlow
                    </h1>
                )}
            </div>

            {/* Menu Links */}
            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2.5 scrollbar-thin">
                {filteredMenuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsMobileOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-250 hover:scale-[1.02] active:scale-[0.98] border-l-4 ${
                                    isActive
                                        ? "bg-[#2563EB]/10 dark:bg-[#00A8FF]/10 text-[#2563EB] dark:text-[#00A8FF] font-bold border-[#2563EB] dark:border-[#00A8FF] pl-3"
                                        : "border-transparent text-slate-600 dark:text-slate-450 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-sky-950/30"
                                } ${isCollapsed ? "justify-center px-0 pl-0 border-l-0" : ""}`
                            }
                            title={isCollapsed ? item.name : ""}
                        >
                            <Icon size={18} className="shrink-0" />
                            <span
                                className={`
                                transition-all
                                duration-200
                                text-sm
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
            <div className="p-4 border-t border-slate-200 dark:border-sky-950/20 shrink-0 flex flex-col gap-2.5">
                {/* Logout Button */}
                {isCollapsed ? (
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center p-3 rounded-xl border border-rose-500/20 hover:border-rose-500 bg-rose-500/5 hover:bg-rose-500 text-rose-500 hover:text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] w-full"
                        title="Logout"
                        aria-label="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                ) : (
                    <button
                        onClick={handleLogout}
                        className="btn border border-rose-500/20 hover:border-rose-500 bg-rose-500/5 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl w-full gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] font-semibold"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                )}

                {/* Sidebar Collapse Toggle Button (Tablet/Desktop only) */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden md:flex items-center justify-center p-2.5 rounded-xl border border-slate-200 dark:border-sky-950/80 bg-slate-100 dark:bg-slate-900/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all duration-200 w-full"
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