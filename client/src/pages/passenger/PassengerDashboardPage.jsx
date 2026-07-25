import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import SearchCard from "../../components/passenger/SearchCard";
import AlertCard from "../../components/passenger/AlertCard";
import { FiCalendar, FiCompass, FiAlertCircle, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router";
import { getAllAlerts } from "../../services/alertService";
import { getUserBookings } from "../../services/bookingService";
import { getAllSchedules } from "../../services/scheduleService";

const PassengerDashboardPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [schedules, setSchedules] = useState([]);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const alertsRes = await getAllAlerts();
                setAlerts(alertsRes.data || alertsRes.alerts || []);
            } catch (error) {
                console.error("Failed to load alerts:", error);
            }

            try {
                const bookingsRes = await getUserBookings();
                setBookings(bookingsRes.data || bookingsRes.bookings || []);
            } catch (error) {
                console.error("Failed to load user bookings:", error);
            }

            try {
                const schedulesRes = await getAllSchedules();
                setSchedules(schedulesRes.data || schedulesRes.schedules || []);
            } catch (error) {
                console.error("Failed to load schedules:", error);
            }
        };
        loadDashboardData();
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

    // Calculate active trips
    const upcomingTrips = bookings.filter((b) => {
        const status = (b.bookingStatus || b.status)?.toLowerCase();
        return status === "scheduled" || status === "boarding" || status === "confirmed" || status === "pending";
    });

    const scrollToSearch = () => {
        const element = document.getElementById("search-section");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleSelectSchedule = (sched) => {
        const query = new URLSearchParams({
            from: sched.route?.origin || "",
            to: sched.route?.destination || "",
            date: sched.departureTime ? new Date(sched.departureTime).toISOString().split("T")[0] : "",
            passengers: "1"
        }).toString();
        navigate(`/search-results?${query}`);
    };

    return (
        <div className="space-y-10 pb-16 max-w-6xl mx-auto px-4">
            {/* 1. Welcome Section */}
            <div className="text-left space-y-1">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#071426] dark:text-white leading-tight">
                    Good morning, {user?.name || "Passenger"} 👋
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Find your ferry, manage bookings, and travel smoothly.
                </p>
            </div>

            {/* 2. Main Search Ferry Section (Primary Focus) */}
            <div id="search-section" className="space-y-4">
                <SearchCard onSearch={handleSearch} />
            </div>

            {/* Content Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* 3. Your Upcoming Trips (Left Column) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center text-left">
                        <h3 className="font-bold text-lg text-[#071426] dark:text-white">
                            Your Upcoming Trips
                        </h3>
                        {upcomingTrips.length > 0 && (
                            <Link to="/my-bookings" className="text-xs font-black uppercase tracking-wider text-[#2563EB] dark:text-[#00A8FF] hover:underline">
                                View All Bookings →
                            </Link>
                        )}
                    </div>

                    {upcomingTrips.length === 0 ? (
                        <div className="p-10 text-center bg-white dark:bg-[#0F1D36]/80 rounded-[32px] border border-slate-200/80 dark:border-sky-950/60 shadow-sm space-y-4">
                            <div className="h-16 w-16 bg-[#2563EB]/10 rounded-full flex items-center justify-center text-2xl mx-auto">
                                🚢
                            </div>
                            <div className="space-y-1">
                                <p className="text-base font-bold text-[#071426] dark:text-white">No upcoming trips yet</p>
                                <p className="text-xs text-slate-450 dark:text-slate-400 font-medium">Your booked ferry tickets will appear here.</p>
                            </div>
                            <button
                                onClick={scrollToSearch}
                                className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#2563EB]/95 text-white font-bold text-xs shadow-md shadow-[#2563EB]/10 active:scale-[0.98] transition-all"
                            >
                                Book Your First Ferry
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {upcomingTrips.slice(0, 4).map((trip) => {
                                const tId = trip.ticketId || trip._id || trip.id;
                                const ferryName = trip.schedule?.ferry?.name || "Transit Vessel";
                                const routeName = trip.schedule?.route ? `${trip.schedule.route.origin} → ${trip.schedule.route.destination}` : "Ferry Voyage";
                                const depTime = trip.schedule?.departureTime ? new Date(trip.schedule.departureTime).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" }) : "Scheduled";
                                const seats = trip.seatNumbers?.join(", ") || trip.seats?.join(", ") || "General";
                                const status = trip.bookingStatus || trip.status || "confirmed";

                                return (
                                    <div key={tId} className="bg-white dark:bg-[#0F1D36] border border-slate-200 dark:border-sky-950/80 rounded-3xl p-6 shadow-sm hover:scale-[1.01] transition-all flex flex-col justify-between h-64 text-left">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-[#071426] dark:text-white text-base leading-tight">{ferryName}</h4>
                                                    <p className="text-[10px] text-sky-600 dark:text-sky-400 font-bold uppercase tracking-wider mt-1">{routeName}</p>
                                                </div>
                                                <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border border-emerald-500/20">
                                                    {status}
                                                </span>
                                            </div>

                                            <div className="border-t border-slate-100 dark:border-sky-950/40 my-3"></div>

                                            <div className="space-y-2 text-xs">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Departure</span>
                                                    <span className="font-bold text-[#071426] dark:text-white">{depTime}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Ticket ID</span>
                                                    <span className="font-mono font-bold text-[#071426] dark:text-white">{tId.substring(0, 10)}...</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Seats</span>
                                                    <span className="font-bold text-[#071426] dark:text-white">{seats}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <Link to="/my-bookings" className="mt-4 py-2.5 rounded-xl border border-[#2563EB]/40 dark:border-[#00A8FF]/30 text-[#2563EB] dark:text-[#00A8FF] hover:bg-[#2563EB] hover:text-white hover:border-transparent text-center text-xs font-bold transition-all">
                                            View Ticket
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Right Columns (Quick Actions & Alerts) */}
                <div className="space-y-8 lg:col-span-1 text-left">
                    {/* 4. Quick Actions */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg text-[#071426] dark:text-white">
                            Quick Actions
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                            <button onClick={scrollToSearch} className="flex items-center gap-3.5 p-4 rounded-2xl bg-white dark:bg-[#0F1D36] border border-slate-200 dark:border-sky-950/80 shadow-sm hover:scale-[1.01] transition-all text-left w-full group">
                                <span className="h-10 w-10 bg-[#2563EB]/10 text-[#2563EB] dark:text-[#00A8FF] rounded-xl flex items-center justify-center text-lg font-bold shrink-0">🚢</span>
                                <div>
                                    <p className="text-sm font-bold text-[#071426] dark:text-white">Book Ferry</p>
                                    <p className="text-[11px] text-slate-400 font-medium">Find routes and secure tickets</p>
                                </div>
                            </button>

                            <Link to="/my-bookings" className="flex items-center gap-3.5 p-4 rounded-2xl bg-white dark:bg-[#0F1D36] border border-slate-200 dark:border-sky-950/80 shadow-sm hover:scale-[1.01] transition-all text-left w-full group">
                                <span className="h-10 w-10 bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 rounded-xl flex items-center justify-center text-lg font-bold shrink-0">🎫</span>
                                <div>
                                    <p className="text-sm font-bold text-[#071426] dark:text-white">My Bookings</p>
                                    <p className="text-[11px] text-slate-400 font-medium">Manage and view your tickets</p>
                                </div>
                            </Link>

                            <a href="#alerts-section" className="flex items-center gap-3.5 p-4 rounded-2xl bg-white dark:bg-[#0F1D36] border border-slate-200 dark:border-sky-950/80 shadow-sm hover:scale-[1.01] transition-all text-left w-full group">
                                <span className="h-10 w-10 bg-amber-500/10 text-amber-600 dark:text-amber-450 rounded-xl flex items-center justify-center text-lg font-bold shrink-0">🔔</span>
                                <div>
                                    <p className="text-sm font-bold text-[#071426] dark:text-white">Live Alerts</p>
                                    <p className="text-[11px] text-slate-400 font-medium">Check travel service status</p>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* 5. Live Service Alerts */}
                    <div id="alerts-section" className="space-y-4">
                        <h3 className="font-bold text-lg text-[#071426] dark:text-white">
                            Live Service Alerts
                        </h3>
                        <div className="space-y-3">
                            {alerts.length === 0 ? (
                                <p className="text-xs font-semibold text-slate-450 dark:text-slate-500 bg-slate-100/50 dark:bg-sky-950/20 p-4 rounded-2xl border border-slate-200/40 dark:border-sky-950/40">
                                    All ferry routes operational. No active service alerts.
                                </p>
                            ) : (
                                alerts.slice(0, 3).map((alert) => (
                                    <AlertCard
                                        key={alert.id || alert._id}
                                        type={alert.type}
                                        message={alert.message}
                                        date={alert.date}
                                        routeName={alert.routeName}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 6. Upcoming Ferry Schedules Section */}
            <div className="space-y-6 text-left">
                <h3 className="font-bold text-lg text-[#071426] dark:text-white">
                    Upcoming Ferry Schedules
                </h3>
                {schedules.length === 0 ? (
                    <p className="text-sm font-semibold text-slate-450 dark:text-slate-500 bg-slate-100/50 dark:bg-sky-950/20 p-6 rounded-2xl border border-slate-200/40 dark:border-sky-950/40">
                        No upcoming schedules found.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {schedules.slice(0, 6).map((sched) => {
                            const origin = sched.route?.origin || "Kochi";
                            const destination = sched.route?.destination || "Waterway";
                            const ferryName = sched.ferry?.name || "Transit Vessel";
                            const depTime = sched.departureTime ? new Date(sched.departureTime).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) : "TBD";
                            
                            // Calculate duration dynamically or fallback
                            let duration = "20 min";
                            if (sched.departureTime && sched.arrivalTime) {
                                const diffMs = new Date(sched.arrivalTime) - new Date(sched.departureTime);
                                const diffMins = Math.round(diffMs / 60000);
                                if (diffMins > 0) duration = `${diffMins} min`;
                            }

                            // Status badge styling
                            const status = (sched.status || "On Time").toLowerCase();
                            let statusLabel = "🟢 On Time";
                            if (status === "delayed") statusLabel = "🔴 Delayed";
                            else if (status === "boarding") statusLabel = "🟡 Boarding";
                            else if (status === "cancelled") statusLabel = "❌ Cancelled";

                            return (
                                <div key={sched._id} className="bg-white dark:bg-[#0F1D36] border border-slate-200 dark:border-sky-950/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-56 hover:scale-[1.01] transition-all">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-white">
                                                <span>{origin}</span>
                                                <FiArrowRight className="text-[#2563EB] shrink-0" />
                                                <span>{destination}</span>
                                            </div>
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
                                                {statusLabel}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#071426] dark:text-white text-base leading-tight">🚢 {ferryName}</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 pt-1.5 text-[11px] text-slate-400 font-semibold">
                                            <div>
                                                <p className="uppercase tracking-wider text-[9px] text-slate-400/80">Departure</p>
                                                <p className="text-slate-700 dark:text-slate-200 font-bold mt-0.5">{depTime}</p>
                                            </div>
                                            <div>
                                                <p className="uppercase tracking-wider text-[9px] text-slate-400/80">Duration</p>
                                                <p className="text-slate-700 dark:text-slate-200 font-bold mt-0.5">{duration}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleSelectSchedule(sched)}
                                        className="mt-4 w-full py-2.5 rounded-xl border border-[#2563EB]/40 dark:border-[#00A8FF]/30 text-[#2563EB] dark:text-[#00A8FF] hover:bg-[#2563EB] hover:text-white hover:border-transparent text-center text-xs font-bold transition-all"
                                    >
                                        View Schedule
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PassengerDashboardPage;
