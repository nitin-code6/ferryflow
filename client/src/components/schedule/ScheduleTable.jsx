import { Link } from "react-router";
import { Eye, Pencil, Trash2, ArrowRight } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";

const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

const ScheduleTable = ({ schedules, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="table w-full">
                <thead>
                    <tr className="border-b border-base-300">
                        <th className="py-4 font-semibold text-sm">Ferry Name</th>
                        <th className="py-4 font-semibold text-sm">Route</th>
                        <th className="py-4 font-semibold text-sm">Departure Time</th>
                        <th className="py-4 font-semibold text-sm">Arrival Time</th>
                        <th className="py-4 font-semibold text-sm">Fare</th>
                        <th className="py-4 font-semibold text-sm">Available Seats</th>
                        <th className="py-4 font-semibold text-sm">Status</th>
                        <th className="py-4 text-right font-semibold text-sm">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {schedules.map((schedule) => {
                        const ferryName = schedule.ferry?.name || "Unknown Ferry";
                        const routeName = schedule.route?.name || "Unknown Route";
                        const origin = schedule.route?.origin || "?";
                        const destination = schedule.route?.destination || "?";

                        return (
                            <tr
                                key={schedule._id}
                                className="hover:bg-base-200/40 transition-colors border-b border-base-300/10"
                            >
                                <td className="py-5">
                                    <div className="font-semibold text-base-content">
                                        {ferryName}
                                    </div>
                                    <div className="text-xs text-base-content/50">
                                        Reg: {schedule.ferry?.registrationNumber || "N/A"}
                                    </div>
                                </td>
                                <td className="py-5">
                                    <div className="flex items-center gap-1 text-sm font-semibold text-base-content/85">
                                        <span>{origin}</span>
                                        <ArrowRight size={14} className="text-primary shrink-0" />
                                        <span>{destination}</span>
                                    </div>
                                    <div className="text-xs text-base-content/50">
                                        Route: {routeName}
                                    </div>
                                </td>
                                <td className="py-5">
                                    <span className="text-sm font-semibold text-base-content/85">
                                        {formatDateTime(schedule.departureTime)}
                                    </span>
                                </td>
                                <td className="py-5">
                                    <span className="text-sm font-semibold text-base-content/85">
                                        {formatDateTime(schedule.arrivalTime)}
                                    </span>
                                </td>
                                <td className="py-5 font-semibold text-base-content">
                                    ${schedule.fare?.toFixed(2)}
                                </td>
                                <td className="py-5">
                                    <span className="badge badge-neutral font-mono font-bold px-2.5 py-2.5">
                                        {schedule.availableSeats}
                                    </span>
                                </td>
                                <td className="py-5">
                                    <StatusBadge status={schedule.status} />
                                </td>
                                <td className="py-5">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            to={`/admin/schedules/${schedule._id}`}
                                            className="btn btn-ghost btn-sm btn-square text-info"
                                            title="View"
                                        >
                                            <Eye size={18} />
                                        </Link>
                                        <Link
                                            to={`/admin/schedules/${schedule._id}/edit`}
                                            className="btn btn-ghost btn-sm btn-square text-warning"
                                            title="Edit"
                                        >
                                            <Pencil size={18} />
                                        </Link>
                                        <button
                                            onClick={() => onDelete(schedule._id)}
                                            className="btn btn-ghost btn-sm btn-square text-error"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ScheduleTable;
