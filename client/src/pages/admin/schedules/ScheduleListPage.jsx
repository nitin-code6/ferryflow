import { useEffect, useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import { CalendarDays, Play, Ship, XCircle } from "lucide-react";

import { getAllSchedules, deleteSchedule } from "../../../services/scheduleService";
import AdminPageHeader from "../../../components/ui/AdminPageHeader";
import StatsCard from "../../../components/ui/StatsCard";
import SearchBar from "../../../components/ui/SearchBar";
import EmptyState from "../../../components/ui/EmptyState";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { TableSkeleton } from "../../../components/ui/LoadingSkeleton";
import ScheduleTable from "../../../components/schedule/ScheduleTable";
import ScheduleCard from "../../../components/schedule/ScheduleCard";

const ScheduleListPage = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const response = await getAllSchedules();
            setSchedules(response.schedules || []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch schedules.");
        } finally {
            setLoading(false);
        }
    };

    const total = schedules.length;
    const boarding = schedules.filter((s) => s.status === "boarding").length;
    const departed = schedules.filter((s) => s.status === "departed").length;
    const cancelled = schedules.filter((s) => s.status === "cancelled").length;

    const filteredSchedules = schedules.filter((s) => {
        const query = search.toLowerCase();
        const ferryName = s.ferry?.name?.toLowerCase() || "";
        const routeName = s.route?.name?.toLowerCase() || "";
        const origin = s.route?.origin?.toLowerCase() || "";
        const destination = s.route?.destination?.toLowerCase() || "";

        return (
            ferryName.includes(query) ||
            routeName.includes(query) ||
            origin.includes(query) ||
            destination.includes(query)
        );
    });

    const triggerDeleteConfirm = (id) => {
        setDeleteTargetId(id);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await deleteSchedule(deleteTargetId);
            toast.success(response.message || "Schedule deleted successfully");
            fetchSchedules();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to delete schedule"
            );
        } finally {
            setIsDeleting(false);
            setDeleteModalOpen(false);
            setDeleteTargetId(null);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <AdminPageHeader
                    title="Schedule Management"
                    description="Plan, authorize, and edit timetables and departure schedules."
                    buttonText="Create Schedule"
                    buttonLink="/admin/schedules/create"
                />
                <TableSkeleton rows={5} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Schedule Management"
                description="Plan, authorize, and edit timetables and departure schedules."
                buttonText="Create Schedule"
                buttonLink="/admin/schedules/create"
            />

            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Schedules"
                    value={total}
                    icon={<CalendarDays size={20} />}
                    color="bg-primary"
                />
                <StatsCard
                    title="Boarding"
                    value={boarding}
                    icon={<Play size={20} />}
                    color="bg-warning"
                />
                <StatsCard
                    title="Departed"
                    value={departed}
                    icon={<Ship size={20} />}
                    color="bg-success"
                />
                <StatsCard
                    title="Cancelled"
                    value={cancelled}
                    icon={<XCircle size={20} />}
                    color="bg-error"
                />
            </div>

            <div className="bg-base-100/90 rounded-2xl border border-base-300 shadow-lg p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div className="w-full lg:max-w-md">
                        <SearchBar
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by ferry, route, origin port..."
                        />
                    </div>
                    <div className="text-sm text-base-content/60 font-medium">
                        {filteredSchedules.length} Schedules
                    </div>
                </div>

                {filteredSchedules.length === 0 ? (
                    <EmptyState
                        title="No Schedules Found"
                        description={
                            search
                                ? "No schedule matched your search criteria."
                                : "Get started by generating your first operation schedule."
                        }
                        buttonText={search ? "Clear Search" : "Create Schedule"}
                        buttonLink={search ? null : "/admin/schedules/create"}
                        onButtonClick={search ? () => setSearch("") : null}
                    />
                ) : (
                    <>
                        {/* Desktop view */}
                        <div className="hidden md:block">
                            <ScheduleTable
                                schedules={filteredSchedules}
                                onDelete={triggerDeleteConfirm}
                            />
                        </div>

                        {/* Mobile view */}
                        <div className="block md:hidden space-y-4">
                            {filteredSchedules.map((schedule) => (
                                <ScheduleCard
                                    key={schedule._id}
                                    schedule={schedule}
                                    onDelete={triggerDeleteConfirm}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <ConfirmModal
                isOpen={deleteModalOpen}
                title="Delete Schedule"
                message="Are you sure you want to delete this schedule? Booked passengers might need automatic refunds."
                confirmText="Delete"
                cancelText="Cancel"
                isLoading={isDeleting}
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setDeleteModalOpen(false);
                    setDeleteTargetId(null);
                }}
                variant="danger"
            />
        </div>
    );
};

export default ScheduleListPage;
