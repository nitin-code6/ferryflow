import { useEffect, useState } from "react";
import { Ticket, CheckCircle2, Clock, XCircle, Calendar, MapPin, Anchor, IndianRupee, CheckCheck, RotateCcw } from "lucide-react";
import { getAllBookings, cancelBooking } from "../../../services/bookingService";
import StatsCard from "../../../components/ui/StatsCard";
import AdminPageHeader from "../../../components/ui/AdminPageHeader";
import SearchBar from "../../../components/ui/SearchBar";
import StatusBadge from "../../../components/ui/StatusBadge";
import EmptyState from "../../../components/ui/EmptyState";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import toast from "react-hot-toast";

const BookingManagementPage = () => {
    const [bookings, setBookings] = useState([]);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [loading, setLoading] = useState(true);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [actionTargetId, setActionTargetId] = useState(null);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        setLoading(true);
        try {
            const response = await getAllBookings();
            const list = Array.isArray(response.data) ? response.data : (response.data?.data || []);
            setBookings(list);
        } catch (error) {
            console.error("Failed to load admin bookings:", error);
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelTrigger = (id) => {
        setActionTargetId(id);
        setConfirmModalOpen(true);
    };

    const handleConfirmCancel = async () => {
        if (!actionTargetId) return;
        try {
            const response = await cancelBooking(actionTargetId);
            if (response.success !== false) {
                toast.success("Booking cancelled successfully.");
                loadBookings();
            } else {
                toast.error(response.message || "Failed to cancel booking.");
            }
        } catch (error) {
            toast.error("Failed to cancel booking.");
        } finally {
            setConfirmModalOpen(false);
            setActionTargetId(null);
        }
    };

    // Stats computation
    const total = bookings.length;
    const confirmed = bookings.filter((b) => b.bookingStatus === "confirmed").length;
    const pendingPayment = bookings.filter((b) => b.bookingStatus === "pending_payment").length;
    const cancelled = bookings.filter((b) => b.bookingStatus === "cancelled").length;
    const completed = bookings.filter((b) => b.bookingStatus === "completed").length;
    const revenue = bookings
        .filter((b) => b.bookingStatus === "confirmed" || b.bookingStatus === "completed")
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    const filteredBookings = bookings.filter((b) => {
        const query = search.toLowerCase();
        const primaryName = b.passengerDetails?.[0]?.name?.toLowerCase() || "";
        const bId = (b._id || b.id || "").toString().toLowerCase();
        const ticketMatch = b.ticketId && b.ticketId.toLowerCase().includes(query);
        const nameMatch = primaryName.includes(query);
        const ferryMatch = b.schedule?.ferry?.name?.toLowerCase().includes(query) || false;
        const matchesSearch = !query || bId.includes(query) || ticketMatch || nameMatch || ferryMatch;
        const matchesFilter = filterStatus === "all" || b.bookingStatus === filterStatus;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    const statusLabel = (status) => {
        switch (status) {
            case "pending_payment": return "Awaiting Payment";
            case "confirmed": return "Confirmed";
            case "cancelled": return "Cancelled";
            case "completed": return "Completed";
            default: return status;
        }
    };

    return (
        <div className="space-y-6 text-base-content animate-in fade-in">
            <AdminPageHeader
                title="Booking Management"
                description="Monitor all passenger bookings. Bookings auto-confirm after payment — no manual approval required."
            />

            {/* Statistics */}
            <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
                <StatsCard
                    title="Total Bookings"
                    value={total}
                    icon={<Ticket size={20} />}
                    color="bg-primary"
                />
                <StatsCard
                    title="Confirmed"
                    value={confirmed}
                    icon={<CheckCircle2 size={20} />}
                    color="bg-success"
                />
                <StatsCard
                    title="Awaiting Payment"
                    value={pendingPayment}
                    icon={<Clock size={20} />}
                    color="bg-warning"
                />
                <StatsCard
                    title="Cancelled"
                    value={cancelled}
                    icon={<XCircle size={20} />}
                    color="bg-error"
                />
                <StatsCard
                    title="Revenue"
                    value={`₹${revenue.toLocaleString("en-IN")}`}
                    icon={<IndianRupee size={20} />}
                    color="bg-secondary"
                />
            </div>

            {/* Filters and Search */}
            <div className="bg-base-100/90 rounded-2xl border border-base-300 shadow-lg p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div className="w-full lg:max-w-md">
                        <SearchBar
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by ticket ID, passenger, ferry..."
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="select select-bordered select-sm rounded-xl h-10"
                        >
                            <option value="all">All Statuses</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="pending_payment">Awaiting Payment</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <div className="text-sm text-base-content/60 font-medium">
                            {filteredBookings.length} Bookings
                        </div>
                    </div>
                </div>

                {filteredBookings.length === 0 ? (
                    <EmptyState
                        title="No Bookings Found"
                        description={search ? "No booking matches your active search term." : "There are no bookings recorded in the system."}
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr className="border-b border-base-300">
                                    <th className="py-4 font-semibold text-sm">Ticket ID</th>
                                    <th className="py-4 font-semibold text-sm">Passengers</th>
                                    <th className="py-4 font-semibold text-sm">Vessel & Route</th>
                                    <th className="py-4 font-semibold text-sm">Seats</th>
                                    <th className="py-4 font-semibold text-sm">Fare</th>
                                    <th className="py-4 font-semibold text-sm">Status</th>
                                    <th className="py-4 text-right font-semibold text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map((b) => {
                                    const bId = b._id || b.id;
                                    const primaryName = b.passengerDetails?.[0]?.name || "N/A";
                                    const seatsText = (b.seatNumbers || b.seats)?.join(", ") || "—";
                                    const origin = b.schedule?.route?.origin || "?";
                                    const destination = b.schedule?.route?.destination || "?";
                                    const price = b.totalAmount ?? b.totalPrice;
                                    const isCancellable = b.bookingStatus !== "cancelled" && b.bookingStatus !== "completed";

                                    return (
                                        <tr key={bId} className="hover:bg-base-200/40 transition-colors border-b border-base-300/10">
                                            <td className="py-5">
                                                <div className="font-mono font-bold text-xs text-primary">
                                                    {b.ticketId || (typeof bId === "string" ? bId.slice(-8).toUpperCase() : bId)}
                                                </div>
                                                <div className="text-[10px] text-base-content/40 mt-0.5">
                                                    {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "—"}
                                                </div>
                                            </td>
                                            <td className="py-5">
                                                <div className="font-semibold text-sm">{primaryName}</div>
                                                <div className="text-xs text-base-content/50">
                                                    {b.passengerDetails?.length || 1} passenger{b.passengerDetails?.length !== 1 ? "s" : ""}
                                                </div>
                                            </td>
                                            <td className="py-5">
                                                <div className="font-bold text-xs flex items-center gap-1.5">
                                                    <Anchor size={12} className="text-secondary" />
                                                    {b.schedule?.ferry?.name || "Transit Vessel"}
                                                </div>
                                                <div className="text-xs text-base-content/50 mt-1 flex items-center gap-1">
                                                    <MapPin size={11} /> {origin} → {destination}
                                                </div>
                                            </td>
                                            <td className="py-5 font-mono font-semibold text-xs">{seatsText}</td>
                                            <td className="py-5 font-semibold text-sm">₹{price?.toFixed(2)}</td>
                                            <td className="py-5">
                                                <div className="flex flex-col gap-1">
                                                    <StatusBadge status={b.bookingStatus} />
                                                    {b.paymentStatus === "paid" && b.bookingStatus !== "cancelled" && (
                                                        <span className="text-[10px] font-semibold text-success flex items-center gap-1">
                                                            <CheckCheck size={11} /> Payment received
                                                        </span>
                                                    )}
                                                    {(b.paymentStatus === "refunded" || (b.bookingStatus === "cancelled" && b.paymentStatus === "paid")) && (
                                                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                                            <RotateCcw size={11} /> Refund processed
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {isCancellable && (
                                                        <button
                                                            onClick={() => handleCancelTrigger(bId)}
                                                            className="btn btn-outline btn-error btn-xs rounded-lg font-semibold px-3"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                    {!isCancellable && (
                                                        <span className="text-xs text-base-content/40 italic">No actions</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={confirmModalOpen}
                title="Cancel Booking"
                message="Are you sure you want to cancel this booking? This action cannot be undone."
                confirmText="Yes, Cancel Booking"
                cancelText="Close"
                onConfirm={handleConfirmCancel}
                onCancel={() => {
                    setConfirmModalOpen(false);
                    setActionTargetId(null);
                }}
                variant="danger"
            />
        </div>
    );
};

export default BookingManagementPage;
