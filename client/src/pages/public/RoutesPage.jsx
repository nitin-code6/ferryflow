import { useEffect, useState } from "react";
import { getAllRoutes } from "../../services/routeService";
import { FiMapPin, FiNavigation, FiMap, FiClock } from "react-icons/fi";
import toast from "react-hot-toast";

const RoutesPage = () => {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const res = await getAllRoutes();
                setRoutes(res.routes || res.data || []);
            } catch (error) {
                console.error("Failed to load routes:", error);
                toast.error("Failed to fetch route information.");
            } finally {
                setLoading(false);
            }
        };
        fetchRoutes();
    }, []);

    return (
        <div className="pt-28 pb-16 bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 min-h-screen">
            <div className="max-w-7xl mx-auto px-6 space-y-10">
                <div className="text-center space-y-3 max-w-2xl mx-auto">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                        Transit Map
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                        Active Voyage Routes
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                        Find active passenger terminals, travel durations, and destination routes across the harbor.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : routes.length === 0 ? (
                    <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-md mx-auto">
                        <FiMap className="mx-auto text-slate-300 mb-3" size={48} />
                        <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">No Routes Programmed</h3>
                        <p className="text-xs text-slate-400 mt-1">Check back later for updated terminal mappings.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {routes.map((route) => (
                            <div
                                key={route._id || route.id}
                                className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-lg flex flex-col justify-between gap-5 transition-all hover:scale-[1.01]"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white">
                                            <span>{route.origin}</span>
                                            <FiNavigation className="text-primary transform rotate-45" size={16} />
                                            <span>{route.destination}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                                            Route ID: {route._id || route.id}
                                        </p>
                                    </div>
                                    <span className="badge badge-success badge-sm font-bold capitalize">
                                        {route.status || "Active"}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-700/30 font-semibold">
                                    <div>
                                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><FiClock size={13} /> Est. Duration</span>
                                        <span className="text-slate-900 dark:text-white font-black block mt-0.5">{route.duration || 30} Minutes</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><FiMapPin size={13} /> Distance</span>
                                        <span className="text-slate-900 dark:text-white font-black block mt-0.5">{route.distance || "12.5 km"}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoutesPage;
