import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import toast from "react-hot-toast";
import { Ship, ArrowLeft } from "lucide-react";
import FerryForm from "../../../components/ferry/FerryForm";
import {
    getFerryById,
    updateFerry,
} from "../../../services/ferryService";
import { DetailSkeleton } from "../../../components/ui/LoadingSkeleton";

const EditFerryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [ferry, setFerry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchFerry();
    }, []);

    const fetchFerry = async () => {
        try {
            const response = await getFerryById(id);
            setFerry(response.ferry);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to fetch ferry"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (data) => {
        try {
            setIsSubmitting(true);
            const response = await updateFerry(id, data);
            toast.success(response.message);
            navigate("/admin/ferries");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to update ferry"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Link to="/admin/ferries" className="btn btn-ghost btn-circle bg-base-100 border border-base-300/30 shadow-sm">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-3xl font-bold">Edit Ferry</h1>
                </div>
                <DetailSkeleton />
            </div>
        );
    }

    if (!ferry) {
        return (
            <div className="p-8 text-center bg-base-100 rounded-[28px] border border-white/20 shadow-lg max-w-xl mx-auto my-12">
                <Ship size={50} className="mx-auto text-error mb-4" />
                <h3 className="text-2xl font-bold text-base-content">Ferry Not Found</h3>
                <p className="mt-2 text-base-content/65">The ferry you are editing does not exist or has been removed.</p>
                <Link to="/admin/ferries" className="btn btn-primary mt-6 rounded-xl border-0 bg-gradient-to-r from-[#2563EB] via-[#0EA5E9] to-[#22D3EE] text-white">
                    Back to Fleet
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link
                    to="/admin/ferries"
                    className="btn btn-ghost btn-circle bg-base-100 hover:bg-base-200 border border-base-300/30 shadow-sm transition-all focus:ring-2 focus:ring-primary/20"
                    title="Back to fleet"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <p className="text-xs text-base-content/60 font-medium">Fleet Management</p>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-base-content mt-0.5">
                        Edit Ferry Specifications
                    </h1>
                </div>
            </div>

            {/* Form Card Wrapper */}
            <div className="max-w-3xl bg-base-100/90 backdrop-blur-xl rounded-[28px] border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.18)] p-6 md:p-8">
                <div className="flex items-center gap-4 pb-6 border-b border-base-300/40 mb-8">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#2563EB] via-[#0EA5E9] to-[#22D3EE] flex items-center justify-center text-white shadow-md">
                        <Ship size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-base-content">Modify Ferry</h2>
                        <p className="text-xs text-base-content/50">Update capacity, registration, or operational status</p>
                    </div>
                </div>

                <FerryForm
                    defaultValues={ferry}
                    onSubmit={handleUpdate}
                    isLoading={isSubmitting}
                    submitButtonText="Update Ferry"
                />
            </div>
        </div>
    );
};

export default EditFerryPage;