import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import toast from "react-hot-toast";
import { CalendarDays, ArrowLeft } from "lucide-react";
import ScheduleForm from "../../../components/schedule/ScheduleForm";
import { getScheduleById, updateSchedule } from "../../../services/scheduleService";
import { DetailSkeleton } from "../../../components/ui/LoadingSkeleton";

const EditSchedulePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        try {
            const response = await getScheduleById(id);
            setSchedule(response.schedule);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to fetch schedule information"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (data) => {
        try {
            setIsSubmitting(true);
            const response = await updateSchedule(id, data);
            toast.success(response.message || "Schedule updated successfully");
            navigate("/admin/schedules");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to update schedule"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Link to="/admin/schedules" className="btn btn-ghost btn-circle bg-base-100 border border-base-300/30 shadow-sm">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-3xl font-bold">Edit Schedule</h1>
                </div>
                <DetailSkeleton />
            </div>
        );
    }

    if (!schedule) {
        return (
            <div className="p-8 text-center bg-base-100 rounded-[28px] border border-white/20 shadow-lg max-w-xl mx-auto my-12">
                <CalendarDays size={50} className="mx-auto text-error mb-4" />
                <h3 className="text-2xl font-bold text-base-content">Schedule Not Found</h3>
                <p className="mt-2 text-base-content/65">The schedule you are editing does not exist or has been removed.</p>
                <Link to="/admin/schedules" className="btn btn-primary mt-6 rounded-xl border-0 bg-gradient-to-r from-[#2563EB] via-[#0EA5E9] to-[#22D3EE] text-white">
                    Back to Schedules
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link
                    to="/admin/schedules"
                    className="btn btn-ghost btn-circle bg-base-100 hover:bg-base-200 border border-base-300/30 shadow-sm transition-all focus:ring-2 focus:ring-primary/20"
                    title="Back to schedules"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <p className="text-xs text-base-content/60 font-medium">Schedule Management</p>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-base-content mt-0.5">
                        Edit Operational Schedule
                    </h1>
                </div>
            </div>

            {/* Form Card Wrapper */}
            <div className="max-w-3xl bg-base-100/90 backdrop-blur-xl rounded-[28px] border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.18)] p-6 md:p-8">
                <div className="flex items-center gap-4 pb-6 border-b border-base-300/40 mb-8">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#2563EB] via-[#0EA5E9] to-[#22D3EE] flex items-center justify-center text-white shadow-md">
                        <CalendarDays size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-base-content">Modify Schedule</h2>
                        <p className="text-xs text-base-content/50">Update timings, fare, status, routes, or vessels</p>
                    </div>
                </div>

                <ScheduleForm
                    defaultValues={schedule}
                    onSubmit={handleUpdate}
                    isLoading={isSubmitting}
                    submitButtonText="Update Schedule"
                />
            </div>
        </div>
    );
};

export default EditSchedulePage;
