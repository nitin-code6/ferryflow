import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { FiAnchor, FiSearch, FiCompass, FiShield, FiCpu, FiTrendingUp, FiArrowRight, FiArrowLeft, FiAlertTriangle, FiCheckCircle, FiInfo } from "react-icons/fi";
import { getAllRoutes, getPopularRoutes } from "../../services/routeService";
import { getAllAlerts } from "../../services/alertService";
import { getAllFerries } from "../../services/ferryService";
import { getAllSchedules } from "../../services/scheduleService";
import toast from "react-hot-toast";

const LandingPage = () => {
    const navigate = useNavigate();
    const [ports, setPorts] = useState([]);
    const [activeRoutes, setActiveRoutes] = useState([]);
    const [fromTerminal, setFromTerminal] = useState("");
    const [toTerminal, setToTerminal] = useState("");
    const [journeyDate, setJourneyDate] = useState("");
    const [passengers, setPassengers] = useState("1");
    const [alerts, setAlerts] = useState([]);
    const [ferries, setFerries] = useState([]);
    const [schedules, setSchedules] = useState([]);

    useEffect(() => {
        // Import Google Fonts Inter for clean, simple typography
        const link = document.createElement("link");
        link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);

        const fetchPorts = async () => {
            try {
                const response = await getAllRoutes();
                if (response.success && response.routes) {
                    const uniquePorts = Array.from(
                        new Set(response.routes.flatMap((r) => [r.origin, r.destination]))
                    ).sort();
                    setPorts(uniquePorts);
                }
            } catch (err) {
                console.warn("Could not retrieve terminals for landing page search:", err);
            }

            try {
                const response = await getPopularRoutes();
                if (response.success && response.routes) {
                    setActiveRoutes(response.routes);
                }
            } catch (err) {
                console.warn("Could not retrieve popular routes:", err);
            }
        };

        const fetchAlerts = async () => {
            try {
                const response = await getAllAlerts();
                if (response.success && response.alerts) {
                    setAlerts(response.alerts.slice(0, 3));
                }
            } catch (err) {
                console.warn("Could not retrieve alerts:", err);
            }
        };

        const fetchFerriesList = async () => {
            try {
                const response = await getAllFerries();
                if (response.success && response.ferries) {
                    setFerries(response.ferries);
                }
            } catch (err) {
                console.warn("Could not retrieve ferries:", err);
            }
        };

        const fetchSchedulesList = async () => {
            try {
                const response = await getAllSchedules();
                if (response.success && response.schedules) {
                    setSchedules(response.schedules);
                }
            } catch (err) {
                console.warn("Could not retrieve schedules:", err);
            }
        };

        fetchPorts();
        fetchAlerts();
        fetchFerriesList();
        fetchSchedulesList();
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!fromTerminal || !toTerminal || !journeyDate) {
            toast.error("Please enter complete search details");
            return;
        }
        if (fromTerminal === toTerminal) {
            toast.error("Origin and Destination ports cannot be identical");
            return;
        }

        const query = new URLSearchParams({
            from: fromTerminal,
            to: toTerminal,
            date: journeyDate,
            passengers: passengers
        }).toString();

        navigate(`/search-results?${query}`);
    };

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#F8FAFC] dark:bg-[#071426] text-[#071426] dark:text-[#F8FAFC] flex flex-col font-['Inter',_sans-serif] transition-colors duration-300">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-br from-slate-50 via-sky-50/30 to-white dark:from-[#071426] dark:via-[#0b1b36] dark:to-[#0d2347] border-b border-slate-200 dark:border-sky-500/10 transition-all duration-300">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#00A8FF]/10 via-transparent to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                    {/* Left content column */}
                    <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#2563EB]/10 text-sky-600 dark:text-sky-400 border border-[#2563EB]/20 dark:border-sky-500/20">
                            <FiAnchor size={12} className="text-[#2563EB] dark:text-[#00A8FF]" /> Live Ferry Transportation Platform
                        </span>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#071426] dark:text-white leading-tight">
                            Sail Smooth.<br />
                            <span className="bg-gradient-to-r from-[#2563EB] to-[#00A8FF] dark:from-sky-300 dark:to-white bg-clip-text text-transparent">
                                Travel Smarter.
                            </span>
                        </h1>
                        <p className="text-base md:text-lg text-[#071426]/75 dark:text-sky-100/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                            Experience seamless ferry booking, real-time schedules, route information, and travel updates in one place.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
                            <button
                                onClick={() => scrollToSection("search-section")}
                                className="btn btn-primary bg-gradient-to-r from-[#2563EB] to-[#00A8FF] hover:opacity-95 text-white rounded-xl font-bold border-0 px-6 h-12 shadow-lg shadow-[#2563EB]/25 transition-all flex items-center justify-center gap-1.5"
                            >
                                Search Ferries <FiArrowRight />
                            </button>
                            <button
                                onClick={() => scrollToSection("popular-routes")}
                                className="btn btn-outline border-[#071426]/20 text-[#071426] hover:bg-[#071426]/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10 rounded-xl font-bold px-6 h-12 flex items-center justify-center"
                            >
                                Explore Routes
                            </button>
                        </div>
                    </div>

                    {/* Right SaaS Visualization Column */}
                    <div className="lg:col-span-5 flex flex-col gap-4 relative">
                        {/* Visualization Card */}
                        <div className="bg-white dark:bg-[#071426]/80 border border-slate-200 dark:border-sky-500/20 rounded-[32px] p-6 shadow-xl dark:shadow-2xl space-y-6 relative overflow-hidden transition-all">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#00A8FF]/10 rounded-full blur-xl pointer-events-none" />
                            
                            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-sky-950/50">
                                <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    Live Route Tracker
                                </span>
                                <span className="text-xs text-[#071426]/55 dark:text-sky-200/50 font-bold">Kochi Network</span>
                            </div>

                            {/* Connection visualization */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="text-left">
                                        <p className="text-[9px] font-black uppercase text-sky-600 dark:text-sky-400 tracking-wider">Terminal A</p>
                                        <p className="text-sm font-extrabold text-[#071426] dark:text-white">Fort Kochi</p>
                                    </div>
                                    <div className="flex-1 mx-4 flex items-center justify-center relative">
                                        <div className="w-full h-[2px] bg-sky-500/20 border-t border-dashed border-sky-400/40" />
                                        <div className="absolute bg-[#2563EB] p-1.5 rounded-full text-white shadow-md border border-sky-400/30 animate-bounce">
                                            🚢
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-black uppercase text-sky-600 dark:text-sky-400 tracking-wider">Terminal B</p>
                                        <p className="text-sm font-extrabold text-[#071426] dark:text-white">Vypin</p>
                                    </div>
                                </div>

                                {/* Status Details Panel */}
                                <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-[#0F1D36] p-4 rounded-2xl border border-slate-100 dark:border-sky-950/85">
                                    <div>
                                        <p className="text-[9px] font-bold uppercase text-sky-600 dark:text-sky-400 tracking-wider">Next Ferry</p>
                                        <p className="text-sm font-black text-[#071426] dark:text-white mt-0.5">10:30 AM</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold uppercase text-sky-600 dark:text-sky-400 tracking-wider">Ferry Status</p>
                                        <p className="text-sm font-black text-[#00A8FF] flex items-center gap-1 mt-0.5">
                                            On Time
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Secondary overlay card */}
                        <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-[#2563EB] to-[#00A8FF] p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-white/10 max-w-[200px] hidden sm:flex">
                            <div className="p-2 bg-white/10 rounded-xl text-white">
                                <FiTrendingUp size={16} />
                            </div>
                            <div>
                                <p className="text-[9px] font-extrabold uppercase text-white/70">Commute Time</p>
                                <p className="text-xs font-black text-white">Reduced by 25%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ferry Search Section */}
            <section id="search-section" className="py-12 -mt-8 relative z-20 max-w-6xl mx-auto px-6">
                <div className="bg-white dark:bg-[#0F1D36] border border-slate-200/80 dark:border-sky-950/80 rounded-[32px] p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 dark:border-sky-950 pb-5 mb-6 gap-4">
                        <div className="flex items-center gap-2">
                            <span className="p-2 bg-[#2563EB]/10 rounded-xl text-[#2563EB] dark:text-[#00A8FF]"><FiSearch size={20} /></span>
                            <div>
                                <h3 className="font-extrabold text-lg text-[#071426] dark:text-white">Find Your Ferry</h3>
                                <p className="text-xs text-slate-450 dark:text-slate-500 font-medium">Search schedules and lock seats instantly</p>
                            </div>
                        </div>
                        <span className="text-[10px] font-bold px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20 w-fit">
                            🟢 Port Terminals Active
                        </span>
                    </div>

                    <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-end">
                        <div className="flex flex-col text-left">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Departure Port</label>
                            <select
                                required
                                value={fromTerminal}
                                onChange={(e) => setFromTerminal(e.target.value)}
                                className="select select-bordered w-full rounded-xl text-sm font-semibold h-11 bg-slate-50 dark:bg-[#071426] border-slate-200 dark:border-sky-950 text-slate-800 dark:text-slate-100"
                            >
                                <option value="">Select departure...</option>
                                {ports.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col text-left">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Destination Port</label>
                            <select
                                required
                                value={toTerminal}
                                onChange={(e) => setToTerminal(e.target.value)}
                                className="select select-bordered w-full rounded-xl text-sm font-semibold h-11 bg-slate-50 dark:bg-[#071426] border-slate-200 dark:border-sky-950 text-slate-800 dark:text-slate-100"
                            >
                                <option value="">Select destination...</option>
                                {ports.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col text-left">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Departure Date</label>
                            <input
                                type="date"
                                required
                                min={new Date().toISOString().split("T")[0]}
                                value={journeyDate}
                                onChange={(e) => setJourneyDate(e.target.value)}
                                className="input input-bordered w-full rounded-xl text-sm font-semibold h-11 bg-slate-50 dark:bg-[#071426] border-slate-200 dark:border-sky-950 text-slate-800 dark:text-slate-100"
                            />
                        </div>

                        <div className="flex gap-3">
                            <div className="flex flex-col text-left flex-1">
                                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Passengers</label>
                                <select
                                    value={passengers}
                                    onChange={(e) => setPassengers(e.target.value)}
                                    className="select select-bordered w-full rounded-xl text-sm font-semibold h-11 bg-slate-50 dark:bg-[#071426] border-slate-200 dark:border-sky-950 text-slate-800 dark:text-slate-100"
                                >
                                    <option value="1">1 Passenger</option>
                                    <option value="2">2 Passengers</option>
                                    <option value="3">3 Passengers</option>
                                    <option value="4">4 Passengers</option>
                                    <option value="5">5 Passengers</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="btn border-0 text-white bg-gradient-to-r from-[#2563EB] to-[#00A8FF] rounded-xl font-bold h-11 px-5 shadow-lg shadow-[#2563EB]/15 hover:scale-[1.01] transition-all flex items-center justify-center gap-1 align-bottom self-end"
                            >
                                <FiSearch size={16} /> Search
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Popular Routes Section */}
            <section id="popular-routes" className="py-20 max-w-7xl mx-auto px-6">
                <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
                    <span className="px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] dark:text-[#00A8FF] text-xs font-bold uppercase tracking-wider">
                        Popular Waterways
                    </span>
                    <h2 className="text-3xl font-extrabold tracking-tight text-[#071426] dark:text-white">Most Booked Routes</h2>
                    <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        Discover the busiest transit path connections based on booking frequency data.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {(() => {
                        const routesData = activeRoutes.length > 0 ? activeRoutes : [
                            { origin: "Fort Kochi", destination: "Vypin", estimatedDuration: 10, fare: 10, bookingCount: 342, distance: 6.5 },
                            { origin: "Ernakulam", destination: "Fort Kochi", estimatedDuration: 20, fare: 20, bookingCount: 512, distance: 8.0 },
                            { origin: "Willington Island", destination: "Fort Kochi", estimatedDuration: 15, fare: 15, bookingCount: 219, distance: 4.8 }
                        ];
                        const maxBookingCount = Math.max(...routesData.map(r => r.bookingCount || 0));

                        return routesData.map((route, i) => {
                            const isMostBooked = (route.bookingCount || 0) === maxBookingCount && maxBookingCount > 0;
                            return (
                                <div key={route._id || i} className="group relative rounded-3xl overflow-hidden bg-white dark:bg-[#071426] border border-slate-200 dark:border-[#2563EB]/25 shadow-md hover:shadow-xl dark:hover:shadow-[0_25px_60px_rgba(37,99,235,0.18)] hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between p-8">
                                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#00A8FF]/5 dark:from-[#00A8FF]/10 via-transparent to-transparent pointer-events-none" />
                                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#2563EB]/10 dark:bg-[#2563EB]/15 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                                    
                                    {/* Top badge section */}
                                    <div className="flex justify-between items-center z-10 mb-4">
                                        {isMostBooked ? (
                                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 uppercase tracking-widest">
                                                🔥 Most Booked
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-[#2563EB]/10 dark:bg-[#00A8FF]/10 text-[#2563EB] dark:text-sky-300 border border-[#2563EB]/20 dark:border-[#00A8FF]/20 uppercase tracking-widest">
                                                Popular Route
                                            </span>
                                        )}
                                        <span className="text-[10px] text-[#071426]/40 dark:text-sky-200/50 font-bold uppercase tracking-wider">
                                            Kochi Port
                                        </span>
                                    </div>

                                    {/* Route Visualization */}
                                    <div className="my-4 py-2 relative z-10">
                                        <div className="flex items-center justify-between w-full relative px-1">
                                            <div className="text-left max-w-[45%]">
                                                <p className="text-[9px] font-bold text-sky-600 dark:text-sky-450 uppercase tracking-widest mb-0.5">Origin</p>
                                                <p className="text-sm font-black text-[#071426] dark:text-white leading-tight break-words">{route.origin}</p>
                                            </div>
                                            
                                            <div className="flex-1 mx-3 flex items-center justify-center">
                                                <span className="text-sky-500 dark:text-sky-400 font-black text-sm">→</span>
                                            </div>

                                            <div className="text-right max-w-[45%]">
                                                <p className="text-[9px] font-bold text-sky-600 dark:text-sky-450 uppercase tracking-widest mb-0.5">Destination</p>
                                                <p className="text-sm font-black text-[#071426] dark:text-white leading-tight break-words">{route.destination}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-3 gap-2 border-t border-b border-slate-100 dark:border-sky-950/40 py-4 my-2 z-10 text-left">
                                        <div>
                                            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Duration</p>
                                            <p className="text-xs font-extrabold text-[#071426] dark:text-white mt-0.5">{route.estimatedDuration || 20} min</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Distance</p>
                                            <p className="text-xs font-extrabold text-[#071426] dark:text-white mt-0.5">{route.distance || (route.origin === "Fort Kochi" ? "6.5" : route.origin === "Ernakulam" ? "8.0" : "4.8")} km</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Starting Fare</p>
                                            <p className="text-xs font-black text-[#2563EB] dark:text-[#00A8FF] mt-0.5">₹{route.fare || 15}</p>
                                        </div>
                                    </div>

                                    <div className="z-10 mt-2 text-left">
                                        <p className="text-xs text-[#071426]/70 dark:text-sky-100/60 font-semibold mb-3">
                                            {route.bookingCount || 0}+ passengers chose this route
                                        </p>
                                        <button
                                            onClick={() => {
                                                setFromTerminal(route.origin);
                                                setToTerminal(route.destination);
                                                scrollToSection("search-section");
                                            }}
                                            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#00A8FF] text-white font-bold text-xs hover:opacity-95 transition-all duration-300 shadow-md shadow-[#2563EB]/15 active:scale-[0.98]"
                                        >
                                            Check Availability
                                        </button>
                                    </div>
                                </div>
                            );
                        });
                    })()}
                </div>
            </section>

            {/* Live Ferry Status */}
            <section className="py-20 bg-slate-50 dark:bg-[#050D1A] border-t border-b border-slate-200/50 dark:border-sky-950/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                        <div className="space-y-2 text-left">
                            <span className="px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] dark:text-[#00A8FF] text-xs font-bold uppercase tracking-wider">
                                Live Operations
                            </span>
                            <h2 className="text-3xl font-extrabold tracking-tight text-[#071426] dark:text-white">Live Ferry Status</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                Check current ferry operations, delays, and upcoming departures.
                            </p>
                        </div>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2563EB]/10 text-[#2563EB] dark:text-[#00A8FF] rounded-full border border-[#2563EB]/20 text-xs font-bold w-fit">
                            🔄 Auto-refreshing status
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {(() => {
                            const statusData = schedules.length > 0 ? schedules.slice(0, 4).map(sch => ({
                                routeName: sch.route ? `${sch.route.origin} → ${sch.route.destination}` : "Kochi Route",
                                ferryName: sch.ferry ? sch.ferry.name : "Kochi Ferry",
                                departureTime: sch.departureTime || "12:00 PM",
                                status: sch.status || "active",
                                delay: sch.delay || 0
                            })) : [
                                { routeName: "Fort Kochi → Vypin", ferryName: "Vypin Express", departureTime: "10:30 AM", status: "active", delay: 0 },
                                { routeName: "Ernakulam → Fort Kochi", ferryName: "City Rider", departureTime: "11:00 AM", status: "delayed", delay: 10 },
                                { routeName: "Willington Island → Fort Kochi", ferryName: "Harbor Cruiser", departureTime: "11:15 AM", status: "active", delay: 0 },
                                { routeName: "Fort Kochi → Ernakulam", ferryName: "Muziris Cruiser", departureTime: "11:45 AM", status: "cancelled", delay: 0 }
                            ];

                            return statusData.map((sch, idx) => {
                                const isDelayed = sch.status === "delayed" || sch.delay > 0;
                                const isCancelled = sch.status === "cancelled" || sch.status === "inactive";
                                
                                let statusText = "🟢 On Time";
                                let badgeClass = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20";
                                
                                if (isCancelled) {
                                    statusText = "🔴 Cancelled";
                                    badgeClass = "bg-rose-500/10 text-rose-600 dark:text-rose-450 border border-rose-500/20";
                                } else if (isDelayed) {
                                    statusText = `🟡 Delayed ${sch.delay || 10}m`;
                                    badgeClass = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20";
                                }

                                return (
                                    <div key={idx} className="bg-white dark:bg-[#0F1D36] border border-slate-200 dark:border-sky-950/80 rounded-3xl p-6 shadow-sm hover:scale-[1.02] transition-all flex flex-col justify-between h-44 text-left">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest">Route</p>
                                            <p className="text-sm font-black text-[#071426] dark:text-white leading-tight">{sch.routeName}</p>
                                        </div>
                                        
                                        <div className="border-t border-slate-100 dark:border-sky-950/40 my-3"></div>
                                        
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate max-w-[60%]" title={sch.ferryName}>
                                                    🚢 {sch.ferryName}
                                                </span>
                                                <span className="text-xs font-black text-[#071426] dark:text-white shrink-0">
                                                    {sch.departureTime}
                                                </span>
                                            </div>
                                            
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Status</span>
                                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shrink-0 ${badgeClass}`}>
                                                    {statusText}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            });
                        })()}
                    </div>
                </div>
            </section>

            {/* Interactive Map Section */}
            <section className="py-20 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-5 space-y-6">
                        <span className="px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] dark:text-[#00A8FF] text-xs font-bold uppercase tracking-wider">
                            Interactive Transit Map
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#071426] dark:text-white leading-tight">
                            Explore Ferry Routes
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            Discover active Kochi waterways terminal locations, paths, and live crossway journeys in real-time.
                        </p>
                        <div className="pt-2">
                            <Link to="/routes" className="btn btn-primary rounded-xl font-bold bg-[#2563EB] hover:bg-[#2563EB]/95 border-0 text-white shadow-md shadow-[#2563EB]/10">
                                View Terminal Routes
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-7 bg-white dark:bg-[#0F1D36] border border-slate-200 dark:border-sky-950/80 rounded-3xl p-6 shadow-xl relative overflow-hidden h-80 flex flex-col justify-center items-center">
                        {/* Map Grid Pattern background */}
                        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-60" />
                        
                        {/* Connection lines */}
                        <svg className="absolute inset-0 w-full h-full text-[#2563EB]/40 dark:text-[#00A8FF]/20" xmlns="http://www.w3.org/2000/svg">
                            <line x1="25%" y1="35%" x2="50%" y2="65%" stroke="currentColor" strokeWidth="3" strokeDasharray="6 4" />
                            <line x1="50%" y1="65%" x2="75%" y2="30%" stroke="currentColor" strokeWidth="3" strokeDasharray="6 4" />
                            <line x1="25%" y1="35%" x2="75%" y2="30%" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                        </svg>

                        {/* Terminals */}
                        <div className="absolute top-[35%] left-[25%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                            <span className="relative flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A8FF] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#2563EB] border-2 border-white dark:border-[#071426]"></span>
                            </span>
                            <span className="text-[10px] font-black text-slate-800 dark:text-slate-200 mt-1 uppercase tracking-wider bg-white/80 dark:bg-[#071426]/85 px-2 py-0.5 rounded-md border border-slate-200 dark:border-sky-950">Ernakulam</span>
                        </div>

                        <div className="absolute top-[65%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                            <span className="relative flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-[#071426]"></span>
                            </span>
                            <span className="text-[10px] font-black text-slate-800 dark:text-slate-200 mt-1 uppercase tracking-wider bg-white/80 dark:bg-[#071426]/85 px-2 py-0.5 rounded-md border border-slate-200 dark:border-sky-950">Fort Kochi</span>
                        </div>

                        <div className="absolute top-[30%] left-[75%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                            <span className="relative flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A8FF] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#00A8FF] border-2 border-white dark:border-[#071426]"></span>
                            </span>
                            <span className="text-[10px] font-black text-slate-800 dark:text-slate-200 mt-1 uppercase tracking-wider bg-white/80 dark:bg-[#071426]/85 px-2 py-0.5 rounded-md border border-slate-200 dark:border-sky-950">Vypin Island</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Alerts & Announcements */}
            {alerts.length > 0 && (
                <section className="bg-rose-500/5 dark:bg-rose-550/5 border-t border-b border-rose-500/10 py-16">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="p-2 bg-rose-500/15 text-rose-500 rounded-xl"><FiAlertTriangle size={20} /></span>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">Active Service Alerts</h3>
                                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Delays, cancellations, and harbor notices</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {alerts.map((alert) => (
                                <div key={alert.id || alert._id} className="p-5 rounded-3xl bg-white dark:bg-[#0F1D36] border border-rose-500/10 dark:border-rose-500/20 shadow-sm space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${alert.type === 'delay' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-350'}`}>
                                            ⚠️ {alert.type || 'Notice'}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-bold">{alert.date ? new Date(alert.date).toLocaleDateString() : 'Active'}</span>
                                    </div>
                                    <h4 className="font-extrabold text-sm text-[#071426] dark:text-white">{alert.title || alert.routeName}</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">{alert.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Tourist Information Section */}
            <section className="py-20 max-w-7xl mx-auto px-6 space-y-12">
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                    <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider">
                        Tourist Guide
                    </span>
                    <h2 className="text-3xl font-extrabold tracking-tight text-[#071426] dark:text-white">Explore Kochi's Scenic Waterways</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        Learn about tourist island access, historic landmarks, and sunset cruises.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white dark:bg-[#0F1D36] border border-slate-200 dark:border-sky-950/80 p-6 rounded-3xl shadow-sm hover:scale-[1.01] transition-all flex flex-col gap-3">
                        <span className="text-4xl">🏛️</span>
                        <h4 className="font-extrabold text-lg text-[#071426] dark:text-white">Fort Kochi Heritage</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                            Direct water commute to historical landmarks, colonial architecture, and famous Chinese fishing nets.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#0F1D36] border border-slate-200 dark:border-sky-950/80 p-6 rounded-3xl shadow-sm hover:scale-[1.01] transition-all flex flex-col gap-3">
                        <span className="text-4xl">🌴</span>
                        <h4 className="font-extrabold text-lg text-[#071426] dark:text-white">Vypin Beach Access</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                            Regular passenger ferry routes providing direct access to Cherai Beach, lighthouses, and island culture.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#0F1D36] border border-slate-200 dark:border-sky-950/80 p-6 rounded-3xl shadow-sm hover:scale-[1.01] transition-all flex flex-col gap-3">
                        <span className="text-4xl">🌅</span>
                        <h4 className="font-extrabold text-lg text-[#071426] dark:text-white">Sunset Harbor Crossing</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                            Beautiful late afternoon schedule runs displaying scenery views across the Arabian Sea estuary.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact & Support Section */}
            <section className="bg-slate-50 dark:bg-[#050D1A] py-20 border-t border-slate-200 dark:border-sky-950/50">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-5 space-y-6">
                        <span className="px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] dark:text-[#00A8FF] text-xs font-bold uppercase tracking-wider">
                            Customer Assistance
                        </span>
                        <h2 className="text-3xl font-extrabold tracking-tight text-[#071426] dark:text-white leading-tight">
                            Need Help With Your Journey?
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            Our operators and helpdesks are available 24/7 to solve booking queries, schedules delays, or transit tickets queries.
                        </p>
                    </div>

                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-5 rounded-2xl bg-white dark:bg-[#0F1D36] border border-slate-200/60 dark:border-sky-950/80 shadow-sm flex items-start gap-4">
                            <span className="p-3 bg-[#2563EB]/10 text-[#2563EB] rounded-xl text-lg">📧</span>
                            <div>
                                <h4 className="font-extrabold text-sm text-[#071426] dark:text-white">Email Support</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5">ferryflow.team@gmail.com</p>
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-white dark:bg-[#0F1D36] border border-slate-200/60 dark:border-[#1E294B] shadow-sm flex items-start gap-4">
                            <span className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl text-lg">📞</span>
                            <div>
                                <h4 className="font-extrabold text-sm text-[#071426] dark:text-white">Phone Support</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5">+91 1800 123 4567</p>
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-white dark:bg-[#0F1D36] border border-slate-200/60 dark:border-[#1E294B] shadow-sm flex items-start gap-4 sm:col-span-2">
                            <span className="p-3 bg-[#2563EB]/10 text-[#2563EB] rounded-xl text-lg">📍</span>
                            <div>
                                <h4 className="font-extrabold text-sm text-[#071426] dark:text-white">Operations Center</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5">Ferry Operations Center, Kochi, Kerala, India</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;