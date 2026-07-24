import { useState, useEffect } from "react";
import { FiMapPin, FiCalendar, FiUsers, FiSearch } from "react-icons/fi";
import { getAllRoutes } from "../../services/routeService";
import toast from "react-hot-toast";

const SearchCard = ({ onSearch, initialValues }) => {
    const [ports, setPorts] = useState([]);
    const [fromTerminal, setFromTerminal] = useState(initialValues?.fromTerminal || "");
    const [toTerminal, setToTerminal] = useState(initialValues?.toTerminal || "");
    const [journeyDate, setJourneyDate] = useState(initialValues?.journeyDate || "");
    const [passengerCount, setPassengerCount] = useState(initialValues?.passengerCount || 1);

    useEffect(() => {
        const fetchPorts = async () => {
            try {
                const response = await getAllRoutes();
                const routes = response.routes || [];
                // Collect unique port names from origins and destinations
                const uniquePorts = new Set();
                routes.forEach((r) => {
                    if (r.origin && r.status === "active") uniquePorts.add(r.origin);
                    if (r.destination && r.status === "active") uniquePorts.add(r.destination);
                });
                setPorts(Array.from(uniquePorts).sort());
            } catch (error) {
                console.error("Failed to load ports for search:", error);
            }
        };

        fetchPorts();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!fromTerminal) {
            toast.error("Please select an origin terminal");
            return;
        }
        if (!toTerminal) {
            toast.error("Please select a destination terminal");
            return;
        }
        if (fromTerminal === toTerminal) {
            toast.error("Origin and Destination ports must be different");
            return;
        }
        if (!journeyDate) {
            toast.error("Please select a travel date");
            return;
        }

        onSearch({
            fromTerminal,
            toTerminal,
            journeyDate,
            passengerCount,
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full bg-base-100/90 dark:bg-slate-900/90 border border-base-300/30 dark:border-white/5 rounded-3xl p-6 shadow-xl backdrop-blur-xl"
        >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
                {/* From Port */}
                <div className="flex flex-col">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-base-content/60 mb-2 flex items-center gap-1.5">
                        <FiMapPin className="text-primary" /> From Terminal
                    </label>
                    <select
                        value={fromTerminal}
                        onChange={(e) => setFromTerminal(e.target.value)}
                        className="select select-bordered rounded-xl h-12 w-full focus:ring-2 focus:ring-primary/20 text-sm font-semibold"
                    >
                        <option value="">Select origin...</option>
                        {ports.map((port) => (
                            <option key={`from-${port}`} value={port}>
                                {port}
                            </option>
                        ))}
                    </select>
                </div>

                {/* To Port */}
                <div className="flex flex-col">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-base-content/60 mb-2 flex items-center gap-1.5">
                        <FiMapPin className="text-secondary" /> To Terminal
                    </label>
                    <select
                        value={toTerminal}
                        onChange={(e) => setToTerminal(e.target.value)}
                        className="select select-bordered rounded-xl h-12 w-full focus:ring-2 focus:ring-primary/20 text-sm font-semibold"
                    >
                        <option value="">Select destination...</option>
                        {ports.map((port) => (
                            <option key={`to-${port}`} value={port}>
                                {port}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date */}
                <div className="flex flex-col">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-base-content/60 mb-2 flex items-center gap-1.5">
                        <FiCalendar className="text-info" /> Journey Date
                    </label>
                    <input
                        type="date"
                        value={journeyDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setJourneyDate(e.target.value)}
                        className="input input-bordered rounded-xl h-12 w-full focus:ring-2 focus:ring-primary/20 text-sm font-semibold"
                    />
                </div>

                {/* Passengers */}
                <div className="flex flex-col">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-base-content/60 mb-2 flex items-center gap-1.5">
                        <FiUsers className="text-warning" /> Passengers
                    </label>
                    <div className="flex items-center gap-2">
                        <select
                            value={passengerCount}
                            onChange={(e) => setPassengerCount(Number(e.target.value))}
                            className="select select-bordered rounded-xl h-12 w-full focus:ring-2 focus:ring-primary/20 text-sm font-semibold"
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <option key={num} value={num}>
                                    {num} {num === 1 ? "Passenger" : "Passengers"}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                className="btn w-full h-12 mt-6 rounded-xl border-0 text-white bg-gradient-to-r from-[#2563EB] via-[#0EA5E9] to-[#22D3EE] hover:scale-[1.01] hover:shadow-xl transition-all duration-300 font-bold flex items-center justify-center gap-2"
            >
                <FiSearch size={18} />
                Search Schedules
            </button>
        </form>
    );
};

export default SearchCard;
