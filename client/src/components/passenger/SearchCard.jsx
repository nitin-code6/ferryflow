import { useState, useEffect } from "react";
import { FiMapPin, FiCalendar, FiUsers, FiSearch } from "react-icons/fi";
import { getAllRoutes } from "../../services/routeService";
import toast from "react-hot-toast";

const CustomSelect = ({ label, icon, value, onChange, options, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    // Find active label for display
    const selectedOpt = options.find(o => o.value === value);
    const displayLabel = selectedOpt ? selectedOpt.label : placeholder;

    return (
        <div className="relative flex flex-col text-left">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                {icon} {label}
            </label>
            
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between px-4 rounded-xl h-12 w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 transition-all text-sm font-bold shadow-sm"
                >
                    <span className={value ? "" : "text-slate-400 dark:text-slate-500"}>
                        {displayLabel}
                    </span>
                    <span className="text-xs transition-transform duration-200 pointer-events-none text-slate-400">
                        {isOpen ? "▲" : "▼"}
                    </span>
                </button>

                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                        <ul className="absolute left-0 right-0 mt-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg max-h-60 overflow-y-auto z-20 transition-all duration-200">
                            {options.map((opt) => (
                                <li key={opt.value}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onChange(opt.value);
                                            setIsOpen(false);
                                        }}
                                        className={`flex items-center justify-between w-full px-4 py-2.5 text-sm font-semibold text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/80 ${
                                            value === opt.value
                                                ? "text-[#2563EB] dark:text-[#00A8FF] bg-[#2563EB]/5 dark:bg-[#00A8FF]/5"
                                                : "text-slate-700 dark:text-slate-200"
                                        }`}
                                    >
                                        <span>{opt.label}</span>
                                        {value === opt.value && (
                                            <span className="text-xs text-[#2563EB] dark:text-[#00A8FF]">✓</span>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
};

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
                const routes = response.data || response.routes || [];
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

    const portOptions = ports.map(p => ({ label: p, value: p }));
    const passengerOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => ({
        label: `${num} ${num === 1 ? "Passenger" : "Passengers"}`,
        value: num
    }));

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full bg-[#F8FAFC]/95 dark:bg-[#0F1D36] border border-slate-200 dark:border-sky-950/80 rounded-3xl p-6 shadow-xl backdrop-blur-xl"
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {/* From Port */}
                <CustomSelect
                    label="From Terminal"
                    icon={<FiMapPin className="text-[#2563EB]" />}
                    value={fromTerminal}
                    onChange={setFromTerminal}
                    options={portOptions}
                    placeholder="Select origin..."
                />

                {/* To Port */}
                <CustomSelect
                    label="To Terminal"
                    icon={<FiMapPin className="text-emerald-500" />}
                    value={toTerminal}
                    onChange={setToTerminal}
                    options={portOptions}
                    placeholder="Select destination..."
                />

                {/* Date */}
                <div className="flex flex-col text-left">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                        <FiCalendar className="text-sky-500" /> Journey Date
                    </label>
                    <input
                        type="date"
                        value={journeyDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setJourneyDate(e.target.value)}
                        className="input input-bordered rounded-xl h-12 w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary/20 text-sm font-bold shadow-sm"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="btn w-full h-12 mt-6 rounded-xl border-0 text-white bg-gradient-to-r from-[#2563EB] to-[#00A8FF] hover:scale-[1.01] hover:shadow-xl transition-all duration-300 font-bold flex items-center justify-center gap-2"
            >
                <FiSearch size={18} />
                Search Ferries
            </button>
        </form>
    );
};

export default SearchCard;
