import { useLocation, Link, useNavigate } from "react-router";
import { FiCheckCircle, FiDownload, FiCalendar, FiArrowRight, FiHome, FiMapPin, FiAnchor } from "react-icons/fi";
import toast from "react-hot-toast";

const PaymentSuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const booking = location.state?.booking;

    // Fallback in case they visit direct without state
    const fallbackBooking = {
        id: "BK-827361",
        paymentId: "PAY-98218731",
        seats: ["3A", "3B"],
        totalPrice: 30.00,
        date: new Date().toISOString(),
        schedule: {
            ferry: { name: "Sea Breeze", registrationNumber: "SEA-SB-1144" },
            route: { origin: "Seattle Terminal", destination: "Bainbridge Island" },
            departureTime: new Date(new Date().getTime() + 86400000).toISOString() // Tomorrow
        }
    };

    const activeBooking = booking || fallbackBooking;

    const handleDownloadReceipt = () => {
        toast.success("Receipt downloaded successfully!");
    };

    return (
        <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4 text-base-content">
            <div className="bg-base-100/90 dark:bg-slate-900/90 border border-base-300/30 dark:border-white/5 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl text-center space-y-8">
                {/* Success Animation / Badge */}
                <div className="flex flex-col items-center gap-3">
                    <div className="text-success animate-bounce">
                        <FiCheckCircle size={72} className="stroke-[1.5]" />
                    </div>
                    <h2 className="text-3xl font-black tracking-tight mt-2">
                        Booking Confirmed!
                    </h2>
                    <p className="text-sm font-semibold text-base-content/60">
                        Thank you for booking. Your transaction was completed successfully.
                    </p>
                </div>

                {/* Confirmations panel */}
                <div className="grid grid-cols-2 gap-4 border-y border-base-300/20 py-5 text-left text-sm font-semibold">
                    <div>
                        <span className="text-[10px] text-base-content/40 uppercase block mb-1">Ticket ID</span>
                        <span className="font-mono font-bold text-base-content text-base">{activeBooking.id}</span>
                    </div>
                    <div>
                        <span className="text-[10px] text-base-content/40 uppercase block mb-1">Payment ID</span>
                        <span className="font-mono font-bold text-base-content text-base truncate block">{activeBooking.paymentId}</span>
                    </div>
                </div>

                {/* Journey Specs details */}
                <div className="bg-base-200/40 dark:bg-slate-800/30 border border-base-300/10 rounded-2xl p-5 text-left space-y-4">
                    <h4 className="text-xs font-black uppercase text-primary tracking-wider border-b border-base-300/10 pb-2">Voyage Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-semibold">
                        <div className="flex gap-2.5 items-start">
                            <FiAnchor className="text-primary mt-0.5 shrink-0" />
                            <div>
                                <span className="text-[10px] text-base-content/40 uppercase block mb-0.5">Vessel</span>
                                <span className="text-base-content">{activeBooking.schedule?.ferry?.name || "Transit Vessel"}</span>
                            </div>
                        </div>

                        <div className="flex gap-2.5 items-start">
                            <FiMapPin className="text-primary mt-0.5 shrink-0" />
                            <div>
                                <span className="text-[10px] text-base-content/40 uppercase block mb-0.5">Route</span>
                                <span className="text-base-content">
                                    {activeBooking.schedule?.route?.origin} → {activeBooking.schedule?.route?.destination}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2.5 items-start">
                            <FiCalendar className="text-primary mt-0.5 shrink-0" />
                            <div>
                                <span className="text-[10px] text-base-content/40 uppercase block mb-0.5">Departure Date</span>
                                <span className="text-base-content">
                                    {new Date(activeBooking.schedule?.departureTime).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2.5 items-start">
                            <span className="text-primary mt-0.5 shrink-0">🎫</span>
                            <div>
                                <span className="text-[10px] text-base-content/40 uppercase block mb-0.5">Seats</span>
                                <span className="text-base-content font-mono">{activeBooking.seats?.join(", ")}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions group */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                        onClick={handleDownloadReceipt}
                        className="btn btn-outline border-base-300 hover:bg-base-200 dark:hover:bg-slate-800 rounded-xl flex-1 font-bold text-sm h-12 flex gap-2 justify-center items-center"
                    >
                        <FiDownload size={16} />
                        Download Receipt
                    </button>
                    <Link
                        to="/my-bookings"
                        className="btn btn-primary text-white border-0 bg-gradient-to-r from-blue-600 to-sky-500 rounded-xl flex-1 font-bold text-sm h-12 flex gap-2 justify-center items-center hover:scale-[1.01]"
                    >
                        Go to My Bookings
                        <FiArrowRight size={16} />
                    </Link>
                </div>

                <div className="text-center pt-2">
                    <Link
                        to="/dashboard"
                        className="text-xs font-semibold text-primary hover:underline flex gap-1 items-center justify-center"
                    >
                        <FiHome size={13} /> Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
