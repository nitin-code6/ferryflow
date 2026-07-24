import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import SearchCard from "../../components/passenger/SearchCard";
import AlertCard from "../../components/passenger/AlertCard";
import { FiCalendar, FiCompass, FiAlertCircle, FiHelpCircle, FiBookOpen, FiActivity, FiMap } from "react-icons/fi";
import { Link } from "react-router";
import { getAllAlerts } from "../../services/alertService";

const PassengerDashboardPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const loadAlerts = async () => {
            try {
                const response = await getAllAlerts();
                setAlerts(response.alerts || []);
            } catch (error) {
                console.error("Failed to load alerts:", error);
            }
        };
        loadAlerts();
    }, []);

    const handleSearch = (searchParams) => {
        const query = new URLSearchParams({
            from: searchParams.fromTerminal,
            to: searchParams.toTerminal,
            date: searchParams.journeyDate,
            passengers: searchParams.passengerCount.toString()
        }).toString();
        navigate(`/search-results?${query}`);
    };

    // Placeholder data for passenger upcoming trips
    const upcomingTrips = [
        {
            id: "TKT-827391",
            ferryName: "Sea Breeze",
            route: "Seattle to Bainbridge Island",
            departure: "2026-07-24T08:30:00.000Z",
            arrival: "2026-07-24T09:15:00.000Z",
            status: "scheduled",
            seat: "Row 3, Seat A"
        },
        {
            id: "TKT-192837",
            ferryName: "Pacific Cruiser",
            route: "Seattle to Bainbridge Island",
            departure: "2026-07-28T14:45:00.000Z",
            arrival: "2026-07-28T15:30:00.000Z",
            status: "scheduled",
            seat: "Row 12, Seat C"
        }
    ];

    // Placeholder stats
    const stats = [
        { title: "Upcoming Trips", value: 2, icon: <FiCalendar size={20} className="text-primary" /> },
        { title: "Completed Trips", value: 14, icon: <FiActivity size={20} className="text-success" /> },
        { title: "Tickets Booked", value: 16, icon: <FiBookOpen size={20} className="text-info" /> }
    ];

    return (
        <div className="space-y-8 pb-12">
            {/* Hero Banner Section */}
            <div className="relative rounded-[28px] overflow-hidden bg-gradient-to-r from-[#1E40AF] via-[#0284C7] to-[#0EA5E9] p-6 sm:p-8 md:p-12 text-white shadow-xl">
                <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-15 hidden md:block select-none pointer-events-none">
                    {/* Visual waves pattern */}
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0,50 C30,40 70,60 100,50 L100,100 L0,100 Z" fill="white"></path>
                    </svg>
                </div>
                <div className="relative z-10 max-w-2xl space-y-4">
                    <span className="bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border border-white/10">
                        Operational Status: Normal
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                        Welcome Back, {user?.name || "Passenger"}
                    </h2>
                    <p className="text-sm sm:text-base text-white/80 max-w-lg font-medium">
                        Book ferry crossings, track schedules in real-time, and manage your tickets smoothly.
                    </p>
                </div>
            </div>

            {/* Search Scheduler Section */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <FiSearch className="text-primary" size={20} />
                    <h3 className="font-extrabold text-xl text-base-content">Find a Crossing</h3>
                </div>
                <SearchCard onSearch={handleSearch} />
            </div>

            {/* Content Split Column */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Columns (Upcoming Trips + Stats) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Stats Card Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-base-100/90 dark:bg-slate-900/90 border border-base-300/30 dark:border-white/5 rounded-2xl p-4 sm:p-5 shadow-md flex items-center gap-4">
                                <div className="p-3 bg-base-200 dark:bg-slate-800 rounded-xl shrink-0">
                                    {stat.icon}
                                </div>
                                <div className="truncate">
                                    <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-base-content/50">{stat.title}</p>
                                    <p className="text-xl sm:text-2xl font-black text-base-content mt-0.5">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Upcoming Trips */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-extrabold text-xl text-base-content flex items-center gap-2">
                                <FiCalendar className="text-primary" /> Upcoming Trips
                            </h3>
                            <Link to="/my-bookings" className="text-sm font-semibold text-primary hover:underline">
                                View all
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {upcomingTrips.map((trip) => (
                                <div key={trip.id} className="bg-base-100/90 dark:bg-slate-900/90 border border-base-300/30 dark:border-white/5 rounded-2xl p-5 shadow-md flex flex-col justify-between gap-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-extrabold text-base-content text-base">{trip.ferryName}</h4>
                                            <p className="text-[10px] text-base-content/50 font-bold uppercase tracking-wide mt-0.5">Route: {trip.route}</p>
                                        </div>
                                        <span className="badge badge-success badge-outline badge-sm capitalize font-bold">{trip.status}</span>
                                    </div>

                                    <div className="space-y-1.5 text-xs bg-base-200/40 dark:bg-slate-800/40 p-3 rounded-xl border border-base-300/10">
                                        <div className="flex justify-between">
                                            <span className="text-base-content/55 font-medium">Departure</span>
                                            <span className="font-bold text-base-content">
                                                {new Date(trip.departure).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-base-content/55 font-medium">Ticket ID</span>
                                            <span className="font-mono font-bold text-base-content">{trip.id}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-base-content/55 font-medium">Seat</span>
                                            <span className="font-semibold text-base-content">{trip.seat}</span>
                                        </div>
                                    </div>

                                    <Link to="/my-bookings" className="btn btn-outline btn-sm rounded-xl w-full border-base-300 hover:bg-base-200 dark:hover:bg-slate-800 text-xs font-bold">
                                        Ticket details
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Columns (Alerts + Quick Actions) */}
                <div className="space-y-8">
                    {/* Quick Actions */}
                    <div className="space-y-4">
                        <h3 className="font-extrabold text-xl text-base-content flex items-center gap-2">
                            <FiCompass className="text-primary" /> Quick Actions
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Link to="/dashboard" className="bg-base-100/90 dark:bg-slate-900/90 border border-base-300/30 dark:border-white/5 p-4 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col gap-2">
                                <span className="p-2.5 bg-primary/10 text-primary rounded-xl w-fit">🚢</span>
                                <span className="text-xs font-extrabold text-base-content">Book Ferry</span>
                            </Link>

                            <Link to="/my-bookings" className="bg-base-100/90 dark:bg-slate-900/90 border border-base-300/30 dark:border-white/5 p-4 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col gap-2">
                                <span className="p-2.5 bg-success/10 text-success rounded-xl w-fit">🎫</span>
                                <span className="text-xs font-extrabold text-base-content">My Bookings</span>
                            </Link>

                            <Link to="#" className="bg-base-100/90 dark:bg-slate-900/90 border border-base-300/30 dark:border-white/5 p-4 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col gap-2">
                                <span className="p-2.5 bg-info/10 text-info rounded-xl w-fit">📅</span>
                                <span className="text-xs font-extrabold text-base-content">Ferry Schedule</span>
                            </Link>

                            <Link to="#" className="bg-base-100/90 dark:bg-slate-900/90 border border-base-300/30 dark:border-white/5 p-4 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col gap-2">
                                <span className="p-2.5 bg-warning/10 text-warning rounded-xl w-fit">📞</span>
                                <span className="text-xs font-extrabold text-base-content">Support</span>
                            </Link>
                        </div>
                    </div>

                    {/* Ferry Alerts */}
                    <div className="space-y-4">
                        <h3 className="font-extrabold text-xl text-base-content flex items-center gap-2">
                            <FiAlertCircle className="text-primary" /> Live Service Alerts
                        </h3>
                        <div className="space-y-3">
                            {alerts.map((alert) => (
                                <AlertCard
                                    key={alert.id}
                                    type={alert.type}
                                    message={alert.message}
                                    date={alert.date}
                                    routeName={alert.routeName}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PassengerDashboardPage;
