import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import toast from "react-hot-toast";
import { CalendarDays, ArrowLeft, Calendar, Ship, Map, Clock, Info, DollarSign, Users, Compass } from "lucide-react";
import { getScheduleById } from "../../../services/scheduleService";
import StatusBadge from "../../../components/ui/StatusBadge";
import { DetailSkeleton } from "../../../components/ui/LoadingSkeleton";

const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

const ScheduleDetailsPage = () => {
    const { id } = useParams();

    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Link to="/admin/schedules" className="btn btn-ghost btn-circle bg-base-100 border border-base-300/30 shadow-sm">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-3xl font-bold">Schedule Details</h1>
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
                <p className="mt-2 text-base-content/65">The schedule you are looking for does not exist or has been removed.</p>
                <Link to="/admin/schedules" className="btn btn-primary mt-6 rounded-xl border-0 bg-gradient-to-r from-[#2563EB] via-[#0EA5E9] to-[#22D3EE] text-white">
                    Back to Schedules
                </Link>
            </div>
        );
    }

    const ferryName = schedule.ferry?.name || "Unknown Ferry";
    const routeName = schedule.route?.name || "Unknown Route";

    return (
        <div className="space-y-8">
            {/* Header with Navigation */}
            <div className="flex items-center justify-between">
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
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-base-content mt-0.5 animate-fade-in">
                            Voyage: {ferryName} ({routeName})
                        </h1>
                    </div>
                </div>

                <Link
                    to={`/admin/schedules/${schedule._id}/edit`}
                    className="btn border-0 rounded-xl px-5 text-white bg-gradient-to-r from-[#2563EB] via-[#0EA5E9] to-[#22D3EE] hover:scale-[1.02] hover:shadow-xl transition-all duration-300 font-semibold"
                >
                    Edit Schedule
                </Link>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Specs and Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-base-100/90 backdrop-blur-xl rounded-[28px] border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.18)] p-6 md:p-8">
                        <div className="flex items-center gap-4 pb-6 border-b border-base-300/40">
                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#2563EB] via-[#0EA5E9] to-[#22D3EE] flex items-center justify-center text-white shadow-md">
                                <CalendarDays size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-base-content">Schedule Specifications</h2>
                                <p className="text-xs text-base-content/50">Detailed timings, statuses, and fare data</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-8">
                            {/* Departure */}
                            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-base-200/20 border border-base-300/10">
                                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                    <Clock size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-base-content/55 font-semibold uppercase tracking-wider">Departure Time</p>
                                    <p className="text-sm font-bold text-base-content mt-1">
                                        {formatDateTime(schedule.departureTime)}
                                    </p>
                                </div>
                            </div>

                            {/* Arrival */}
                            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-base-200/20 border border-base-300/10">
                                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                    <Clock size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-base-content/55 font-semibold uppercase tracking-wider">Arrival Time</p>
                                    <p className="text-sm font-bold text-base-content mt-1">
                                        {formatDateTime(schedule.arrivalTime)}
                                    </p>
                                </div>
                            </div>

                            {/* Fare */}
                            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-base-200/20 border border-base-300/10">
                                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                    <DollarSign size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-base-content/55 font-semibold uppercase tracking-wider">Fare Price</p>
                                    <p className="text-base font-bold text-base-content mt-1">
                                        ${schedule.fare?.toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            {/* Available Seats */}
                            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-base-200/20 border border-base-300/10">
                                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                    <Users size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-base-content/55 font-semibold uppercase tracking-wider">Available Seats</p>
                                    <p className="text-base font-bold text-base-content mt-1">
                                        {schedule.availableSeats} / {schedule.ferry?.capacity || "N/A"} <span className="text-xs font-normal text-base-content/60">seats left</span>
                                    </p>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-base-200/20 border border-base-300/10">
                                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                    <Info size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-base-content/55 font-semibold uppercase tracking-wider">Operational Status</p>
                                    <div className="mt-1.5">
                                        <StatusBadge status={schedule.status} />
                                    </div>
                                </div>
                            </div>

                            {/* Created At */}
                            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-base-200/20 border border-base-300/10">
                                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                    <Calendar size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-base-content/55 font-semibold uppercase tracking-wider">Created At</p>
                                    <p className="text-sm font-semibold text-base-content/85 mt-1">
                                        {new Date(schedule.createdAt).toLocaleString(undefined, {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ferry and Route Metadata */}
                <div className="space-y-6">
                    {/* Ferry Info */}
                    <div className="bg-base-100/90 border border-base-300 rounded-[28px] p-6 shadow-md">
                        <div className="flex items-center gap-3 pb-4 border-b border-base-300/40">
                            <Ship size={20} className="text-primary" />
                            <h3 className="font-bold text-base-content">Vessel Details</h3>
                        </div>
                        <div className="mt-4 space-y-3.5 text-sm">
                            <div>
                                <p className="text-xs text-base-content/55 font-semibold uppercase">Ferry Name</p>
                                <p className="font-bold text-base-content mt-0.5">{ferryName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-base-content/55 font-semibold uppercase">Registration Number</p>
                                <p className="font-mono font-bold text-base-content mt-0.5">
                                    {schedule.ferry?.registrationNumber || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-base-content/55 font-semibold uppercase">Total Capacity</p>
                                <p className="font-bold text-base-content mt-0.5">
                                    {schedule.ferry?.capacity || "N/A"} passengers
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Route Info */}
                    <div className="bg-base-100/90 border border-base-300 rounded-[28px] p-6 shadow-md">
                        <div className="flex items-center gap-3 pb-4 border-b border-base-300/40">
                            <Map size={20} className="text-secondary" />
                            <h3 className="font-bold text-base-content">Route Details</h3>
                        </div>
                        <div className="mt-4 space-y-3.5 text-sm">
                            <div>
                                <p className="text-xs text-base-content/55 font-semibold uppercase">Route Name</p>
                                <p className="font-bold text-base-content mt-0.5">{routeName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-base-content/55 font-semibold uppercase">Origin Port</p>
                                <p className="font-bold text-base-content mt-0.5">
                                    {schedule.route?.origin || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-base-content/55 font-semibold uppercase">Destination Port</p>
                                <p className="font-bold text-base-content mt-0.5">
                                    {schedule.route?.destination || "N/A"}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-base-300/10">
                                <div>
                                    <p className="text-xs text-base-content/55 font-semibold uppercase">Distance</p>
                                    <p className="font-bold text-base-content mt-0.5">
                                        {schedule.route?.distance || "N/A"} NM
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-base-content/55 font-semibold uppercase">Duration</p>
                                    <p className="font-bold text-base-content mt-0.5">
                                        {schedule.route?.estimatedDuration || "N/A"} min
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleDetailsPage;
