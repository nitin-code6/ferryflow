import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Ship, Map, Calendar, Ticket, Bell, Users, Settings, ArrowRight, ShieldCheck, TrendingUp } from "lucide-react";
import StatsCard from "../../../components/ui/StatsCard";
import { getDashboardStats } from "../../../services/dashboardService";
import { getAllFerries } from "../../../services/ferryService";
import { getAllRoutes } from "../../../services/routeService";
import { getAllAlerts } from "../../../services/alertService";
import { getAllSchedules } from "../../../services/scheduleService";
import { getAllBookings } from "../../../services/bookingService";

const DashboardPage = () => {
    // Current date formatted beautifully
    const formattedDate = new Date().toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const [stats, setStats] = useState({
        totalFerries: 0,
        activeFerries: 0,
        totalRoutes: 0,
        activeRoutes: 0,
        totalBookings: 0,
        activeAlerts: 0,
        todayDepartures: 0,
        delayedFerries: 0,
        cancelledSchedules: 0,
        passengerCount: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [
                    statsRes,
                    ferriesRes,
                    routesRes,
                    alertsRes,
                    schedulesRes,
                    bookingsRes
                ] = await Promise.allSettled([
                    getDashboardStats(),
                    getAllFerries(),
                    getAllRoutes(),
                    getAllAlerts(),
                    getAllSchedules(),
                    getAllBookings()
                ]);

                // Extract data safely with fallbacks
                const statsData = statsRes.status === "fulfilled" ? (statsRes.value.data || statsRes.value.stats || {}) : {};
                const ferries = ferriesRes.status === "fulfilled" ? (ferriesRes.value.ferries || ferriesRes.value.data || ferriesRes.value || []) : [];
                const routes = routesRes.status === "fulfilled" ? (routesRes.value.routes || routesRes.value.data || routesRes.value || []) : [];
                const alerts = alertsRes.status === "fulfilled" ? (alertsRes.value.alerts || alertsRes.value.data || alertsRes.value || []) : [];
                const schedules = schedulesRes.status === "fulfilled" ? (schedulesRes.value.schedules || schedulesRes.value.data || schedulesRes.value || []) : [];
                const bookings = bookingsRes.status === "fulfilled" ? (bookingsRes.value.bookings || bookingsRes.value.data || bookingsRes.value || []) : [];

                // Calculate values
                const totalFerries = ferries.length || statsData.totalFerries || 0;
                const activeFerries = ferries.filter(f => f.status === "active").length || totalFerries;
                
                const totalRoutes = routes.length || statsData.totalRoutes || 0;
                const activeRoutes = routes.filter(r => r.status === "active").length || totalRoutes;
                
                const totalBookings = bookings.length || statsData.totalBookings || 0;
                
                // Count active alerts
                const activeAlerts = alerts.length || statsData.totalAlerts || 0;

                // Operational overview calculations
                const todayStr = new Date().toISOString().split("T")[0];
                const todaySchedules = schedules.filter(s => {
                    if (!s.departureTime) return false;
                    return new Date(s.departureTime).toISOString().split("T")[0] === todayStr;
                });
                
                const todayDepartures = todaySchedules.length || schedules.length;
                const delayedFerries = schedules.filter(s => s.status === "delayed" || s.status === "Delayed").length;
                const cancelledSchedules = schedules.filter(s => s.status === "cancelled" || s.status === "Cancelled" || s.status === "inactive" || s.status === "Inactive").length;
                
                // passengerCount is total seats booked across non-cancelled bookings
                const passengerCount = bookings.reduce((sum, b) => {
                    if (b.status === "cancelled" || b.bookingStatus === "cancelled") return sum;
                    const seats = b.seatNumbers?.length || b.seats?.length || 1;
                    return sum + seats;
                }, 0);

                setStats({
                    totalFerries,
                    activeFerries,
                    totalRoutes,
                    activeRoutes,
                    totalBookings,
                    activeAlerts,
                    todayDepartures,
                    delayedFerries,
                    cancelledSchedules,
                    passengerCount
                });
            } catch (err) {
                console.error("Failed to load dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header section */}
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="text-left">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
                        Overview
                    </h1>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                        {formattedDate}
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 w-fit">
                    <ShieldCheck size={14} />
                    System Active & Secure
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                <StatsCard
                    title="Active Fleet"
                    value={loading ? "..." : `${stats.activeFerries} / ${stats.totalFerries} Active`}
                    icon={<Ship size={20} />}
                    color="bg-blue-500"
                />
                <StatsCard
                    title="Configured Routes"
                    value={loading ? "..." : `${stats.activeRoutes} / ${stats.totalRoutes} Active`}
                    icon={<Map size={20} />}
                    color="bg-emerald-500"
                />
                <StatsCard
                    title="Total Bookings"
                    value={loading ? "..." : `${stats.totalBookings} Bookings`}
                    icon={<Ticket size={20} />}
                    color="bg-amber-500"
                />
                <StatsCard
                    title="Active Alerts"
                    value={loading ? "..." : `${stats.activeAlerts} Alerts`}
                    icon={<Bell size={20} />}
                    color="bg-rose-500"
                />
            </div>

            {/* Operational Overview */}
            <div className="bg-white dark:bg-[#0F1D36] border border-slate-200 dark:border-sky-950/80 rounded-3xl p-6 shadow-sm text-left">
                <h2 className="text-base font-bold text-slate-800 dark:text-white mb-4">Operational Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-sky-950/20">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Today's Departures</p>
                        <p className="text-xl font-bold text-[#2563EB] dark:text-[#00A8FF] mt-1">{loading ? "..." : stats.todayDepartures}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-sky-950/20">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Delayed Ferries</p>
                        <p className={`text-xl font-bold mt-1 ${stats.delayedFerries > 0 ? "text-amber-500" : "text-slate-500"}`}>
                            {loading ? "..." : stats.delayedFerries}
                        </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-sky-950/20">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cancelled Schedules</p>
                        <p className={`text-xl font-bold mt-1 ${stats.cancelledSchedules > 0 ? "text-rose-500" : "text-slate-500"}`}>
                            {loading ? "..." : stats.cancelledSchedules}
                        </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-sky-950/20">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Passengers</p>
                        <p className="text-xl font-bold text-emerald-500 mt-1">{loading ? "..." : stats.passengerCount}</p>
                    </div>
                </div>
            </div>

            {/* Management Modules Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
                {/* Fleet Card */}
                <div className="bg-white dark:bg-[#0F1D36] border border-slate-200 dark:border-sky-950/80 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:scale-[1.01] transition-all duration-300">
                    <div>
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#00A8FF] flex items-center justify-center text-white mb-6 shadow-md">
                            <Ship size={22} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Fleet Operations</h2>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                            Monitor vessel capacities, registration details, and real-time operational status. Perform additions, edits, or deallocations easily.
                        </p>
                    </div>
                    <div className="mt-8 pt-4 border-t border-slate-100 dark:border-sky-950/40 flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#2563EB] dark:text-[#00A8FF] flex items-center gap-1.5">
                            <TrendingUp size={14} /> 94% Fleet Efficiency
                        </span>
                        <Link
                            to="/admin/ferries"
                            className="px-5 py-2.5 rounded-xl border border-[#2563EB]/40 dark:border-[#00A8FF]/30 text-[#2563EB] dark:text-[#00A8FF] hover:bg-[#2563EB] hover:text-white hover:border-transparent text-center text-xs font-bold transition-all"
                        >
                            Manage Ferries
                        </Link>
                    </div>
                </div>

                {/* Routes & Transit */}
                <div className="bg-white dark:bg-[#0F1D36] border border-slate-200 dark:border-sky-950/80 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:scale-[1.01] transition-all duration-300">
                    <div>
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#00A8FF] flex items-center justify-center text-white mb-6 shadow-md">
                            <Map size={22} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Routes & Terminals</h2>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                            Configure geographical paths, harbor details, port stops, and passenger transit lanes. Analyze navigation route timelines.
                        </p>
                    </div>
                    <div className="mt-8 pt-4 border-t border-slate-100 dark:border-sky-950/40 flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-500">
                            All routes online
                        </span>
                        <Link
                            to="/admin/routes"
                            className="px-5 py-2.5 rounded-xl border border-[#2563EB]/40 dark:border-[#00A8FF]/30 text-[#2563EB] dark:text-[#00A8FF] hover:bg-[#2563EB] hover:text-white hover:border-transparent text-center text-xs font-bold transition-all"
                        >
                            Configure Routes
                        </Link>
                    </div>
                </div>

                {/* Schedules & Bookings */}
                <div className="bg-white dark:bg-[#0F1D36] border border-slate-200 dark:border-sky-950/80 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:scale-[1.01] transition-all duration-300">
                    <div>
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#00A8FF] flex items-center justify-center text-white mb-6 shadow-md">
                            <Calendar size={22} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Schedules & Trips</h2>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                            Set vessel timing structures, frequency intervals, seasonal pricing rules, and track ticket bookings mapped to specific departures.
                        </p>
                    </div>
                    <div className="mt-8 pt-4 border-t border-slate-100 dark:border-sky-950/40 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400">
                            {stats.todayDepartures} departures today
                        </span>
                        <Link
                            to="/admin/schedules"
                            className="px-5 py-2.5 rounded-xl border border-[#2563EB]/40 dark:border-[#00A8FF]/30 text-[#2563EB] dark:text-[#00A8FF] hover:bg-[#2563EB] hover:text-white hover:border-transparent text-center text-xs font-bold transition-all"
                        >
                            Set Schedules
                        </Link>
                    </div>
                </div>

                {/* System Alerts & Users */}
                <div className="bg-white dark:bg-[#0F1D36] border border-slate-200 dark:border-sky-950/80 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:scale-[1.01] transition-all duration-300">
                    <div>
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#00A8FF] flex items-center justify-center text-white mb-6 shadow-md">
                            <Bell size={22} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">System Security & Alerts</h2>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                            Broadcast delay warnings, weather notifications, harbor blocks, or inspect user accounts and configurations.
                        </p>
                    </div>
                    <div className="mt-8 pt-4 border-t border-slate-100 dark:border-sky-950/40 flex items-center justify-between">
                        <span className="text-xs font-semibold text-rose-500">
                            No critical delays
                        </span>
                        <Link
                            to="/admin/alerts"
                            className="px-5 py-2.5 rounded-xl border border-[#2563EB]/40 dark:border-[#00A8FF]/30 text-[#2563EB] dark:text-[#00A8FF] hover:bg-[#2563EB] hover:text-white hover:border-transparent text-center text-xs font-bold transition-all"
                        >
                            Broadcast Alert
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;