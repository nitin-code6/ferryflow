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

const AdminSidebar = () => {
    return (
        <aside className="w-64 bg-base-100 border-r min-h-screen p-5 flex flex-col">
            <h1 className="text-2xl font-bold text-primary mb-10">
                🚢 FerryFlow
            </h1>

            <nav className="flex flex-col gap-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive
                                    ? "bg-primary text-primary-content"
                                    : "hover:bg-base-200"
                                }`
                            }
                        >
                            <Icon size={20} />
                            <span>{item.name}</span>
                        </NavLink>
                    );
                })}
            </nav>

            <div className="mt-auto">
                <button className="btn btn-error btn-outline w-full gap-2">
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;