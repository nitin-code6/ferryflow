import { FiClock, FiUsers, FiArrowRight, FiAnchor } from "react-icons/fi";
import StatusBadge from "../ui/StatusBadge";

const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
    });
};

const formatDuration = (minutes) => {
    if (!minutes) return "N/A";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins} mins`;
};

const FerryCard = ({ schedule, passengerCount = 1, onBook }) => {
    const ferryName = schedule.ferry?.name || "Transit Vessel";
    const capacity = schedule.ferry?.capacity || 100;
    const origin = schedule.route?.origin || "Origin";
    const destination = schedule.route?.destination || "Destination";
    const duration = schedule.route?.estimatedDuration || 45;
    const availableSeats = schedule.availableSeats ?? capacity;
    const isCancelled = schedule.status === "cancelled";
    const noSeats = availableSeats < passengerCount;

    // Premium unsplash ferry image placeholder
    const imageUrl = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80";

    return (
        <div className="bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex flex-col md:flex-row gap-6 p-5">
            {/* Image Section */}
            <div className="w-full md:w-48 h-48 md:h-auto rounded-2xl overflow-hidden relative shrink-0">
                <img
                    src={imageUrl}
                    alt={ferryName}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                    <StatusBadge status={schedule.status} />
                </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                        <FiAnchor /> {schedule.ferry?.registrationNumber || "Vessel Spec"}
                    </div>
                    <h3 className="text-xl font-extrabold text-base-content leading-snug">
                        {ferryName}
                    </h3>

                    {/* Routing with details */}
                    <div className="flex items-center gap-3 bg-slate-50/50 dark:bg-slate-800/40 py-2 px-3 rounded-xl border border-slate-200/40 dark:border-sky-950/20 w-fit text-sm font-bold text-base-content/85">
                        <span>{origin}</span>
                        <FiArrowRight className="text-primary shrink-0" />
                        <span>{destination}</span>
                    </div>
                </div>

                {/* Departure - Arrival Details */}
                <div className="grid grid-cols-3 gap-4 border-t border-base-300/20 pt-4 text-sm font-semibold">
                    <div>
                        <span className="text-[10px] text-base-content/50 uppercase block mb-1">Departure</span>
                        <span className="text-base font-bold text-base-content">
                            {formatDateTime(schedule.departureTime)}
                        </span>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <span className="text-[10px] text-base-content/50 uppercase block mb-1">Duration</span>
                        <div className="flex items-center gap-1.5 text-xs text-base-content/75 bg-slate-100 dark:bg-slate-850 px-2 py-1 rounded-lg">
                            <FiClock size={12} className="text-info" />
                            <span>{formatDuration(duration)}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] text-base-content/50 uppercase block mb-1">Arrival</span>
                        <span className="text-base font-bold text-base-content">
                            {formatDateTime(schedule.arrivalTime)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Price & CTA Section */}
            <div className="w-full md:w-56 shrink-0 md:border-l border-base-300/20 md:pl-6 flex flex-col justify-between gap-4">
                <div className="text-left md:text-right">
                    <span className="text-[10px] text-base-content/50 uppercase block mb-1">Price per passenger</span>
                    <div className="flex items-baseline gap-1 md:justify-end">
                        <span className="text-3xl font-black text-base-content">₹{schedule.fare?.toFixed(2)}</span>
                        <span className="text-xs text-base-content/50 font-medium">INR</span>
                    </div>
                    <div className="flex items-center gap-1.5 md:justify-end text-xs text-base-content/60 mt-2">
                        <FiUsers className="text-info" />
                        <span>{availableSeats} seats left</span>
                    </div>
                </div>

                <button
                    disabled={isCancelled || noSeats}
                    onClick={() => onBook(schedule)}
                    className={`btn w-full rounded-xl border-0 text-white font-bold tracking-wide shadow-md ${
                        isCancelled
                            ? "bg-slate-400 cursor-not-allowed"
                            : noSeats
                            ? "bg-error cursor-not-allowed"
                            : "bg-gradient-to-r from-[#2563EB] to-[#0EA5E9] hover:scale-[1.02] hover:shadow-lg transition-all"
                    }`}
                >
                    {isCancelled ? "Cancelled" : noSeats ? "Sold Out" : "Book Journey"}
                </button>
            </div>
        </div>
    );
};

export default FerryCard;
