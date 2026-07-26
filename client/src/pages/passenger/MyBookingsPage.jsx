import { useEffect, useState } from "react";
import { Link } from "react-router";
import { FiCalendar, FiMapPin, FiAnchor, FiGrid, FiTrash2 } from "react-icons/fi";
import { getUserBookings, cancelBooking } from "../../services/bookingService";
import StatusBadge from "../../components/ui/StatusBadge";
import EmptyState from "../../components/ui/EmptyState";
import toast from "react-hot-toast";

const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

const MyBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState("upcoming"); // 'upcoming', 'completed', 'cancelled'
    const [loading, setLoading] = useState(true);

    const loadBookings = async () => {
        setLoading(true);
        try {
            const response = await getUserBookings();
            const list = response.data || response.bookings || [];
            setBookings(list);
        } catch (error) {
            console.error("Failed to load passenger bookings:", error);
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
    }, []);


    const handleCancelBooking = (bookingId) => {
        toast((t) => (
            <div className="flex flex-col gap-2">
                <p className="text-xs font-bold text-base-content">Cancel this ferry booking?</p>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            confirmCancellation(bookingId);
                        }}
                        className="btn btn-error btn-xs text-white"
                    >
                        Confirm Cancel
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="btn btn-ghost btn-xs"
                    >
                        No
                    </button>
                </div>
            </div>
        ), { duration: 6000 });
    };

    const confirmCancellation = async (bookingId) => {
        try {
            if (bookingId && !bookingId.toString().startsWith("TKT-") && !bookingId.toString().startsWith("BK-")) {
                const response = await cancelBooking(bookingId);
                if (response.success !== false) {
                    toast.success("Booking cancelled successfully.");
                    loadBookings();
                    return;
                } else {
                    toast.error(response.message || "Failed to cancel booking.");
                }
            }
        } catch (error) {
            toast.error("Failed to cancel booking. Please try again.");
        }
    };

    // Filter by active tabs — pending_payment bookings show in upcoming
    const filteredBookings = bookings.filter((b) => {
        const rawStatus = (b.bookingStatus || b.status)?.toLowerCase();
        if (activeTab === "upcoming") {
            return ["scheduled", "boarding", "departed", "confirmed", "pending", "pending_payment"].includes(rawStatus);
        }
        if (activeTab === "completed") {
            return rawStatus === "completed";
        }
        if (activeTab === "cancelled") {
            return rawStatus === "cancelled";
        }
        return false;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12 text-slate-900 dark:text-slate-100 animate-in fade-in">
            {/* Page Header */}
            <div>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Passenger Portal
                </span>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
                    My Booking History
                </h1>
            </div>

            {/* Booking Navigation tabs */}
            <div className="tabs tabs-boxed bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 p-1.5 rounded-2xl w-fit flex gap-1 shadow-sm">
                <button
                    onClick={() => setActiveTab("upcoming")}
                    className={`tab rounded-xl font-bold transition-all ${
                        activeTab === "upcoming" ? "tab-active bg-primary text-white" : "text-slate-600 dark:text-slate-300"
                    }`}
                >
                    Upcoming Trips
                </button>
                <button
                    onClick={() => setActiveTab("completed")}
                    className={`tab rounded-xl font-bold transition-all ${
                        activeTab === "completed" ? "tab-active bg-primary text-white" : "text-slate-600 dark:text-slate-300"
                    }`}
                >
                    Completed
                </button>
                <button
                    onClick={() => setActiveTab("cancelled")}
                    className={`tab rounded-xl font-bold transition-all ${
                        activeTab === "cancelled" ? "tab-active bg-primary text-white" : "text-slate-600 dark:text-slate-300"
                    }`}
                >
                    Cancelled
                </button>
            </div>

            {/* Bookings cards lists */}
            <div className="space-y-4">
                {filteredBookings.length === 0 ? (
                    <EmptyState
                        title={`No ${activeTab} bookings`}
                        description={`You don't have any voyages recorded under the ${activeTab} list.`}
                        buttonText={activeTab === "upcoming" ? "Book a Ferry" : "Check Schedules"}
                        buttonLink={activeTab === "upcoming" ? "/dashboard" : "/dashboard"}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredBookings.map((b) => {
                            const bId = b._id || b.id;
                            const bStatus = b.bookingStatus || b.status;
                            const bSeats = b.seatNumbers || b.seats;
                            const bPrice = b.totalAmount !== undefined ? b.totalAmount : b.totalPrice;

                            return (
                                <div
                                    key={bId}
                                    className="bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 rounded-3xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1.5 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 flex flex-col justify-between gap-5"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-black text-slate-900 dark:text-white text-lg">
                                                {b.schedule?.ferry?.name || "Transit Vessel"}
                                            </h4>
                                            <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wide mt-1">
                                                Booking ID: {b.ticketId || bId}
                                            </p>
                                        </div>
                                        <StatusBadge status={bStatus} />
                                    </div>

                                    {/* Voyage details */}
                                    <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 text-sm font-semibold">
                                        <div className="flex items-start gap-2.5">
                                            <FiMapPin className="text-primary mt-0.5 shrink-0" />
                                            <div>
                                                <span className="text-[10px] text-slate-600 dark:text-slate-400 uppercase block mb-0.5 font-bold">Route</span>
                                                <span className="text-slate-900 dark:text-white font-black">
                                                    {b.schedule?.route?.origin} to {b.schedule?.route?.destination}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2.5">
                                            <FiCalendar className="text-primary mt-0.5 shrink-0" />
                                            <div>
                                                <span className="text-[10px] text-slate-600 dark:text-slate-400 uppercase block mb-0.5 font-bold">Departure</span>
                                                <span className="text-slate-900 dark:text-white font-black">
                                                    {formatDateTime(b.schedule?.departureTime)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700 mt-1">
                                            <div className="flex items-start gap-2">
                                                <FiGrid className="text-primary mt-0.5 shrink-0" />
                                                <div>
                                                    <span className="text-[10px] text-slate-600 dark:text-slate-400 uppercase block mb-0.5 font-bold">Seats</span>
                                                    <span className="text-slate-900 dark:text-white font-mono font-bold">{bSeats?.join(", ")}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-600 dark:text-slate-400 uppercase block mb-0.5 font-bold">Paid Amount</span>
                                                <span className="text-slate-900 dark:text-white font-black">₹{bPrice?.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Upcoming cancellations trigger */}
                                    {(activeTab === "upcoming" && bStatus !== "cancelled") && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleCancelBooking(bId)}
                                                className="btn btn-outline btn-error btn-sm rounded-xl w-full flex items-center justify-center gap-2 font-bold text-xs"
                                            >
                                                <FiTrash2 /> Cancel Booking
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookingsPage;
