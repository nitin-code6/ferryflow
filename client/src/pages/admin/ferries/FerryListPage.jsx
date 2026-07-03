import { useEffect, useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";

import {
    Ship,
    CheckCircle2,
    Wrench,
    XCircle,
    Eye,
    Pencil,
    Trash2,
} from "lucide-react";

import {
    getAllFerries,
    deleteFerry,
} from "../../../services/ferryService";

import AdminPageHeader from "../../../components/ui/AdminPageHeader";
import StatsCard from "../../../components/ui/StatsCard";
import SearchBar from "../../../components/ui/SearchBar";
import EmptyState from "../../../components/ui/EmptyState";
import StatusBadge from "../../../components/ui/StatusBadge";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { TableSkeleton } from "../../../components/ui/LoadingSkeleton";

const FerryListPage = () => {

    const [ferries, setFerries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchFerries();
    }, []);

    const fetchFerries = async () => {

        try {

            const response = await getAllFerries();

            setFerries(response.ferries);

        } catch {

            toast.error("Failed to fetch ferries.");

        } finally {

            setLoading(false);

        }

    };

    const total = ferries.length;

    const available =
        ferries.filter(
            ferry => ferry.status === "available"
        ).length;

    const maintenance =
        ferries.filter(
            ferry => ferry.status === "maintenance"
        ).length;

    const outOfService =
        ferries.filter(
            ferry => ferry.status === "out_of_service"
        ).length;

    const filteredFerries = ferries.filter((ferry) => {

        const query = search.toLowerCase();

        return (

            ferry.name
                .toLowerCase()
                .includes(query)

            ||

            ferry.registrationNumber
                .toLowerCase()
                .includes(query)

        );

    });

    const triggerDeleteConfirm = (id) => {

        setDeleteTargetId(id);

        setDeleteModalOpen(true);

    };

    const handleConfirmDelete = async () => {

        setIsDeleting(true);

        try {

            const response =
                await deleteFerry(deleteTargetId);

            toast.success(response.message);

            fetchFerries();

        } catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Failed to delete ferry"

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
                    title="Ferry Management"
                    description="Manage ferries and monitor operational status."
                    buttonText="Add Ferry"
                    buttonLink="/admin/ferries/new"
                />

                <TableSkeleton rows={5} />

            </div>

        );

    }

    return (

        <div className="space-y-6">

            <AdminPageHeader
                title="Ferry Management"
                description="Manage ferries and monitor operational status."
                buttonText="Add Ferry"
                buttonLink="/admin/ferries/new"
            />

            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">

                <StatsCard
                    title="Total"
                    value={total}
                    icon={<Ship size={20} />}
                    color="bg-primary"
                />

                <StatsCard
                    title="Available"
                    value={available}
                    icon={<CheckCircle2 size={20} />}
                    color="bg-success"
                />

                <StatsCard
                    title="Maintenance"
                    value={maintenance}
                    icon={<Wrench size={20} />}
                    color="bg-warning"
                />

                <StatsCard
                    title="Out of Service"
                    value={outOfService}
                    icon={<XCircle size={20} />}
                    color="bg-error"
                />

            </div>

            <div
                className="
                bg-base-100/90
                rounded-2xl
                border
                border-base-300
                shadow-lg
                p-5
                "
            >

                <div
                    className="
                    flex
                    flex-col
                    gap-4
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                    mb-6
                    "
                >

                    <div className="w-full lg:max-w-md">

                        <SearchBar
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search ferries..."
                        />

                    </div>

                    <div
                        className="
                        text-sm
                        text-base-content/60
                        font-medium
                        "
                    >
                        {filteredFerries.length} Ferries
                    </div>

                </div>

                {

                    filteredFerries.length === 0 ? (

                        <EmptyState
                            title="No Ferries Found"
                            description={
                                search
                                    ? "No ferry matched your search."
                                    : "Start by creating your first ferry."
                            }
                            buttonText={
                                search
                                    ? "Clear Search"
                                    : "Add Ferry"
                            }
                            buttonLink={
                                search
                                    ? null
                                    : "/admin/ferries/new"
                            }
                            onButtonClick={
                                search
                                    ? () => setSearch("")
                                    : null
                            }
                        />

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="table">
                                <thead>
                                    <tr className="border-b border-base-300">
                                        <th className="py-4 font-semibold text-sm">
                                            Ferry Name
                                        </th>

                                        <th className="py-4 font-semibold text-sm">
                                            Registration No.
                                        </th>

                                        <th className="py-4 font-semibold text-sm">
                                            Capacity
                                        </th>

                                        <th className="py-4 font-semibold text-sm">
                                            Status
                                        </th>

                                        <th className="py-4 text-right font-semibold text-sm">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {filteredFerries.map((ferry) => (

                                        <tr
                                            key={ferry._id}
                                            className="
                                        hover:bg-base-200/40
                                        transition-colors
                                        "
                                        >

                                            <td className="py-5">

                                                <div className="font-semibold">
                                                    {ferry.name}
                                                </div>

                                            </td>

                                            <td className="py-5">

                                                <span className="badge badge-outline font-mono px-3 py-3">
                                                    {ferry.registrationNumber}
                                                </span>

                                            </td>

                                            <td className="py-5">

                                                <div>

                                                    <p className="font-semibold">
                                                        {ferry.capacity}
                                                    </p>

                                                    <p className="text-xs text-base-content/60">
                                                        Passengers
                                                    </p>

                                                </div>

                                            </td>

                                            <td className="py-5">

                                                <StatusBadge
                                                    status={ferry.status}
                                                />

                                            </td>

                                            <td className="py-5">

                                                <div className="flex justify-end gap-2">

                                                    <Link
                                                        to={`/admin/ferries/${ferry._id}`}
                                                        className="
                                                    btn
                                                    btn-ghost
                                                    btn-sm
                                                    btn-square
                                                    text-info
                                                    "
                                                        title="View"
                                                    >
                                                        <Eye size={18} />
                                                    </Link>

                                                    <Link
                                                        to={`/admin/ferries/edit/${ferry._id}`}
                                                        className="
                                                    btn
                                                    btn-ghost
                                                    btn-sm
                                                    btn-square
                                                    text-warning
                                                    "
                                                        title="Edit"
                                                    >
                                                        <Pencil size={18} />
                                                    </Link>

                                                    <button
                                                        onClick={() =>
                                                            triggerDeleteConfirm(
                                                                ferry._id
                                                            )
                                                        }
                                                        className="
                                                    btn
                                                    btn-ghost
                                                    btn-sm
                                                    btn-square
                                                    text-error
                                                    "
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

                    )}

            </div>

            <ConfirmModal
                isOpen={deleteModalOpen}
                title="Delete Ferry"
                message="Are you sure you want to delete this ferry? This action cannot be undone."
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

export default FerryListPage;