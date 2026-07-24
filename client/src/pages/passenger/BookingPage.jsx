import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import { getScheduleById } from "../../services/scheduleService";
import { createBooking } from "../../services/bookingService";
import { FiUser, FiArrowLeft, FiCreditCard, FiCompass, FiCalendar, FiUsers } from "react-icons/fi";
import { DetailSkeleton } from "../../components/ui/LoadingSkeleton";
import toast from "react-hot-toast";

const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

const BookingPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const scheduleId = searchParams.get("scheduleId") || "";
    const passengerCount = Number(searchParams.get("passengers")) || 1;
    const dateVal = searchParams.get("date") || "";

    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSeats, setSelectedSeats] = useState([]);
    
    // Form fields
    const [passengersData, setPassengersData] = useState(
        Array.from({ length: passengerCount }).map(() => ({ name: "", age: "", gender: "Male" }))
    );

    // Mock cabin seats setup (6 seats per row, A B C | D E F)
    const rows = ["1", "2", "3", "4", "5", "6"];
    const cols = ["A", "B", "C", "D", "E", "F"];
    
    // Fixed pre-booked seats
    const preBookedSeats = ["1C", "2A", "2B", "4D", "5F", "6B"];

    useEffect(() => {
        const fetchScheduleDetails = async () => {
            setLoading(true);
            try {
                // Check if it's a mock schedule
                if (scheduleId.startsWith("mock-")) {
                    const savedMock = localStorage.getItem(`mock_schedule_${scheduleId}`);
                    if (savedMock) {
                        setSchedule(JSON.parse(savedMock));
                    }
                } else {
                    const response = await getScheduleById(scheduleId);
                    setSchedule(response.schedule);
                }
            } catch (error) {
                console.error("Failed to load schedule for booking:", error);
                toast.error("Failed to load schedule details");
            } finally {
                setLoading(false);
            }
        };

        if (scheduleId) {
            fetchScheduleDetails();
        }
    }, [scheduleId]);

    const handleSeatClick = (seatId) => {
        if (preBookedSeats.includes(seatId)) return; // Locked

        setSelectedSeats((prev) => {
            if (prev.includes(seatId)) {
                return prev.filter((s) => s !== seatId); // Toggle off
            }
            if (prev.length >= passengerCount) {
                // Remove first, add new
                return [...prev.slice(1), seatId];
            }
            return [...prev, seatId];
        });
    };

    const handlePassengerFieldChange = (index, field, value) => {
        const updated = [...passengersData];
        updated[index] = { ...updated[index], [field]: value };
        setPassengersData(updated);
    };

    const handleProceedToPayment = async (e) => {
        e.preventDefault();
        
        // Validation
        const incomplete = passengersData.some((p) => !p.name || !p.age);
        if (incomplete) {
            toast.error("Please fill in name and age details for all passengers");
            return;
        }

        if (selectedSeats.length < passengerCount) {
            toast.error(`Please select exactly ${passengerCount} seats before paying`);
            return;
        }

        try {
            const passengerDetails = passengersData.map((p) => ({
                name: p.name,
                age: parseInt(p.age),
                gender: p.gender.toLowerCase()
            }));

            const response = await createBooking({
                schedule: schedule._id,
                passengerDetails,
                seatsBooked: selectedSeats.length,
                seatNumbers: selectedSeats
            });

            if (response.success && response.booking) {
                // Carry database booking object, which will have _id, totalAmount, passengerDetails, etc.
                navigate("/payment", { state: { booking: response.booking } });
            } else {
                toast.error(response.message || "Failed to create booking on the server");
            }
        } catch (error) {
            console.warn("Booking creation endpoint error, fallback to offline demo mode:", error);
            // Fallback for seamless visual testing
            const offlineBooking = {
                id: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
                schedule,
                passengerDetails: passengersData.map((p) => ({
                    name: p.name,
                    age: parseInt(p.age),
                    gender: p.gender.toLowerCase()
                })),
                seats: selectedSeats,
                totalPrice: (schedule.fare || 12.50) * selectedSeats.length + 5.00,
                date: dateVal || new Date().toISOString()
            };
            navigate("/payment", { state: { booking: offlineBooking } });
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Link to="/dashboard" className="btn btn-ghost btn-circle bg-base-100 border border-base-300/30">
                        <FiArrowLeft size={20} />
                    </Link>
                    <h1 className="text-3xl font-bold">Booking Details</h1>
                </div>
                <DetailSkeleton />
            </div>
        );
    }

    if (!schedule) {
        return (
            <div className="p-8 text-center bg-base-100 rounded-[28px] border border-white/20 shadow-lg max-w-xl mx-auto my-12 text-base-content">
                <FiCompass size={50} className="mx-auto text-error mb-4" />
                <h3 className="text-2xl font-bold">Journey Not Found</h3>
                <p className="mt-2 text-base-content/65">The schedule you are trying to book is no longer active.</p>
                <Link to="/dashboard" className="btn btn-primary mt-6 rounded-xl border-0 bg-gradient-to-r from-blue-600 to-sky-500 text-white">
                    Back to Search
                </Link>
            </div>
        );
    }

    const ticketSubtotal = (schedule.fare || 12.50) * passengerCount;
    const bookingFee = 5.00;
    const finalTotal = ticketSubtotal + bookingFee;

    return (
        <div className="space-y-8 pb-12 text-base-content">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-ghost btn-circle bg-base-100 hover:bg-base-200 border border-base-300/30 shadow-sm transition-all"
                    title="Go back"
                >
                    <FiArrowLeft size={20} />
                </button>
                <div>
                    <p className="text-xs text-base-content/60 font-medium">Passenger Terminal</p>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-base-content mt-0.5">
                        Complete Booking
                    </h1>
                </div>
            </div>

            {/* Form & Summary splits */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Left Forms */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Passenger details */}
                    <div className="bg-base-100/90 dark:bg-slate-900/90 border border-base-300/30 dark:border-white/5 rounded-3xl p-6 shadow-lg backdrop-blur-xl">
                        <div className="flex items-center gap-3 pb-4 border-b border-base-300/20 mb-6">
                            <FiUser className="text-primary" size={18} />
                            <h3 className="font-extrabold text-lg">Passenger Information</h3>
                        </div>

                        <div className="space-y-6">
                            {passengersData.map((passenger, i) => (
                                <div key={i} className="space-y-4 p-4 bg-base-200/30 dark:bg-slate-800/20 rounded-2xl border border-base-300/10">
                                    <h4 className="text-xs font-black uppercase text-primary tracking-wider">Passenger #{i + 1}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="flex flex-col">
                                            <label className="text-[11px] font-bold uppercase text-base-content/60 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. John Doe"
                                                value={passenger.name}
                                                onChange={(e) => handlePassengerFieldChange(i, "name", e.target.value)}
                                                className="input input-bordered rounded-xl h-11 text-sm font-semibold"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-[11px] font-bold uppercase text-base-content/60 mb-2">Age</label>
                                            <input
                                                type="number"
                                                required
                                                min="1"
                                                placeholder="e.g. 28"
                                                value={passenger.age}
                                                onChange={(e) => handlePassengerFieldChange(i, "age", e.target.value)}
                                                className="input input-bordered rounded-xl h-11 text-sm font-semibold"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-[11px] font-bold uppercase text-base-content/60 mb-2">Gender</label>
                                            <select
                                                value={passenger.gender}
                                                onChange={(e) => handlePassengerFieldChange(i, "gender", e.target.value)}
                                                className="select select-bordered rounded-xl h-11 text-sm font-semibold"
                                            >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Seat Map Selector */}
                    <div className="bg-base-100/90 dark:bg-slate-900/90 border border-base-300/30 dark:border-white/5 rounded-3xl p-6 shadow-lg backdrop-blur-xl">
                        <div className="flex items-center gap-3 pb-4 border-b border-base-300/20 mb-6">
                            <FiUsers className="text-secondary" size={18} />
                            <h3 className="font-extrabold text-lg">Cabin Seat Selection</h3>
                        </div>

                        <div className="flex flex-col items-center py-4 bg-base-200/20 rounded-2xl border border-base-300/10">
                            {/* Front Screen Directional Indicator */}
                            <div className="w-48 bg-primary/10 border border-primary/25 rounded-full py-1 text-center mb-10 text-[10px] uppercase font-bold tracking-widest text-primary">
                                Front Cabin / Screen
                            </div>

                            {/* Cabin Seat Grid layout */}
                            <div className="space-y-4">
                                {rows.map((row) => (
                                    <div key={row} className="flex gap-4 items-center">
                                        <span className="w-4 text-center font-bold text-xs text-base-content/40">{row}</span>
                                        <div className="flex gap-2">
                                            {cols.map((col, idx) => {
                                                const seatId = `${row}${col}`;
                                                const isBooked = preBookedSeats.includes(seatId);
                                                const isSelected = selectedSeats.includes(seatId);

                                                return (
                                                    <div key={col} className="flex items-center">
                                                        {/* Aisle indicator */}
                                                        {idx === 3 && <div className="w-8"></div>}
                                                        <button
                                                            type="button"
                                                            disabled={isBooked}
                                                            onClick={() => handleSeatClick(seatId)}
                                                            className={`w-9 h-9 rounded-lg font-bold text-xs transition-all flex items-center justify-center border ${
                                                                isBooked
                                                                    ? "bg-base-300 border-base-400 text-base-content/30 cursor-not-allowed"
                                                                    : isSelected
                                                                    ? "bg-gradient-to-r from-blue-600 to-sky-500 border-0 text-white shadow-md hover:scale-95"
                                                                    : "bg-base-100 hover:bg-base-200/80 border-base-300 text-base-content"
                                                            }`}
                                                            title={isBooked ? `Seat ${seatId} (Occupied)` : `Seat ${seatId}`}
                                                        >
                                                            {col}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Legend */}
                            <div className="flex flex-wrap justify-center gap-6 mt-8 text-xs font-semibold text-base-content/70 border-t border-base-300/10 pt-4 w-full px-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-base-100 border border-base-300 rounded"></div>
                                    <span>Available</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-gradient-to-r from-blue-600 to-sky-500 rounded"></div>
                                    <span>Selected</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-base-300 rounded"></div>
                                    <span>Booked</span>
                                </div>
                                <div className="text-primary font-bold">
                                    Selected: {selectedSeats.length} / {passengerCount} Seats
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Summary column */}
                <div className="space-y-6">
                    {/* Voyage details info panel */}
                    <div className="bg-base-100/90 dark:bg-slate-900/90 border border-base-300/30 dark:border-white/5 rounded-3xl p-6 shadow-lg backdrop-blur-xl">
                        <div className="flex items-center gap-3 pb-4 border-b border-base-300/20 mb-4">
                            <FiCompass className="text-primary" size={18} />
                            <h3 className="font-extrabold text-base">Journey Summary</h3>
                        </div>

                        <div className="space-y-4 text-sm font-semibold text-base-content/85">
                            <div>
                                <span className="text-[10px] text-base-content/40 uppercase block mb-1">Vessel</span>
                                <span className="font-bold text-base-content">{schedule.ferry?.name || "Transit Vessel"}</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-base-content/40 uppercase block mb-1">Route Path</span>
                                <span className="text-base-content font-bold">
                                    {schedule.route?.origin} to {schedule.route?.destination}
                                </span>
                            </div>
                            <div>
                                <span className="text-[10px] text-base-content/40 uppercase block mb-1">Date & Time</span>
                                <span className="text-base-content font-bold">
                                    {formatDateTime(schedule.departureTime)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Cost Summary panel */}
                    <div className="bg-base-100/90 dark:bg-slate-900/90 border border-base-300/30 dark:border-white/5 rounded-3xl p-6 shadow-lg backdrop-blur-xl">
                        <div className="flex items-center gap-3 pb-4 border-b border-base-300/20 mb-4">
                            <FiCreditCard className="text-primary" size={18} />
                            <h3 className="font-extrabold text-base">Billing Details</h3>
                        </div>

                        <div className="space-y-3.5 text-sm">
                            <div className="flex justify-between font-medium">
                                <span className="text-base-content/60">
                                    Ticket Price (${schedule.fare?.toFixed(2)} × {passengerCount})
                                </span>
                                <span className="font-bold text-base-content">${ticketSubtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-medium">
                                <span className="text-base-content/60">Booking & Port Fee</span>
                                <span className="font-bold text-base-content">${bookingFee.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-base-300/20 my-2 pt-3 flex justify-between items-baseline">
                                <span className="font-bold text-base-content">Total (USD)</span>
                                <span className="text-2xl font-black text-primary">${finalTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleProceedToPayment}
                            className="btn w-full h-12 mt-6 rounded-xl border-0 text-white bg-gradient-to-r from-[#2563EB] via-[#0EA5E9] to-[#22D3EE] hover:scale-[1.01] hover:shadow-lg transition-all duration-300 font-bold"
                        >
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
