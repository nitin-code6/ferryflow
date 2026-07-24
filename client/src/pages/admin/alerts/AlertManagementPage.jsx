import { useEffect, useState } from "react";
import { Bell, Plus, Trash2, Clock, Compass } from "lucide-react";
import { getAllAlerts, createAlert, deleteAlert } from "../../../services/alertService";
import { getAllRoutes } from "../../../services/routeService";
import AdminPageHeader from "../../../components/ui/AdminPageHeader";
import StatsCard from "../../../components/ui/StatsCard";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import EmptyState from "../../../components/ui/EmptyState";
import { TableSkeleton } from "../../../components/ui/LoadingSkeleton";
import toast from "react-hot-toast";

const AlertManagementPage = () => {
    const [alerts, setAlerts] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form states
    const [type, setType] = useState("delay");
    const [routeName, setRouteName] = useState("");
    const [message, setMessage] = useState("");
    const [isBroadcasting, setIsBroadcasting] = useState(false);

    // Deletion confirmation modal
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [alertsRes, routesRes] = await Promise.all([
                getAllAlerts(),
                getAllRoutes()
            ]);
            setAlerts(alertsRes.alerts || []);
            setRoutes(routesRes.routes || []);
            if (routesRes.routes?.length > 0) {
                setRouteName(routesRes.routes[0].name);
            }
        } catch (error) {
            toast.error("Failed to load active system alerts.");
        } finally {
            setLoading(false);
        }
    };

    const handleBroadcastSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim() || !routeName) {
            toast.error("Please select a route and enter an alert message.");
            return;
        }

        setIsBroadcasting(true);
        try {
            const response = await createAlert({
                type,
                routeName,
                message
            });
            toast.success(response.message);
            setMessage("");
            loadData();
        } catch (error) {
            toast.error("Failed to broadcast announcement.");
        } finally {
            setIsBroadcasting(false);
        }
    };

    const triggerDelete = (id) => {
        setDeleteTargetId(id);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await deleteAlert(deleteTargetId);
            toast.success(response.message);
            loadData();
        } catch (error) {
            toast.error("Failed to delete announcement.");
        } finally {
            setIsDeleting(false);
            setDeleteModalOpen(false);
            setDeleteTargetId(null);
        }
    };

    const total = alerts.length;
    const delays = alerts.filter(a => a.type === "delay").length;
    const weather = alerts.filter(a => a.type === "weather").length;
    const cancellations = alerts.filter(a => a.type === "cancellation").length;

    if (loading) {
        return (
            <div className="space-y-6">
                <AdminPageHeader
                    title="Alerts Broadcasting"
                    description="Issue system announcements regarding cancellations, weather, or operational delays."
                />
                <TableSkeleton rows={4} />
            </div>
        );
    }

    return (
        <div className="space-y-6 text-base-content">
            <AdminPageHeader
                title="Alerts Broadcasting"
                description="Issue system announcements regarding cancellations, weather, or operational delays."
            />

            {/* Stats */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard
                    title="Active Alerts"
                    value={total}
                    icon={<Bell size={20} />}
                    color="bg-primary"
                />
                <StatsCard
                    title="Delays"
                    value={delays}
                    icon={<Clock size={20} />}
                    color="bg-warning"
                />
                <StatsCard
                    title="Weather Warnings"
                    value={weather}
                    icon={<Compass size={20} />}
                    color="bg-info"
                />
                <StatsCard
                    title="Cancellations"
                    value={cancellations}
                    icon={<Trash2 size={20} />}
                    color="bg-error"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Broadcast Form */}
                <form onSubmit={handleBroadcastSubmit} className="lg:col-span-1 bg-base-100/90 border border-base-300 rounded-3xl p-6 shadow-lg space-y-5">
                    <div className="flex items-center gap-2.5 font-extrabold text-lg pb-3 border-b border-base-300/40">
                        <Plus size={20} className="text-primary" /> Create Announcement
                    </div>

                    {/* Alert Type */}
                    <div className="flex flex-col">
                        <label className="text-[11px] font-bold uppercase text-base-content/60 mb-2">Alert Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="select select-bordered rounded-xl h-11 text-sm font-semibold"
                        >
                            <option value="delay">Delay Alert</option>
                            <option value="cancellation">Cancellation</option>
                            <option value="weather">Weather Warning</option>
                            <option value="maintenance">Maintenance Notice</option>
                        </select>
                    </div>

                    {/* Affected Route */}
                    <div className="flex flex-col">
                        <label className="text-[11px] font-bold uppercase text-base-content/60 mb-2">Affected Route</label>
                        <select
                            value={routeName}
                            onChange={(e) => setRouteName(e.target.value)}
                            className="select select-bordered rounded-xl h-11 text-sm font-semibold"
                        >
                            <option value="">Select a route...</option>
                            {routes.map((r) => (
                                <option key={r._id} value={r.name}>
                                    {r.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Message */}
                    <div className="flex flex-col">
                        <label className="text-[11px] font-bold uppercase text-base-content/60 mb-2">Broadcast Message</label>
                        <textarea
                            rows="4"
                            required
                            placeholder="Type the warning message here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="textarea textarea-bordered rounded-xl text-sm font-semibold"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isBroadcasting}
                        className="btn w-full h-11 rounded-xl border-0 text-white bg-gradient-to-r from-blue-600 to-sky-500 font-bold"
                    >
                        {isBroadcasting ? "Broadcasting..." : "Broadcast Announcement"}
                    </button>
                </form>

                {/* Alerts List */}
                <div className="lg:col-span-2 bg-base-100/90 border border-base-300 rounded-3xl p-6 shadow-lg">
                    <div className="flex justify-between items-center pb-3 border-b border-base-300/40 mb-6">
                        <h3 className="font-extrabold text-lg flex items-center gap-2">
                            <Bell className="text-primary" /> Active Broadcasts
                        </h3>
                        <span className="text-xs font-bold text-base-content/50">{alerts.length} Announcements</span>
                    </div>

                    {alerts.length === 0 ? (
                        <EmptyState
                            title="No Active Alerts"
                            description="All ferry routes are operating on-time with zero warnings."
                        />
                    ) : (
                        <div className="space-y-4">
                            {alerts.map((a) => (
                                <div key={a.id} className="border border-base-300 rounded-2xl p-4 flex justify-between items-start gap-4 hover:bg-base-200/20 transition-all">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                                                a.type === 'cancellation'
                                                    ? 'bg-error/10 border-error/20 text-error'
                                                    : a.type === 'weather'
                                                    ? 'bg-info/10 border-info/20 text-info'
                                                    : 'bg-warning/10 border-warning/20 text-warning-content'
                                            }`}>
                                                {a.type}
                                            </span>
                                            <span className="text-[10px] text-base-content/40 font-semibold uppercase">{a.date}</span>
                                        </div>
                                        <p className="text-xs font-bold text-base-content/70 mt-1">Route: {a.routeName}</p>
                                        <p className="text-sm font-medium text-base-content/85 leading-relaxed">{a.message}</p>
                                    </div>

                                    <button
                                        onClick={() => triggerDelete(a.id)}
                                        className="btn btn-ghost btn-square btn-sm text-error"
                                        title="Delete announcement"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={deleteModalOpen}
                title="Delete Announcement"
                message="Are you sure you want to delete this alert? This will immediately remove it from all passenger dashboards."
                confirmText="Delete"
                cancelText="Close"
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

export default AlertManagementPage;
