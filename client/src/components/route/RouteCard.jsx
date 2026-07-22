import { Link } from "react-router";
import { Eye, Pencil, Trash2, MapPin, Navigation, Clock } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";

const RouteCard = ({ route, onDelete }) => {
    return (
        <div className="bg-base-100/90 rounded-2xl border border-base-300 p-5 shadow-md flex flex-col gap-4">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-base-content text-lg">
                        {route.name}
                    </h3>
                    <p className="text-xs text-base-content/50 mt-0.5">
                        ID: {route._id.substring(0, 8)}...
                    </p>
                </div>
                <StatusBadge status={route.status} />
            </div>

            {/* Travel Path */}
            <div className="flex flex-col gap-2 bg-base-200/30 p-3 rounded-xl border border-base-300/10">
                <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-primary shrink-0" />
                    <span className="text-xs text-base-content/60 font-semibold uppercase tracking-wider w-12 shrink-0">From</span>
                    <span className="text-sm font-semibold text-base-content">{route.origin}</span>
                </div>
                <div className="border-l border-dashed border-base-300 h-3 ml-2"></div>
                <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-secondary shrink-0" />
                    <span className="text-xs text-base-content/60 font-semibold uppercase tracking-wider w-12 shrink-0">To</span>
                    <span className="text-sm font-semibold text-base-content">{route.destination}</span>
                </div>
            </div>

            {/* Distance & Duration */}
            <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-2 bg-base-200/40 rounded-xl">
                    <div className="flex justify-center items-center gap-1.5 text-base-content/60 text-xs">
                        <Navigation size={14} className="text-info" />
                        <span>Distance</span>
                    </div>
                    <span className="text-sm font-bold text-base-content mt-1 block">
                        {route.distance} NM
                    </span>
                </div>

                <div className="p-2 bg-base-200/40 rounded-xl">
                    <div className="flex justify-center items-center gap-1.5 text-base-content/60 text-xs">
                        <Clock size={14} className="text-warning" />
                        <span>Duration</span>
                    </div>
                    <span className="text-sm font-bold text-base-content mt-1 block">
                        {route.estimatedDuration} min
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-base-300/40">
                <Link
                    to={`/admin/routes/${route._id}`}
                    className="btn btn-ghost btn-sm btn-square text-info"
                    title="View details"
                >
                    <Eye size={18} />
                </Link>
                <Link
                    to={`/admin/routes/${route._id}/edit`}
                    className="btn btn-ghost btn-sm btn-square text-warning"
                    title="Edit route"
                >
                    <Pencil size={18} />
                </Link>
                <button
                    onClick={() => onDelete(route._id)}
                    className="btn btn-ghost btn-sm btn-square text-error"
                    title="Delete route"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

export default RouteCard;
