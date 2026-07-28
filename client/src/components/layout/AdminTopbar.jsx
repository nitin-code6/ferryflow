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
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
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
        <header className="h-16 bg-white/80 dark:bg-[#071426]/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-sky-950/20 px-6 flex items-center justify-between sticky top-0 z-30 transition-all duration-300">
            {/* Left Section */}
            <div className="flex items-center">
                {/* Mobile hamburger menu toggle */}
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="md:hidden p-2 rounded-xl text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-sky-950/30 transition-all mr-2"
                    aria-label="Toggle sidebar menu"
                >
                    <Menu size={20} />
                </button>

                <h1 className="text-lg font-bold tracking-tight text-slate-800 dark:text-white">
                    {user?.role === "staff" ? "Staff Dashboard" : "Admin Dashboard"}
                </h1>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">


                {/* Theme Toggle */}
                <button 
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    className="btn btn-ghost btn-circle text-slate-650 dark:text-slate-350 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-sky-950/30 transition-all"
                    aria-label="Toggle theme"
                >
                    {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                </button>

                {/* Profile Dropdown */}
                <div className="dropdown dropdown-end text-left">
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
                        className="dropdown-content menu menu-sm mt-3 z-30 p-2.5 shadow-xl bg-white dark:bg-[#0F1D36] border border-slate-200 dark:border-sky-950/80 rounded-2xl w-52 text-slate-750 dark:text-slate-200"
                    >
                        <div className="px-3 py-2 border-b border-slate-100 dark:border-sky-950/30 mb-2">
                            <p className="font-bold text-sm truncate">{userName}</p>
                            <p className="text-xs text-slate-450 dark:text-slate-400 truncate">{user?.email || "Administrator"}</p>
                        </div>
                        <li>
                            <a href="/" className="hover:bg-slate-100 dark:hover:bg-sky-950/30 py-2 rounded-lg font-medium">Home View</a>
                        </li>
                        <li>
                            <a href="/admin/settings" className="hover:bg-slate-100 dark:hover:bg-sky-950/30 py-2 rounded-lg font-medium">Settings</a>
                        </li>
                        <li className="border-t border-slate-100 dark:border-sky-950/30 mt-2 pt-2">
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