import { useNavigate, Link } from "react-router";
import toast from "react-hot-toast";
import { CalendarDays, ArrowLeft } from "lucide-react";
import ScheduleForm from "../../../components/schedule/ScheduleForm";
import { createSchedule } from "../../../services/scheduleService";

const CreateSchedulePage = () => {
    const navigate = useNavigate();

    const handleCreate = async (data) => {
        try {
            const response = await createSchedule(data);
            toast.success(response.message || "Schedule created successfully");
            navigate("/admin/schedules");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to create schedule"
            );
        }
    };

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
                        Create New Schedule
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
                        <h2 className="text-xl font-bold text-base-content">Schedule Details</h2>
                        <p className="text-xs text-base-content/50">Register a new voyage timetable for transit operations</p>
                    </div>
                </div>

                <ScheduleForm
                    onSubmit={handleCreate}
                    submitButtonText="Create Schedule"
                />
            </div>
        </div>
    );
};

export default CreateSchedulePage;
