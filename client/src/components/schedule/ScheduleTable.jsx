import { Link } from "react-router";
import { Eye, Pencil, Trash2, ArrowRight } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";
import { usePermission } from "../../hooks/usePermission";

const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

const ScheduleTable = ({ schedules, onDelete }) => {
    const { can } = usePermission();
    const canManageSchedule = can("scheduleManagement");
    
    return (
        <div className="overflow-x-auto">
            <table className="table w-full text-slate-800 dark:text-slate-200">
                <thead>
                    <tr className="border-b border-slate-200 dark:border-sky-950/40 text-slate-400 dark:text-slate-450 text-left">
                        <th className="py-4 font-bold text-xs uppercase tracking-wider">Ferry Name</th>
                        <th className="py-4 font-bold text-xs uppercase tracking-wider">Route</th>
                        <th className="py-4 font-bold text-xs uppercase tracking-wider">Departure</th>
                        <th className="py-4 font-bold text-xs uppercase tracking-wider">Arrival</th>
                        <th className="py-4 font-bold text-xs uppercase tracking-wider">Fare</th>
                        <th className="py-4 font-bold text-xs uppercase tracking-wider">Available Seats</th>
                        <th className="py-4 font-bold text-xs uppercase tracking-wider">Status</th>
                        <th className="py-4 text-right font-bold text-xs uppercase tracking-wider">Actions</th>
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
                                className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors border-b border-slate-200/60 dark:border-sky-950/20 text-left"
                            >
                                <td className="py-5">
                                    <div className="font-bold text-sm text-slate-800 dark:text-white">
                                        {ferryName}
                                    </div>
                                    <div className="text-[10px] font-medium text-slate-450 dark:text-slate-500">
                                        Reg: {schedule.ferry?.registrationNumber || "N/A"}
                                    </div>
                                </td>
                                <td className="py-5">
                                    <div className="flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                        <span>{origin}</span>
                                        <ArrowRight size={14} className="text-primary shrink-0" />
                                        <span>{destination}</span>
                                    </div>
                                    <div className="text-[10px] font-medium text-slate-450 dark:text-slate-500">
                                        Route: {routeName}
                                    </div>
                                </td>
                                <td className="py-5">
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-350">
                                        {formatDateTime(schedule.departureTime)}
                                    </span>
                                </td>
                                <td className="py-5">
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-350">
                                        {formatDateTime(schedule.arrivalTime)}
                                    </span>
                                </td>
                                <td className="py-5 font-bold text-sm text-slate-800 dark:text-white">
                                    ${schedule.fare?.toFixed(2)}
                                </td>
                                <td className="py-5">
                                    <span className="bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-300 font-mono font-bold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-sky-950 text-xs">
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
                                        {canManageSchedule && (
                                            <>
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
                                            </>
                                        )}
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
