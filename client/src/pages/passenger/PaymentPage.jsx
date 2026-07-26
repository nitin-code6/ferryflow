import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router";
import { FiCreditCard, FiArrowLeft, FiLock, FiCalendar, FiCompass, FiShield, FiAnchor } from "react-icons/fi";
import { createPaymentOrder, verifyPayment } from "../../services/paymentService";
import toast from "react-hot-toast";

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const booking = location.state?.booking;

    // Fallback data in case they refresh on Payment Page
    const fallbackBooking = {
        id: "BK-827361",
        totalPrice: 30.00,
        seats: ["3A", "3B"],
        schedule: {
            ferry: { name: "Sea Breeze" },
            route: { origin: "Seattle Terminal", destination: "Bainbridge Island" },
            departureTime: new Date().toISOString()
        }
    };

    const activeBooking = booking || fallbackBooking;

    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvc, setCvc] = useState("");
    const [name, setName] = useState("");
    const [isPaying, setIsPaying] = useState(false);
    const [paymentStep, setPaymentStep] = useState("");

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || "";
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length > 0) {
            return parts.join(" ");
        } else {
            return v;
        }
    };

    const handleCardChange = (e) => {
        setCardNumber(formatCardNumber(e.target.value));
    };

    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, "");
        if (value.length > 2) {
            value = value.substring(0, 2) + "/" + value.substring(2, 4);
        }
        setExpiry(value);
    };

    const priceDisplay = activeBooking.totalAmount !== undefined ? activeBooking.totalAmount : activeBooking.totalPrice;

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePaySubmit = async (e) => {
        e.preventDefault();

        setIsPaying(true);

        const bookingId = activeBooking._id || activeBooking.id;

        if (bookingId && !bookingId.toString().startsWith("BK-")) {
            try {
                // 1. Create order on backend
                const orderRes = await createPaymentOrder(bookingId);
                const orderData = orderRes.data || orderRes.order;
                
                if ((orderRes.statusCode < 400 || orderRes.success) && orderData) {
                    const res = await loadRazorpayScript();
                    if (!res) {
                        toast.error("Razorpay SDK failed to load. Are you online?");
                        setIsPaying(false);
                        return;
                    }

                    const options = {
                        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TGux47r14aaiav", // Match test key in server env
                        amount: orderData.amount,
                        currency: orderData.currency,
                        name: "FerryFlow",
                        description: "Ferry Ticket Booking",
                        order_id: orderData.id,
                        handler: async function (response) {
                            try {
                                const verifyRes = await verifyPayment({
                                    bookingId: bookingId,
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature
                                });
                                
                                const verifiedBooking = verifyRes.data || verifyRes.booking;
                                if ((verifyRes.statusCode < 400 || verifyRes.success) && verifiedBooking) {
                                    toast.success("Payment verified successfully!");
                                    const normalizedBooking = {
                                        ...verifiedBooking,
                                        id: verifiedBooking._id || verifiedBooking.id,
                                        seats: verifiedBooking.seatNumbers || activeBooking.seats,
                                        totalPrice: verifiedBooking.totalAmount || activeBooking.totalAmount || activeBooking.totalPrice,
                                        schedule: activeBooking.schedule
                                    };
                                    navigate("/payment-success", { state: { booking: normalizedBooking } });
                                } else {
                                    toast.error(verifyRes.message || "Payment verification failed.");
                                    setIsPaying(false);
                                }
                            } catch (error) {
                                toast.error("Payment verification failed on server.");
                                setIsPaying(false);
                            }
                        },
                        prefill: {
                            name: activeBooking.user?.name || "Passenger",
                            email: activeBooking.user?.email || "passenger@example.com",
                        },
                        theme: {
                            color: "#2563EB"
                        },
                        modal: {
                            ondismiss: function () {
                                setIsPaying(false);
                            }
                        }
                    };

                    const rzp = new window.Razorpay(options);
                    rzp.open();
                    return; // Prevent running fallback
                } else {
                    toast.error(orderRes.message || "Failed to create payment order.");
                    setIsPaying(false);
                    return;
                }
            } catch (error) {
                console.warn("Backend checkout API failed", error);
                toast.error("Could not initiate payment. Try again.");
                setIsPaying(false);
                return;
            }
        }

        // Mock payment confirmation (fallback)
        const confirmedBooking = {
            ...activeBooking,
            paymentStatus: "paid",
            bookingStatus: "confirmed",
            paymentId: `PAY-${Math.floor(10000000 + Math.random() * 90000000)}`,
            ticketId: `FF-${Date.now()}`
        };

        const existingBookings = JSON.parse(localStorage.getItem("ferryflow_bookings") || "[]");
        const index = existingBookings.findIndex(b => b.id === activeBooking.id);
        if (index !== -1) {
            existingBookings[index] = confirmedBooking;
        } else {
            existingBookings.unshift(confirmedBooking);
        }
        localStorage.setItem("ferryflow_bookings", JSON.stringify(existingBookings));

        setIsPaying(false);
        toast.success("Mock Payment successful!");
        navigate("/payment-success", { state: { booking: confirmedBooking } });
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 text-base-content space-y-8 animate-in fade-in">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-ghost btn-circle bg-base-100 border border-base-300/30 shadow-sm"
                    title="Go back"
                >
                    <FiArrowLeft size={20} />
                </button>
                <div>
                    <p className="text-xs text-base-content/60 font-medium">Passenger Terminal</p>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-0.5">
                        Secure Payment
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Action Area */}
                <div className="lg:col-span-2 bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 rounded-3xl p-6 shadow-sm space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-base-300/20">
                        <div className="flex items-center gap-2.5 font-extrabold text-lg">
                            <FiCreditCard className="text-primary" /> Payment Method
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-success bg-success/10 border border-success/20 px-2.5 py-1 rounded-full font-bold">
                            <FiLock size={12} /> Secure Checkout
                        </div>
                    </div>

                    <div className="space-y-4 text-center py-6">
                        <p className="text-sm font-medium text-base-content/70">
                            You will be redirected to the secure Razorpay payment gateway to complete your transaction.
                        </p>
                    </div>

                    <button
                        onClick={handlePaySubmit}
                        disabled={isPaying}
                        className="btn w-full h-12 mt-6 rounded-xl border-0 text-white bg-gradient-to-r from-blue-600 to-sky-500 font-bold hover:scale-[1.01] hover:shadow-lg transition-all"
                    >
                        {isPaying ? "Processing..." : `Pay ₹${priceDisplay?.toFixed(2)} via Razorpay`}
                    </button>
                </div>

                {/* Right Breakdown info */}
                <div className="space-y-6">
                    <div className="bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 rounded-3xl p-6 shadow-sm hover:scale-[1.01] transition-transform duration-300 space-y-4">
                        <h3 className="font-extrabold text-base border-b border-base-300/20 pb-3">Journey Details</h3>
                        <div className="space-y-3.5 text-sm font-semibold">
                            <div className="flex gap-2">
                                <FiAnchor className="text-primary mt-0.5 shrink-0" />
                                <div>
                                    <span className="text-[10px] text-base-content/40 uppercase block">Vessel</span>
                                    <span>{activeBooking.schedule?.ferry?.name || "Transit Vessel"}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <FiCompass className="text-primary mt-0.5 shrink-0" />
                                <div>
                                    <span className="text-[10px] text-base-content/40 uppercase block">Terminal Link</span>
                                    <span>{activeBooking.schedule?.route?.origin} to {activeBooking.schedule?.route?.destination}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-primary shrink-0">🎫</span>
                                <div>
                                    <span className="text-[10px] text-base-content/40 uppercase block">Seats</span>
                                    <span className="font-mono">{(activeBooking.seatNumbers || activeBooking.seats)?.join(", ") || "—"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 rounded-3xl p-6 shadow-sm text-center flex flex-col items-center gap-2.5">
                        <FiShield size={32} className="text-success" />
                        <h4 className="font-bold text-sm text-base-content">Razorpay Secured</h4>
                        <p className="text-xs text-base-content/50 leading-relaxed">
                            Your payment is processed securely via Razorpay — India's leading payment gateway.
                        </p>
                    </div>
                </div>
            </div>

            {/* Payment Loader Overlay */}
            {isPaying && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-white/85 dark:bg-[#0A1120]/90 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center gap-5 text-slate-800 dark:text-slate-100">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                        <h3 className="font-extrabold text-xl">Payment Processing</h3>
                        <p className="text-sm font-semibold text-base-content/60">
                            {paymentStep}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentPage;
