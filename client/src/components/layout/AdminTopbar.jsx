import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Bell, Moon, Sun, Search, Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { logoutAPI } from "../../services/authService";

const AdminTopbar = ({
    isMobileOpen,
    setIsMobileOpen,
    isCollapsed,
    setIsCollapsed,
}) => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
        window.dispatchEvent(new Event("themeChanged"));
    }, [theme]);

    const handleLogout = async () => {
        try {
            await logoutAPI();
            setUser(null);
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const userName = user?.name || "Admin";

    return (
        <header className="h-16 bg-base-100/50 backdrop-blur-xl border-b border-base-300/30 px-6 flex items-center justify-between sticky top-0 z-30 transition-all duration-300">
            {/* Left Section */}
            <div className="flex items-center">
                {/* Mobile hamburger menu toggle */}
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="md:hidden p-2 rounded-xl text-base-content/85 hover:bg-base-200/50 transition-all mr-2"
                    aria-label="Toggle sidebar menu"
                >
                    <Menu size={20} />
                </button>

                <h1 className="text-xl font-bold tracking-tight text-base-content">
                    Admin Dashboard
                </h1>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative hidden md:block">
                    <Search
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40"
                    />
                    <input
                        type="text"
                        placeholder="Type to search..."
                        className="w-64 pl-9 pr-4 h-10 bg-base-200/40 hover:bg-base-200 border border-base-300/30 rounded-xl text-sm transition-all duration-300 placeholder:text-base-content/40 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                </div>

                {/* Notifications */}
                <button className="btn btn-ghost btn-circle text-base-content/75 hover:text-base-content hover:bg-base-200/50 transition-all">
                    <Bell size={18} />
                </button>

                {/* Theme Toggle */}
                <button 
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    className="btn btn-ghost btn-circle text-base-content/75 hover:text-base-content hover:bg-base-200/50 transition-all"
                    aria-label="Toggle theme"
                >
                    {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                </button>

                {/* Profile Dropdown */}
                <div className="dropdown dropdown-end">
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost btn-circle avatar"
                    >
                        <div className="w-9 rounded-full ring-2 ring-primary/20 hover:ring-primary transition-all">
                            <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0EA5E9&color=fff`}
                                alt={userName}
                            />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu menu-sm mt-3 z-30 p-2.5 shadow-xl bg-base-100/95 backdrop-blur-xl border border-white/20 rounded-2xl w-52 text-base-content"
                    >
                        <div className="px-3 py-2 border-b border-base-300/30 mb-2">
                            <p className="font-bold text-sm truncate">{userName}</p>
                            <p className="text-xs text-base-content/60 truncate">{user?.email || "Administrator"}</p>
                        </div>
                        <li>
                            <a href="/" className="hover:bg-base-200/50 py-2 rounded-lg font-medium">Home View</a>
                        </li>
                        <li>
                            <a href="/admin/settings" className="hover:bg-base-200/50 py-2 rounded-lg font-medium">Settings</a>
                        </li>
                        <li className="border-t border-base-300/30 mt-2 pt-2">
                            <button 
                                onClick={handleLogout}
                                className="hover:bg-rose-500/10 text-rose-500 py-2 rounded-lg font-bold w-full text-left"
                            >
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default AdminTopbar;