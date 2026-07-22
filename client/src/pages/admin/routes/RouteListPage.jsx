import { useEffect, useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import { Map, CheckCircle2, XCircle, Compass } from "lucide-react";

import { getAllRoutes, deleteRoute } from "../../../services/routeService";
import AdminPageHeader from "../../../components/ui/AdminPageHeader";
import StatsCard from "../../../components/ui/StatsCard";
import SearchBar from "../../../components/ui/SearchBar";
import EmptyState from "../../../components/ui/EmptyState";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { TableSkeleton } from "../../../components/ui/LoadingSkeleton";
import RouteTable from "../../../components/route/RouteTable";
import RouteCard from "../../../components/route/RouteCard";

const RouteListPage = () => {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async () => {
        try {
            const response = await getAllRoutes();
            setRoutes(response.routes || []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch routes.");
        } finally {
            setLoading(false);
        }
    };

    const total = routes.length;
    const active = routes.filter((route) => route.status === "active").length;
    const inactive = routes.filter((route) => route.status === "inactive").length;

    const filteredRoutes = routes.filter((route) => {
        const query = search.toLowerCase();
        return (
            route.name.toLowerCase().includes(query) ||
            route.origin.toLowerCase().includes(query) ||
            route.destination.toLowerCase().includes(query)
        );
    });

    const triggerDeleteConfirm = (id) => {
        setDeleteTargetId(id);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await deleteRoute(deleteTargetId);
            toast.success(response.message || "Route deleted successfully");
            fetchRoutes();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to delete route"
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
                    title="Route Management"
                    description="Configure, monitor, and manage transit routes across ports."
                    buttonText="Add Route"
                    buttonLink="/admin/routes/create"
                />
                <TableSkeleton rows={5} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Route Management"
                description="Configure, monitor, and manage transit routes across ports."
                buttonText="Add Route"
                buttonLink="/admin/routes/create"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatsCard
                    title="Total Routes"
                    value={total}
                    icon={<Map size={20} />}
                    color="bg-primary"
                />
                <StatsCard
                    title="Active Routes"
                    value={active}
                    icon={<CheckCircle2 size={20} />}
                    color="bg-success"
                />
                <StatsCard
                    title="Inactive Routes"
                    value={inactive}
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
                            placeholder="Search routes..."
                        />
                    </div>
                    <div className="text-sm text-base-content/60 font-medium">
                        {filteredRoutes.length} Routes
                    </div>
                </div>

                {filteredRoutes.length === 0 ? (
                    <EmptyState
                        title="No Routes Found"
                        description={
                            search
                                ? "No route matched your search query."
                                : "Get started by creating your first ferry route."
                        }
                        buttonText={search ? "Clear Search" : "Add Route"}
                        buttonLink={search ? null : "/admin/routes/create"}
                        onButtonClick={search ? () => setSearch("") : null}
                    />
                ) : (
                    <>
                        {/* Desktop view */}
                        <div className="hidden md:block">
                            <RouteTable
                                routes={filteredRoutes}
                                onDelete={triggerDeleteConfirm}
                            />
                        </div>

                        {/* Mobile view */}
                        <div className="block md:hidden space-y-4">
                            {filteredRoutes.map((route) => (
                                <RouteCard
                                    key={route._id}
                                    route={route}
                                    onDelete={triggerDeleteConfirm}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <ConfirmModal
                isOpen={deleteModalOpen}
                title="Delete Route"
                message="Are you sure you want to delete this route? Schedules using this route might become invalid."
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

export default RouteListPage;
