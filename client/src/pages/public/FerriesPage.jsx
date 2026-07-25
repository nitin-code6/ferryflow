import { useEffect, useState } from "react";
import { getAllFerries } from "../../services/ferryService";
import { FiAnchor, FiUser, FiInfo, FiActivity } from "react-icons/fi";
import toast from "react-hot-toast";

const FerriesPage = () => {
    const [ferries, setFerries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFerries = async () => {
            try {
                const res = await getAllFerries();
                setFerries(res.data || res.ferries || []);
            } catch (error) {
                console.error("Failed to load ferries:", error);
                toast.error("Failed to fetch fleet information.");
            } finally {
                setLoading(false);
            }
        };
        fetchFerries();
    }, []);

    return (
        <div className="pt-28 pb-16 bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 min-h-screen">
            <div className="max-w-7xl mx-auto px-6 space-y-10">
                <div className="text-center space-y-3 max-w-2xl mx-auto">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                        Fleet & Vessels
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                        Ferry & Transportation Fleet
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                        Explore the high-speed vessels and passenger catamarans operating across Kochi's modern waterways.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : ferries.length === 0 ? (
                    <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-md mx-auto">
                        <FiAnchor className="mx-auto text-slate-300 mb-3" size={48} />
                        <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">No Vessels Active</h3>
                        <p className="text-xs text-slate-400 mt-1">Check back later for updated fleet dispatch details.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ferries.map((ferry) => (
                            <div
                                key={ferry._id || ferry.id}
                                className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col justify-between gap-5 transition-all hover:scale-[1.01]"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                            <FiAnchor className="text-primary" /> {ferry.name}
                                        </h3>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                                            Vessel ID: {ferry._id || ferry.id}
                                        </p>
                                    </div>
                                    <span className="badge badge-success badge-sm font-bold capitalize">
                                        {ferry.status || "Active"}
                                    </span>
                                </div>

                                <div className="space-y-2 text-xs bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-700/30 font-semibold">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><FiUser size={13} /> Passenger Capacity</span>
                                        <span className="text-slate-900 dark:text-white font-black">{ferry.capacity || 150} Commuters</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><FiActivity size={13} /> Vessel Type</span>
                                        <span className="text-slate-900 dark:text-white font-black">{ferry.type || "Catamaran Ferry"}</span>
                                    </div>
                                </div>

                                <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-start gap-1.5 leading-relaxed bg-blue-500/5 p-3 rounded-xl border border-blue-500/10">
                                    <FiInfo className="text-sky-400 shrink-0 mt-0.5" size={14} />
                                    <span>Equipped with smart boarding ticket readers, life rafts, and modern visual navigation.</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FerriesPage;
