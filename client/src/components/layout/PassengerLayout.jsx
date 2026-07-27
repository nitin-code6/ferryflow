import { Link, useNavigate, Outlet } from "react-router";
import { useState, useEffect } from "react";
import { FiMoon, FiSun, FiBell, FiSearch, FiUser, FiLogOut, FiMenu, FiX, FiCompass, FiCalendar, FiMessageSquare } from "react-icons/fi";
import logo from "../../assets/ferry-logo2.png";
import { useAuth } from "../../context/AuthContext";
import { logoutAPI } from "../../services/authService";
import { getAllAlerts } from "../../services/alertService";
import { socket } from "../../services/socketService";
import toast from "react-hot-toast";
import Footer from "../footer/Footer";

import backLight from "../../assets/backlight3.png";
import backDark from "../../assets/backDark.png";

const PassengerLayout = () => {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();
    
    const getTheme = () =>
        document.documentElement.getAttribute("data-theme") ||
        localStorage.getItem("theme") ||
        "light";

    const [theme, setTheme] = useState(getTheme());
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
        // Dispatch theme changed event
        window.dispatchEvent(new Event("themeChanged"));
    }, [theme]);

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

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const res = await getAllAlerts();
                const alertsList = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                const mappedAlerts = alertsList.map((a) => ({
                    id: a._id || a.id,
                    text: `${a.title || "Alert"}: ${a.message}`,
                    type: a.type || "general",
                    time: new Date(a.createdAt).toLocaleDateString()
                }));
                setNotifications(mappedAlerts);
            } catch (error) {
                console.error("Failed to load header alerts:", error);
            }
        };

        fetchAlerts();

        const handleNewAlert = (newAlert) => {
            const mapped = {
                id: newAlert._id || newAlert.id,
                text: `${newAlert.title || "Alert"}: ${newAlert.message}`,
                type: newAlert.type || "general",
                time: "Just now"
            };
            setNotifications((prev) => [mapped, ...prev]);
            toast.success(`⚠️ New Alert: ${newAlert.message}`, { duration: 5000 });
        };

        const handleDeletedAlert = ({ id }) => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        };

        socket.on("alert:created", handleNewAlert);
        socket.on("alert:deleted", handleDeletedAlert);

        return () => {
            socket.off("alert:created", handleNewAlert);
            socket.off("alert:deleted", handleDeletedAlert);
        };
    }, []);

    return (
        <div className="relative flex flex-col min-h-screen bg-[#F1F5F9] dark:bg-[#071426] text-[#071426] dark:text-[#F8FAFC] transition-all duration-500 overflow-x-hidden relative">
            {/* Background image with low opacity for depth */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.09] dark:hidden bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: `url(${backLight})` }} />
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] hidden dark:block bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: `url(${backDark})` }} />
            {/* Glowing radial gradient overlays */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-sky-500/10 dark:bg-sky-500/5 rounded-full blur-[150px] pointer-events-none" />

            {/* Navigation Header */}
            <header className="relative z-50 sticky top-0 w-full bg-base-100/70 dark:bg-slate-900/60 backdrop-blur-xl border-b border-base-300/30 dark:border-white/5 transition-all duration-300 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
                    {/* Logo & Navigation */}
                    <div className="flex items-center gap-8">
                        <Link to="/dashboard" className="flex items-center gap-3">
                            <img src={logo} alt="FerryFlow Logo" className="h-10 w-auto object-contain" />
                            <div>
                                <h1 className="text-xl font-black bg-gradient-to-r from-[#2563EB] via-[#0EA5E9] to-[#22D3EE] bg-clip-text text-transparent leading-none">
                                    FerryFlow
                                </h1>
                                <p className="text-[10px] font-semibold tracking-wider text-base-content/60 uppercase mt-0.5">
                                    Passenger
                                </p>
                            </div>
                        </Link>

                        {/* Desktop navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            <Link to="/" className="btn btn-ghost btn-sm rounded-xl font-medium text-base-content/85 hover:text-primary">
                                Home
                            </Link>
                            <Link to="/dashboard" className="btn btn-ghost btn-sm rounded-xl font-medium text-base-content/85 hover:text-primary">
                                Dashboard
                            </Link>
                            <Link to="/my-bookings" className="btn btn-ghost btn-sm rounded-xl font-medium text-base-content/85 hover:text-primary">
                                My Bookings
                            </Link>
                        </nav>
                    </div>

                    {/* Navbar Action elements */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Theme Toggle */}
                        <button
                            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                            className="btn btn-ghost btn-circle btn-sm sm:btn-md"
                            aria-label="Toggle theme"
                        >
                            {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
                        </button>

                        {/* Notifications */}
                        <div className="dropdown dropdown-end">
                            <button
                                tabIndex={0}
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="btn btn-ghost btn-circle btn-sm sm:btn-md relative"
                            >
                                <FiBell size={18} />
                                {notifications.length > 0 && (
                                    <>
                                        <span className="absolute top-1 right-1 sm:top-2 sm:right-2 h-2.5 w-2.5 bg-error rounded-full animate-ping"></span>
                                        <span className="absolute top-1 right-1 sm:top-2 sm:right-2 h-2.5 w-2.5 bg-error rounded-full"></span>
                                    </>
                                )}
                            </button>
                            <div
                                tabIndex={0}
                                className="dropdown-content p-3 shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-base-300/30 dark:border-slate-800 bg-base-100/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl w-80 sm:w-96 mt-2 space-y-2.5 z-50 text-base-content"
                            >
                                <div className="flex justify-between items-center pb-2 border-b border-base-300/30 dark:border-slate-800">
                                    <h4 className="font-bold text-sm">Notifications</h4>
                                    {notifications.length > 0 && (
                                        <span className="bg-rose-500/10 text-rose-500 border border-rose-500/20 py-0.5 px-2 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                                            New Alerts
                                        </span>
                                    )}
                                </div>
                                <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                                    {notifications.length === 0 ? (
                                        <div className="p-4 text-center text-xs text-base-content/40 font-bold">
                                            No active service alerts.
                                        </div>
                                    ) : (
                                        notifications.map((n) => (
                                            <div key={n.id} className="p-2.5 hover:bg-base-200/50 dark:hover:bg-slate-800/40 rounded-xl transition-all border border-base-300/10 dark:border-slate-800/50">
                                                <div className="flex flex-col gap-1.5">
                                                    <p className="text-xs leading-normal font-medium text-base-content/85 dark:text-slate-200">
                                                        {n.text}
                                                    </p>
                                                    <span className="text-[10px] text-base-content/40 font-semibold uppercase">{n.time}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Profile Dropdown */}
                        {user && (
                            <div className="dropdown dropdown-end">
                                <div
                                    tabIndex={0}
                                    role="button"
                                    className="btn btn-ghost btn-circle avatar border border-primary/20 hover:border-primary/50 transition-all duration-300 btn-sm sm:btn-md"
                                >
                                    <div className="w-8 sm:w-10 rounded-full">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0EA5E9&color=fff`}
                                            alt={user.name}
                                        />
                                    </div>
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content menu p-2 shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-base-300/30 bg-base-100/95 backdrop-blur-md rounded-2xl w-56 mt-2 z-50 text-base-content"
                                >
                                    <div className="px-4 py-2.5 border-b border-base-300/30 mb-2">
                                        <p className="font-bold text-sm truncate">{user.name}</p>
                                        <p className="text-xs text-base-content/50 truncate mt-0.5">{user.email}</p>
                                    </div>
                                    <li>
                                        <Link to="/my-bookings" className="rounded-xl flex gap-2.5 items-center font-medium">
                                            <FiCalendar size={15} /> My Bookings
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/profile" className="rounded-xl flex gap-2.5 items-center font-medium">
                                            <FiUser size={15} /> Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="rounded-xl flex gap-2.5 items-center font-medium text-error hover:bg-error/5"
                                        >
                                            <FiLogOut size={15} /> Sign Out
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}

                        {/* Mobile menu toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="btn btn-ghost btn-circle btn-sm sm:btn-md md:hidden"
                        >
                            {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Drawer */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-16 left-0 right-0 bg-base-100/95 border-b border-base-300/40 shadow-lg py-4 px-6 flex flex-col gap-2 z-40 text-base-content transition-all animate-fade-in">
                        <Link
                            to="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-base-200/50 font-bold transition-all text-base-content"
                        >
                            <FiCompass size={18} className="text-primary" /> Home
                        </Link>
                        <Link
                            to="/dashboard"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-base-200/50 font-bold transition-all text-base-content"
                        >
                            <FiCompass size={18} className="text-primary" /> Dashboard
                        </Link>
                        <Link
                            to="/my-bookings"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-base-200/50 font-bold transition-all text-base-content"
                        >
                            <FiCalendar size={18} className="text-primary" /> My Bookings
                        </Link>
                    </div>
                )}
            </header>

            {/* Main Area */}
            <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
                <Outlet />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default PassengerLayout;
