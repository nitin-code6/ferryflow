import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { FiAnchor, FiSearch, FiCompass, FiShield, FiCpu, FiTrendingUp, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { getAllRoutes } from "../../services/routeService";
import Navbar from "../../components/navbar/Navbar";
import toast from "react-hot-toast";

const LandingPage = () => {
    const navigate = useNavigate();
    const [ports, setPorts] = useState([]);
    const [fromTerminal, setFromTerminal] = useState("");
    const [toTerminal, setToTerminal] = useState("");
    const [journeyDate, setJourneyDate] = useState("");

    useEffect(() => {
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
        };
        fetchPorts();
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
            passengers: "1"
        }).toString();

        // Redirect to booking dashboard (which requires login/auth)
        navigate(`/login?redirect=/search-results?${encodeURIComponent(query)}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
            <Navbar />

            {/* Hero Section */}
            <header className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#0284C7]">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-400/20 via-transparent to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                    <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-400/10 text-sky-300 border border-sky-400/20">
                            <FiAnchor size={12} /> Live Transit Platform
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
                            Sail Smooth.<br />
                            <span className="bg-gradient-to-r from-sky-300 via-blue-200 to-white bg-clip-text text-transparent">
                                Travel Smarter.
                            </span>
                        </h1>
                        <p className="text-base md:text-lg text-sky-100/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                            Experience a premium passenger dashboard, live schedule queries, and interactive seating selections engineered for modern commuters.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
                            <Link
                                to="/login"
                                className="btn btn-primary bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl font-bold border-0 px-6 h-12 shadow-lg hover:shadow-sky-500/20 transition-all flex items-center justify-center gap-1.5"
                            >
                                Book Tickets Now <FiArrowRight />
                            </Link>
                            <a
                                href="#features"
                                className="btn btn-outline border-white/20 text-white hover:bg-white/10 rounded-xl font-bold px-6 h-12 flex items-center justify-center"
                            >
                                Learn More
                            </a>
                        </div>
                    </div>

                    {/* Quick Search Widget */}
                    <div className="lg:col-span-5 bg-white/95 dark:bg-slate-900/90 border border-slate-200/50 dark:border-white/5 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-5 text-slate-800 dark:text-slate-100">
                        <div className="border-b border-slate-100 dark:border-white/10 pb-3 flex items-center gap-2">
                            <FiSearch className="text-sky-500" />
                            <h3 className="font-extrabold text-base">Find a Ferry</h3>
                        </div>

                        <form onSubmit={handleSearchSubmit} className="space-y-4">
                            <div className="flex flex-col text-left">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Departure Port</label>
                                <select
                                    required
                                    value={fromTerminal}
                                    onChange={(e) => setFromTerminal(e.target.value)}
                                    className="select select-bordered w-full rounded-xl text-sm font-semibold h-11 bg-slate-50 dark:bg-slate-800"
                                >
                                    <option value="">Select departure...</option>
                                    {ports.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col text-left">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Destination Port</label>
                                <select
                                    required
                                    value={toTerminal}
                                    onChange={(e) => setToTerminal(e.target.value)}
                                    className="select select-bordered w-full rounded-xl text-sm font-semibold h-11 bg-slate-50 dark:bg-slate-800"
                                >
                                    <option value="">Select destination...</option>
                                    {ports.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col text-left">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Departure Date</label>
                                <input
                                    type="date"
                                    required
                                    min={new Date().toISOString().split("T")[0]}
                                    value={journeyDate}
                                    onChange={(e) => setJourneyDate(e.target.value)}
                                    className="input input-bordered w-full rounded-xl text-sm font-semibold h-11 bg-slate-50 dark:bg-slate-800"
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn w-full h-11 border-0 text-white bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl font-bold mt-2 shadow-lg shadow-sky-500/10 hover:scale-[1.01] transition-all"
                            >
                                Search Schedules
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section id="features" className="py-20 max-w-7xl mx-auto px-6 space-y-16">
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight">Designed for Modern Commutes</h2>
                    <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                        FerryFlow builds premium interfaces similar to Stripe and Airbnb to simplify transport bookings.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Live Tracking */}
                    <div className="bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-white/5 p-6 rounded-3xl space-y-4 hover:scale-[1.01] transition-all shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-500">
                            <FiCompass size={22} />
                        </div>
                        <h3 className="font-extrabold text-lg text-slate-950 dark:text-white">Real-Time Dispatching</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            Track vessel delays, boarding queues, weather blocks, and announcements from harbor operations immediately.
                        </p>
                    </div>

                    {/* Interactive Seats */}
                    <div className="bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-white/5 p-6 rounded-3xl space-y-4 hover:scale-[1.01] transition-all shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-500">
                            <FiCpu size={22} />
                        </div>
                        <h3 className="font-extrabold text-lg text-slate-950 dark:text-white">Interactive Cabin Maps</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            Browse seat selections on graphical grids, lock occupied chairs, and customize ticket details in real-time.
                        </p>
                    </div>

                    {/* Safe Checkouts */}
                    <div className="bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-white/5 p-6 rounded-3xl space-y-4 hover:scale-[1.01] transition-all shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-500">
                            <FiShield size={22} />
                        </div>
                        <h3 className="font-extrabold text-lg text-slate-950 dark:text-white">Secure Stripe Checkout</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            Process payments with instant receipt downloads, SSL certifications, and automatic confirmations.
                        </p>
                    </div>
                </div>
            </section>

            {/* Call to Action Banner */}
            <section className="bg-slate-100 dark:bg-slate-900 py-16 text-center border-y border-slate-200/50 dark:border-white/5">
                <div className="max-w-xl mx-auto px-6 space-y-6">
                    <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">Ready to board?</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                        Create an account or login to query active crossings, select your cabin seating, and finalize ticketing.
                    </p>
                    <Link
                        to="/register"
                        className="btn btn-primary bg-gradient-to-r from-sky-500 to-blue-600 border-0 rounded-xl px-8 text-white font-bold h-11 hover:scale-[1.01] inline-flex items-center gap-1.5"
                    >
                        Sign Up Today <FiArrowRight />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-auto py-10 border-t border-slate-200/50 dark:border-white/5 text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sky-500 font-black text-sm tracking-tight">⛴️ FerryFlow</span>
                        <span>© 2026. All rights reserved.</span>
                    </div>
                    <div className="flex gap-4">
                        <a href="#" className="hover:underline">Terms of Service</a>
                        <a href="#" className="hover:underline">Privacy Policy</a>
                        <a href="#" className="hover:underline">Operational Status</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;