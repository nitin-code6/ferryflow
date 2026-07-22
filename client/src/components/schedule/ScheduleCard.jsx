import { Link } from "react-router";
import { Eye, Pencil, Trash2, Calendar, DollarSign, Users, ArrowRight } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";

const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

const ScheduleCard = ({ schedule, onDelete }) => {
    const ferryName = schedule.ferry?.name || "Unknown Ferry";
    const routeName = schedule.route?.name || "Unknown Route";
    const origin = schedule.route?.origin || "?";
    const destination = schedule.route?.destination || "?";

    return (
        <div className="bg-base-100/90 rounded-2xl border border-base-300 p-5 shadow-md flex flex-col gap-4">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-base-content text-lg">
                        {ferryName}
                    </h3>
                    <p className="text-xs text-base-content/50 mt-0.5">
                        Route: {routeName}
                    </p>
                </div>
                <StatusBadge status={schedule.status} />
            </div>

            {/* Travel Details */}
            <div className="flex items-center gap-2 bg-base-200/30 p-3 rounded-xl border border-base-300/10 text-sm font-semibold">
                <span className="text-base-content/80">{origin}</span>
                <ArrowRight size={14} className="text-primary shrink-0" />
                <span className="text-base-content/80">{destination}</span>
            </div>

            {/* Timings */}
            <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                    <span className="text-base-content/60 font-medium">Departure</span>
                    <span className="font-semibold text-base-content">
                        {formatDateTime(schedule.departureTime)}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-base-content/60 font-medium">Arrival</span>
                    <span className="font-semibold text-base-content">
                        {formatDateTime(schedule.arrivalTime)}
                    </span>
                </div>
            </div>

            {/* Fare & Seats */}
            <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-2 bg-base-200/40 rounded-xl">
                    <div className="flex justify-center items-center gap-1 text-base-content/60 text-xs">
                        <DollarSign size={14} className="text-success" />
                        <span>Fare</span>
                    </div>
                    <span className="text-sm font-bold text-base-content mt-1 block">
                        ${schedule.fare?.toFixed(2)}
                    </span>
                </div>

                <div className="p-2 bg-base-200/40 rounded-xl">
                    <div className="flex justify-center items-center gap-1 text-base-content/60 text-xs">
                        <Users size={14} className="text-info" />
                        <span>Available Seats</span>
                    </div>
                    <span className="text-sm font-bold text-base-content mt-1 block">
                        {schedule.availableSeats}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-base-300/40">
                <Link
                    to={`/admin/schedules/${schedule._id}`}
                    className="btn btn-ghost btn-sm btn-square text-info"
                    title="View details"
                >
                    <Eye size={18} />
                </Link>
                <Link
                    to={`/admin/schedules/${schedule._id}/edit`}
                    className="btn btn-ghost btn-sm btn-square text-warning"
                    title="Edit schedule"
                >
                    <Pencil size={18} />
                </Link>
                <button
                    onClick={() => onDelete(schedule._id)}
                    className="btn btn-ghost btn-sm btn-square text-error"
                    title="Delete schedule"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

export default ScheduleCard;
