import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import toast from "react-hot-toast";
import { Map, ArrowLeft } from "lucide-react";
import RouteForm from "../../../components/route/RouteForm";
import { getRouteById, updateRoute } from "../../../services/routeService";
import { DetailSkeleton } from "../../../components/ui/LoadingSkeleton";

const EditRoutePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [route, setRoute] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleUpdate = async (data) => {
        try {
            setIsSubmitting(true);
            const response = await updateRoute(id, data);
            toast.success(response.message || "Route updated successfully");
            navigate("/admin/routes");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to update route"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Link to="/admin/routes" className="btn btn-ghost btn-circle bg-base-100 border border-base-300/30 shadow-sm">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-3xl font-bold">Edit Route</h1>
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
                <p className="mt-2 text-base-content/65">The route you are editing does not exist or has been removed.</p>
                <Link to="/admin/routes" className="btn btn-primary mt-6 rounded-xl border-0 bg-gradient-to-r from-[#2563EB] via-[#0EA5E9] to-[#22D3EE] text-white">
                    Back to Routes
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
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
                        Edit Route Specifications
                    </h1>
                </div>
            </div>

            {/* Form Card Wrapper */}
            <div className="max-w-3xl bg-base-100/90 backdrop-blur-xl rounded-[28px] border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.18)] p-6 md:p-8">
                <div className="flex items-center gap-4 pb-6 border-b border-base-300/40 mb-8">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#2563EB] via-[#0EA5E9] to-[#22D3EE] flex items-center justify-center text-white shadow-md">
                        <Map size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-base-content">Modify Route</h2>
                        <p className="text-xs text-base-content/50">Update origin, destination, distance, or duration</p>
                    </div>
                </div>

                <RouteForm
                    defaultValues={route}
                    onSubmit={handleUpdate}
                    isLoading={isSubmitting}
                    submitButtonText="Update Route"
                />
            </div>
        </div>
    );
};

export default EditRoutePage;
