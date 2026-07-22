import { Link } from "react-router";
import { Eye, Pencil, Trash2 } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";

const RouteTable = ({ routes, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="table w-full">
                <thead>
                    <tr className="border-b border-base-300">
                        <th className="py-4 font-semibold text-sm">Route Name</th>
                        <th className="py-4 font-semibold text-sm">Origin Port</th>
                        <th className="py-4 font-semibold text-sm">Destination Port</th>
                        <th className="py-4 font-semibold text-sm">Distance</th>
                        <th className="py-4 font-semibold text-sm">Estimated Duration</th>
                        <th className="py-4 font-semibold text-sm">Status</th>
                        <th className="py-4 text-right font-semibold text-sm">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {routes.map((route) => (
                        <tr
                            key={route._id}
                            className="hover:bg-base-200/40 transition-colors border-b border-base-300/10"
                        >
                            <td className="py-5">
                                <div className="font-semibold text-base-content">
                                    {route.name}
                                </div>
                            </td>
                            <td className="py-5">
                                <span className="text-sm font-semibold text-base-content/85">
                                    {route.origin}
                                </span>
                            </td>
                            <td className="py-5">
                                <span className="text-sm font-semibold text-base-content/85">
                                    {route.destination}
                                </span>
                            </td>
                            <td className="py-5">
                                <div>
                                    <p className="font-semibold">{route.distance}</p>
                                    <p className="text-xs text-base-content/60">Nautical Miles</p>
                                </div>
                            </td>
                            <td className="py-5">
                                <div>
                                    <p className="font-semibold">{route.estimatedDuration}</p>
                                    <p className="text-xs text-base-content/60">Minutes</p>
                                </div>
                            </td>
                            <td className="py-5">
                                <StatusBadge status={route.status} />
                            </td>
                            <td className="py-5">
                                <div className="flex justify-end gap-2">
                                    <Link
                                        to={`/admin/routes/${route._id}`}
                                        className="btn btn-ghost btn-sm btn-square text-info"
                                        title="View"
                                    >
                                        <Eye size={18} />
                                    </Link>
                                    <Link
                                        to={`/admin/routes/${route._id}/edit`}
                                        className="btn btn-ghost btn-sm btn-square text-warning"
                                        title="Edit"
                                    >
                                        <Pencil size={18} />
                                    </Link>
                                    <button
                                        onClick={() => onDelete(route._id)}
                                        className="btn btn-ghost btn-sm btn-square text-error"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RouteTable;
