import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import toast from "react-hot-toast";
import { Map, ArrowLeft, Calendar, Navigation, Clock, Info, MapPin } from "lucide-react";
import { getRouteById } from "../../../services/routeService";
import StatusBadge from "../../../components/ui/StatusBadge";
import { DetailSkeleton } from "../../../components/ui/LoadingSkeleton";

const RouteDetailsPage = () => {
    const { id } = useParams();

    const [route, setRoute] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRoute();
    }, []);

    const fetchRoute = async () => {
        try {
            const response = await getRouteById(id);
            setRoute(response.route);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to fetch route specifications"
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Link to="/admin/routes" className="btn btn-ghost btn-circle bg-base-100 border border-base-300/30 shadow-sm">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-3xl font-bold">Route Details</h1>
                </div>
                <DetailSkeleton />
            </div>
        );
    }

    if (!route) {
        return (
            <div className="p-8 text-center bg-base-100 rounded-[28px] border border-white/20 shadow-lg max-w-xl mx-auto my-12">
                <Map size={50} className="mx-auto text-error mb-4" />
                <h3 className="text-2xl font-bold text-base-content">Route Not Found</h3>
                <p className="mt-2 text-base-content/65">The route you are looking for does not exist or has been removed.</p>
                <Link to="/admin/routes" className="btn btn-primary mt-6 rounded-xl border-0 bg-gradient-to-r from-[#2563EB] via-[#0EA5E9] to-[#22D3EE] text-white">
                    Back to Routes
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header with Navigation */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link
                        to="/admin/routes"
                        className="btn btn-ghost btn-circle bg-base-100 hover:bg-base-200 border border-base-300/30 shadow-sm transition-all focus:ring-2 focus:ring-primary/20"
                        title="Back to routes"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <p className="text-xs text-base-content/60 font-medium">Route Management</p>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-base-content mt-0.5">
                            {route.name}
                        </h1>
                    </div>
                </div>

                <Link
                    to={`/admin/routes/${route._id}/edit`}
                    className="btn border-0 rounded-xl px-5 text-white bg-gradient-to-r from-[#2563EB] via-[#0EA5E9] to-[#22D3EE] hover:scale-[1.02] hover:shadow-xl transition-all duration-300 font-semibold"
                >
                    Edit Route
                </Link>
            </div>

            {/* Premium Info Card */}
            <div className="max-w-3xl bg-base-100/90 backdrop-blur-xl rounded-[28px] border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.18)] p-6 md:p-8">
                <div className="flex items-center gap-4 pb-6 border-b border-base-300/40">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#2563EB] via-[#0EA5E9] to-[#22D3EE] flex items-center justify-center text-white shadow-md">
                        <Map size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-base-content">Specifications & Path</h2>
                        <p className="text-xs text-base-content/50">Detailed geo-coordinates, distances, and status</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-8">
                    {/* Route Name */}
                    <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-base-200/20 border border-base-300/10">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                            <Map size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-base-content/55 font-semibold uppercase tracking-wider">Route Name</p>
                            <p className="text-base font-bold text-base-content mt-1">{route.name}</p>
                        </div>
                    </div>

                    {/* Operational Status */}
                    <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-base-200/20 border border-base-300/10">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                            <Info size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-base-content/55 font-semibold uppercase tracking-wider">Operational Status</p>
                            <div className="mt-1.5">
                                <StatusBadge status={route.status} />
                            </div>
                        </div>
                    </div>

                    {/* Origin */}
                    <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-base-200/20 border border-base-300/10">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                            <MapPin size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-base-content/55 font-semibold uppercase tracking-wider">Origin Port</p>
                            <p className="text-base font-bold text-base-content mt-1">{route.origin}</p>
                        </div>
                    </div>

                    {/* Destination */}
                    <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-base-200/20 border border-base-300/10">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                            <MapPin size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-base-content/55 font-semibold uppercase tracking-wider">Destination Port</p>
                            <p className="text-base font-bold text-base-content mt-1">{route.destination}</p>
                        </div>
                    </div>

                    {/* Distance */}
                    <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-base-200/20 border border-base-300/10">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                            <Navigation size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-base-content/55 font-semibold uppercase tracking-wider">Distance</p>
                            <p className="text-base font-bold text-base-content mt-1">
                                {route.distance} <span className="text-xs font-normal text-base-content/60">Nautical Miles</span>
                            </p>
                        </div>
                    </div>

                    {/* Estimated Duration */}
                    <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-base-200/20 border border-base-300/10">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                            <Clock size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-base-content/55 font-semibold uppercase tracking-wider">Estimated Duration</p>
                            <p className="text-base font-bold text-base-content mt-1">
                                {route.estimatedDuration} <span className="text-xs font-normal text-base-content/60">Minutes</span>
                            </p>
                        </div>
                    </div>

                    {/* Created At */}
                    <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-base-200/20 border border-base-300/10">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                            <Calendar size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-base-content/55 font-semibold uppercase tracking-wider">Added To System</p>
                            <p className="text-sm font-semibold text-base-content/85 mt-1">
                                {new Date(route.createdAt).toLocaleString(undefined, {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Last Updated */}
                    <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-base-200/20 border border-base-300/10">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                            <Calendar size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-base-content/55 font-semibold uppercase tracking-wider">Last Updated</p>
                            <p className="text-sm font-semibold text-base-content/85 mt-1">
                                {new Date(route.updatedAt).toLocaleString(undefined, {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RouteDetailsPage;
