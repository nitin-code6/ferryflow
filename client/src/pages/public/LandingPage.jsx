import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { FiAnchor, FiSearch, FiCompass, FiShield, FiCpu, FiTrendingUp, FiArrowRight, FiArrowLeft, FiAlertTriangle, FiCheckCircle, FiInfo } from "react-icons/fi";
import { getAllRoutes, getPopularRoutes } from "../../services/routeService";
import { getAllAlerts } from "../../services/alertService";
import { getAllFerries } from "../../services/ferryService";
import { getAllSchedules } from "../../services/scheduleService";
import toast from "react-hot-toast";
import backlight3 from "../../assets/backlight3.png";
import backDark from "../../assets/backDark.png";

const useScrollReveal = () => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [element, setElement] = useState(null);

    useEffect(() => {
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsIntersecting(true);
                    observer.unobserve(element);
                }
            },
            { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [element]);

    return [setElement, isIntersecting];
};

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

    const [searchRef, searchVisible] = useScrollReveal();
    const [routesRef, routesVisible] = useScrollReveal();
    const [statusRef, statusVisible] = useScrollReveal();
    const [mapRef, mapVisible] = useScrollReveal();
    const [alertsRef, alertsVisible] = useScrollReveal();
    const [activeStatusIndex, setActiveStatusIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);

    useEffect(() => {
        // Import Google Fonts Inter for clean, simple typography
        const link = document.createElement("link");
        link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);

        const fetchPorts = async () => {
            try {
                const response = await getAllRoutes();
                const routesData = response.routes || response.data;
                if (response.success && routesData) {
                    const uniquePorts = Array.from(
                        new Set(routesData.flatMap((r) => [r.origin, r.destination]))
                    ).sort();
                    setPorts(uniquePorts);
                }
            } catch (err) {
                console.warn("Could not retrieve terminals for landing page search:", err);
            }

            try {
                const response = await getPopularRoutes();
                const routesData = response.routes || response.data;
                if (response.success && routesData) {
                    setActiveRoutes(routesData);
                }
            } catch (err) {
                console.warn("Could not retrieve popular routes:", err);
            }
        };

        const fetchAlerts = async () => {
            try {
                const response = await getAllAlerts();
                const alertsData = response.alerts || response.data;
                if (response.success && alertsData) {
                    setAlerts(alertsData.slice(0, 3));
                }
            } catch (err) {
                console.warn("Could not retrieve alerts:", err);
            }
        };

        const fetchFerriesList = async () => {
            try {
                const response = await getAllFerries();
                const ferriesData = response.ferries || response.data;
                if (response.success && ferriesData) {
                    setFerries(ferriesData);
                }
            } catch (err) {
                console.warn("Could not retrieve ferries:", err);
            }
        };

        const fetchSchedulesList = async () => {
            try {
                const response = await getAllSchedules();
                const schedulesData = response.schedules || response.data;
                if (response.success && schedulesData) {
                    setSchedules(schedulesData);
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
    useEffect(() => {
        setActiveStatusIndex(0);
        setIsTransitioning(false);
    }, [schedules]);

    useEffect(() => {
        const rowCount = schedules.length > 0 ? Math.min(schedules.length, 6) : 6;
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setActiveStatusIndex((prev) => prev + 1);
        }, 3000);
        return () => clearInterval(interval);
    }, [schedules.length]);

    useEffect(() => {
        const rowCount = schedules.length > 0 ? Math.min(schedules.length, 6) : 6;
        if (activeStatusIndex >= rowCount) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setActiveStatusIndex(0);
            }, 500); // Wait for transition duration (500ms) to complete
            return () => clearTimeout(timer);
        }
    }, [activeStatusIndex, schedules.length]);
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
        <div className="w-full min-h-screen overflow-x-hidden bg-transparent text-[#071426] dark:text-[#F8FAFC] flex flex-col font-['Inter',_sans-serif] transition-colors duration-300 relative">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-br from-slate-50 via-sky-50/20 to-slate-100 dark:from-[#071426] dark:via-[#0b1b36] dark:to-[#0d2347] border-b border-slate-200 dark:border-sky-500/10 transition-all duration-300">
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
                                <style>{`
                                    @keyframes shipSailing {
                                        0% { left: 0%; transform: scaleX(1); }
                                        47% { transform: scaleX(1); }
                                        50% { left: calc(100% - 28px); transform: scaleX(-1); }
                                        97% { transform: scaleX(-1); }
                                        100% { left: 0%; transform: scaleX(1); }
                                    }
                                    .animate-ship-sailing {
                                        position: absolute;
                                        animation: shipSailing 14s ease-in-out infinite;
                                    }
                                `}</style>
                                <div className="flex justify-between items-center">
                                    <div className="text-left">
                                        <p className="text-[9px] font-black uppercase text-sky-600 dark:text-sky-400 tracking-wider">Terminal A</p>
                                        <p className="text-sm font-extrabold text-[#071426] dark:text-white">Fort Kochi</p>
                                    </div>
                                    <div className="flex-1 mx-4 flex items-center relative h-8">
                                        <div className="w-full h-[2px] bg-sky-500/20 border-t border-dashed border-sky-400/40 absolute top-1/2 left-0 -translate-y-1/2" />
                                        <div className="bg-[#2563EB] p-1.5 rounded-full text-white shadow-md border border-sky-400/30 animate-ship-sailing flex items-center justify-center w-7 h-7">
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
                    </div>
                </div>
            </section>
            {/* Ferry Search Section */}
            <section id="search-section" ref={searchRef} className={`py-12 -mt-8 relative z-20 w-full max-w-7xl mx-auto px-6 transition-all duration-1000 transform ${searchVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
                <div className="bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 rounded-2xl p-6 sm:p-8 shadow-xl">
                    <div className="border-b border-slate-100 dark:border-sky-950 pb-4 mb-6 text-left">
                        <h3 className="font-extrabold text-xl text-[#071426] dark:text-white">Find Your Ferry</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Search schedules and terminal routes across the network</p>
                    </div>

                    <form onSubmit={handleSearchSubmit} className="grid grid-cols-12 gap-4 items-end">
                        <div className="flex flex-col text-left col-span-12 md:col-span-4">
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

                        <div className="flex flex-col text-left col-span-12 md:col-span-4">
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

                        <div className="flex flex-col text-left col-span-12 md:col-span-3">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Travel Date</label>
                            <input
                                type="date"
                                required
                                min={new Date().toISOString().split("T")[0]}
                                value={journeyDate}
                                onChange={(e) => setJourneyDate(e.target.value)}
                                className="input input-bordered w-full rounded-xl text-sm font-semibold h-11 bg-slate-50 dark:bg-[#071426] border-slate-200 dark:border-sky-950 text-slate-800 dark:text-slate-100"
                            />
                        </div>

                        <div className="col-span-12 md:col-span-1">
                            <button
                                type="submit"
                                className="btn border-0 text-white bg-gradient-to-r from-[#2563EB] to-[#00A8FF] rounded-xl font-bold h-11 w-full shadow-md hover:scale-[1.02] transition-all flex items-center justify-center gap-1.5"
                            >
                                <FiSearch size={16} />
                            </button>
                        </div>
                    </form>
                </div>
            </section>
            <section id="popular-routes" ref={routesRef} className={`py-20 w-full max-w-7xl mx-auto px-6 text-left transition-all duration-1000 transform ${routesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
                <div className="space-y-3 mb-10">
                    <span className="px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] dark:text-[#00A8FF] text-xs font-bold uppercase tracking-wider">
                        Popular Waterways
                    </span>
                    <h2 className="text-3xl font-extrabold tracking-tight text-[#071426] dark:text-white">Popular Ferry Routes</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Explore frequently travelled ferry connections.
                    </p>
                </div>

                <style>{`
                    @keyframes marqueeScroll {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-33.333%); }
                    }
                    .animate-marquee-scroll {
                        display: flex;
                        gap: 1.5rem;
                        width: max-content;
                        animation: marqueeScroll 28s linear infinite;
                    }
                    .animate-marquee-scroll:hover {
                        animation-play-state: paused;
                    }
                `}</style>

                <div className="overflow-hidden w-full relative py-4 mask-gradient-x">
                    <div className="animate-marquee-scroll">
                        {(() => {
                            const routesData = activeRoutes.length > 0 ? activeRoutes : [
                                { origin: "Fort Kochi", destination: "Vypin", estimatedDuration: 10, fare: 10, distance: 6.5 },
                                { origin: "Ernakulam", destination: "Fort Kochi", estimatedDuration: 20, fare: 20, distance: 8.0 },
                                { origin: "Willington Island", destination: "Fort Kochi", estimatedDuration: 15, fare: 15, distance: 4.8 }
                            ];
                            
                            // Triple the routes array to ensure seamless infinite circular loop
                            const marqueeRoutes = [...routesData, ...routesData, ...routesData];

                            return marqueeRoutes.map((route, i) => (
                                <div
                                    key={`${route._id || i}-${i}`}
                                    className="flex-shrink-0 w-80 bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1.5 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 flex flex-col justify-between"
                                >
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-sky-600 dark:text-sky-400 uppercase tracking-widest">Popular Route</span>
                                        </div>
                                        <div className="py-2 text-left space-y-2">
                                            <p className="text-lg font-black text-[#071426] dark:text-white leading-tight">{route.origin}</p>
                                            <div className="flex items-center pl-2">
                                                <div className="h-4 w-[2px] bg-[#2563EB]/30 dark:bg-sky-500/20" />
                                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold ml-2">Direct Link</span>
                                            </div>
                                            <p className="text-lg font-black text-[#071426] dark:text-white leading-tight">{route.destination}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-sky-950/40 pt-4 text-xs font-semibold">
                                            <div>
                                                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Duration</p>
                                                <p className="text-slate-800 dark:text-slate-200 mt-0.5 font-bold">{route.estimatedDuration} min</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Starting Fare</p>
                                                <p className="text-[#2563EB] dark:text-[#00A8FF] mt-0.5 font-black">From ₹{route.fare}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const today = new Date().toISOString().split("T")[0];
                                            navigate(`/search?from=${route.origin}&to=${route.destination}&date=${today}`);
                                        }}
                                        className="btn btn-sm btn-primary w-full mt-5 rounded-xl font-bold bg-[#2563EB] hover:bg-[#2563EB]/90 border-0 text-white h-10 shadow-sm transition-transform active:scale-[0.98]"
                                    >
                                        Check Availability
                                    </button>
                                </div>
                            ));
                        })()}
                    </div>
                </div>
            </section>

            {/* Live Ferry Status */}
            <section ref={statusRef} className={`py-20 bg-slate-50 dark:bg-[#050D1A] border-t border-b border-slate-200/50 dark:border-sky-500/10 text-left transition-all duration-1000 transform ${statusVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                        <div className="space-y-3">
                            <span className="px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] dark:text-[#00A8FF] text-xs font-bold uppercase tracking-wider">
                                Live Operations
                            </span>
                            <h2 className="text-3xl font-extrabold tracking-tight text-[#071426] dark:text-white">Live Ferry Status</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                Upcoming ferry departures and status information board.
                            </p>
                        </div>
                        <button 
                            onClick={() => navigate("/routes")}
                            className="btn btn-outline border-slate-350 dark:border-sky-950 text-[#071426] dark:text-white font-bold text-xs rounded-xl"
                        >
                            View All Schedules
                        </button>
                    </div>
                    <div className="bg-white/80 dark:bg-[#0A1120]/80 border border-slate-200/60 dark:border-sky-950/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
                        {/* Board Header Bar */}
                        <div className="flex justify-between items-center border-b border-slate-200/60 dark:border-sky-950/40 pb-4 mb-6">
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">Live FIDS Terminal</span>
                            </div>
                            <div className="text-[10px] font-mono font-bold text-amber-500 dark:text-[#00A8FF] tracking-wider uppercase">
                                UTC Clock // Active Departures
                            </div>
                        </div>

                        {/* FIDS Table Header */}
                        <div className="grid grid-cols-12 border-b border-slate-200/50 dark:border-sky-950/30 text-[10px] font-mono tracking-widest text-[#2563EB] dark:text-[#00A8FF] uppercase font-bold pb-3 px-4 min-w-[600px]">
                            <div className="col-span-3">Ferry Vessel</div>
                            <div className="col-span-5">Transit Route</div>
                            <div className="col-span-2">Scheduled</div>
                            <div className="col-span-2 text-right">Status</div>
                        </div>

                        {/* FIDS Scrolling Rows container (Fixed 3-row height: 56px * 3 = 168px) */}
                        <div className="overflow-hidden h-[168px] relative mt-2 min-w-[600px]">
                            {(() => {
                                const statusData = schedules.length > 0 ? schedules.slice(0, 6).map(sch => ({
                                    routeName: sch.route ? `${sch.route.origin} → ${sch.route.destination}` : "Kochi Route",
                                    ferryName: sch.ferry ? sch.ferry.name : "Kochi Ferry",
                                    departureTime: sch.departureTime ? new Date(sch.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "12:00 PM",
                                    status: sch.status || "scheduled"
                                })) : [
                                    { routeName: "Fort Kochi → Vypin", ferryName: "Vypin Express", departureTime: "08:30 AM", status: "boarding" },
                                    { routeName: "Ernakulam → Fort Kochi", ferryName: "City Rider", departureTime: "09:00 AM", status: "scheduled" },
                                    { routeName: "Willington Island → Fort Kochi", ferryName: "Harbor Cruiser", departureTime: "09:15 AM", status: "scheduled" },
                                    { routeName: "Gateway Terminal → East Bay", ferryName: "Sea Breeze", departureTime: "04:30 PM", status: "scheduled" },
                                    { routeName: "West Marina → Coastal Cove", ferryName: "Island Cruiser", departureTime: "02:00 PM", status: "scheduled" },
                                    { routeName: "Gateway Terminal → Island Beach", ferryName: "Ocean Express", departureTime: "10:30 AM", status: "scheduled" }
                                ];

                                return (
                                    <div 
                                        className={isTransitioning ? "transition-transform duration-500 ease-in-out" : ""}
                                        style={{ transform: `translateY(-${activeStatusIndex * 56}px)` }}
                                    >
                                        {[...statusData, ...statusData, ...statusData].map((sch, idx) => {
                                            // Center item in the 3-row visible window is always at index activeStatusIndex + 1
                                            const isMiddle = idx === activeStatusIndex + 1;
                                            
                                            let statusColor = "text-emerald-500 dark:text-emerald-450";
                                            let statusText = "ON TIME";
                                            let dotColor = "bg-emerald-500";
                                            let badgeBg = "bg-emerald-500/10 border-emerald-500/20";
                                            
                                            if (sch.status === "cancelled") {
                                                statusText = "CANCELLED";
                                                statusColor = "text-rose-500 dark:text-rose-450";
                                                dotColor = "bg-rose-500";
                                                badgeBg = "bg-rose-500/10 border-rose-500/20";
                                            } else if (sch.status === "boarding") {
                                                statusText = "BOARDING";
                                                statusColor = "text-amber-500 dark:text-amber-400";
                                                dotColor = "bg-amber-500";
                                                badgeBg = "bg-amber-500/10 border-amber-500/20";
                                            } else if (sch.status === "departed") {
                                                statusText = "DEPARTED";
                                                statusColor = "text-sky-500 dark:text-sky-400";
                                                dotColor = "bg-sky-500";
                                                badgeBg = "bg-sky-500/10 border-sky-500/20";
                                            }

                                            return (
                                                <div 
                                                    key={idx} 
                                                    className={`grid grid-cols-12 items-center h-14 px-4 font-mono text-xs font-semibold transition-all duration-500 rounded-xl ${isMiddle ? 'scale-[1.03] bg-slate-50/80 dark:bg-[#112240]/45 text-slate-800 dark:text-slate-150 border border-slate-200/50 dark:border-sky-950/40 shadow-sm' : 'opacity-40 text-slate-500 dark:text-slate-400'}`}
                                                >
                                                    <div className={`col-span-3 font-bold ${isMiddle ? 'text-[#2563EB] dark:text-sky-300' : ''}`}>
                                                        {sch.ferryName.toUpperCase()}
                                                    </div>
                                                    <div className={`col-span-5 font-bold ${isMiddle ? 'text-slate-800 dark:text-slate-200' : ''}`}>
                                                        {sch.routeName.toUpperCase().replace("→", "➔")}
                                                    </div>
                                                    <div className={`col-span-2 font-bold ${isMiddle ? 'text-[#2563EB] dark:text-amber-400 font-extrabold' : ''}`}>
                                                        {sch.departureTime}
                                                    </div>
                                                    <div className="col-span-2 text-right">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-bold text-[10px] bg-slate-100/50 dark:bg-[#112240]/45 border tracking-wider ${statusColor} ${badgeBg}`}>
                                                            <span className={`h-1.5 w-1.5 rounded-full ${dotColor} animate-pulse`} />
                                                            {statusText}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            </section>

            {/* Service Updates Section */}
            <section ref={alertsRef} className={`py-16 bg-white dark:bg-[#071426] border-b border-slate-200/50 dark:border-sky-500/10 text-left transition-all duration-1000 transform ${alertsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="p-2.5 bg-[#2563EB]/10 text-[#2563EB] dark:text-[#00A8FF] rounded-xl"><FiAlertTriangle size={20} /></span>
                        <div>
                            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Live Service Updates</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">Active terminal alerts and harbor operations notices</p>
                        </div>
                    </div>
                    {alerts.length === 0 ? (
                        <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 flex items-center gap-3 text-emerald-700 dark:text-emerald-400 text-sm font-bold">
                            <span>🟢</span> All ferry services are operating normally.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {alerts.map((alert) => {
                                const isDelay = alert.type === 'delay';
                                const isMaintenance = alert.type === 'maintenance';
                                
                                let typeLabel = "Info";
                                let borderClass = "border-l-[#2563EB]";
                                let badgeBg = "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400";
                                let statusDot = "bg-blue-500";
                                
                                if (isDelay) {
                                    typeLabel = "Delay";
                                    borderClass = "border-l-amber-500";
                                    badgeBg = "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400";
                                    statusDot = "bg-amber-500";
                                } else if (isMaintenance) {
                                    typeLabel = "Maintenance";
                                    borderClass = "border-l-rose-500";
                                    badgeBg = "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-450";
                                    statusDot = "bg-rose-500";
                                }

                                return (
                                    <div 
                                        key={alert.id || alert._id} 
                                        className={`p-5 rounded-2xl bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 shadow-sm border-l-4 ${borderClass} hover:scale-[1.03] active:scale-[0.99] transition-all duration-300 flex flex-col justify-between space-y-4`}
                                    >
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${badgeBg}`}>
                                                    {typeLabel}
                                                </span>
                                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1.5">
                                                    <span className={`h-1.5 w-1.5 rounded-full ${statusDot} animate-pulse`} />
                                                    Active
                                                </span>
                                            </div>
                                            <h4 className="font-extrabold text-sm text-[#071426] dark:text-white leading-snug">
                                                {alert.title || alert.routeName}
                                            </h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                                                {alert.message}
                                            </p>
                                        </div>
                                        <div className="text-right border-t border-slate-200/40 dark:border-sky-950/30 pt-3">
                                            <span className="text-[9px] text-slate-400 font-bold">
                                                Published: {alert.date ? new Date(alert.date).toLocaleDateString() : 'Today'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Why Choose FerryFlow */}
            <section className="py-20 w-full max-w-7xl mx-auto px-6 text-left">
                <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
                    <span className="px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] dark:text-[#00A8FF] text-xs font-bold uppercase tracking-wider">
                        Why Choose Us
                    </span>
                    <h2 className="text-3xl font-extrabold tracking-tight text-[#071426] dark:text-white">Built for Smooth Sailing</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Seamless ticket booking and real-time transit intelligence for daily commuters and travelers.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="p-6 rounded-2xl bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 space-y-3 shadow-sm hover:shadow-md transition-all">
                        <span className="text-3xl">📡</span>
                        <h4 className="font-extrabold text-base text-[#071426] dark:text-white">Real-time Updates</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                            Stay updated with live ferry statuses, delays, and scheduling changes.
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 space-y-3 shadow-sm hover:shadow-md transition-all">
                        <span className="text-3xl">🎫</span>
                        <h4 className="font-extrabold text-base text-[#071426] dark:text-white">Easy Booking</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                            Book tickets online and select your preferred cabin seats dynamically.
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 space-y-3 shadow-sm hover:shadow-md transition-all">
                        <span className="text-3xl">🔒</span>
                        <h4 className="font-extrabold text-base text-[#071426] dark:text-white">Secure Tickets</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                            Encrypted boarding passes saved securely in your profile.
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 space-y-3 shadow-sm hover:shadow-md transition-all">
                        <span className="text-3xl">🗓️</span>
                        <h4 className="font-extrabold text-base text-[#071426] dark:text-white">Smart Scheduling</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                            Multiple daily schedule frequencies balanced for passenger peak hours.
                        </p>
                    </div>
                </div>
            </section>

            {/* Interactive Map Section */}
            <section ref={mapRef} className={`py-20 w-full max-w-7xl mx-auto px-6 transition-all duration-1000 transform ${mapVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-5 space-y-6 text-left">
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

                    <div className="lg:col-span-7 bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 rounded-3xl p-6 shadow-xl relative overflow-hidden h-80 flex flex-col justify-center items-center">
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

            {/* Tourist Information Section */}
            <section className="py-20 w-full max-w-7xl mx-auto px-6 space-y-12 text-left">
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
                    <div className="bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 p-6 rounded-3xl shadow-sm hover:scale-[1.01] transition-all flex flex-col gap-3">
                        <span className="text-4xl">🏛️</span>
                        <h4 className="font-extrabold text-lg text-[#071426] dark:text-white">Fort Kochi Heritage</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                            Direct water commute to historical landmarks, colonial architecture, and famous Chinese fishing nets.
                        </p>
                    </div>

                    <div className="bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 p-6 rounded-3xl shadow-sm hover:scale-[1.01] transition-all flex flex-col gap-3">
                        <span className="text-4xl">🌴</span>
                        <h4 className="font-extrabold text-lg text-[#071426] dark:text-white">Vypin Beach Access</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                            Regular passenger ferry routes providing direct access to Cherai Beach, lighthouses, and island culture.
                        </p>
                    </div>

                    <div className="bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 p-6 rounded-3xl shadow-sm hover:scale-[1.01] transition-all flex flex-col gap-3">
                        <span className="text-4xl">🌅</span>
                        <h4 className="font-extrabold text-lg text-[#071426] dark:text-white">Sunset Harbor Crossing</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                            Beautiful late afternoon schedule runs displaying scenery views across the Arabian Sea estuary.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact & Support Section */}
            <section className="bg-slate-50 dark:bg-[#050D1A] py-20 border-t border-slate-200 dark:border-sky-950/50 text-left">
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
                        <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 shadow-sm flex items-start gap-4">
                            <span className="p-3 bg-[#2563EB]/10 text-[#2563EB] rounded-xl text-lg">📧</span>
                            <div>
                                <h4 className="font-extrabold text-sm text-[#071426] dark:text-white">Email Support</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5">ferryflow.team@gmail.com</p>
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 shadow-sm flex items-start gap-4">
                            <span className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl text-lg">📞</span>
                            <div>
                                <h4 className="font-extrabold text-sm text-[#071426] dark:text-white">Phone Support</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5">+91 1800 123 4567</p>
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 shadow-sm flex items-start gap-4 sm:col-span-2">
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