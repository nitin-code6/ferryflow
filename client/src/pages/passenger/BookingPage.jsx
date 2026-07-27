import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import { getScheduleById } from "../../services/scheduleService";
import { createBooking } from "../../services/bookingService";
import { getFerryLayout } from "../../services/ferryService";
import { FiUser, FiArrowLeft, FiCreditCard, FiCompass, FiCalendar, FiUsers } from "react-icons/fi";
import { DetailSkeleton } from "../../components/ui/LoadingSkeleton";
import { socket } from "../../services/socketService";
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
    const [passengerCount, setPassengerCount] = useState(Number(searchParams.get("passengers")) || 1);
    const dateVal = searchParams.get("date") || "";

    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSeats, setSelectedSeats] = useState([]);
    
    // Form fields
    const [passengersData, setPassengersData] = useState([]);

    useEffect(() => {
        setPassengersData((prev) => {
            const currentLength = prev.length;
            if (currentLength === passengerCount) return prev;
            if (currentLength < passengerCount) {
                const extra = Array.from({ length: passengerCount - currentLength }).map(() => ({
                    name: "",
                    age: "",
                    gender: "Male",
                    phone: "",
                    email: ""
                }));
                return [...prev, ...extra];
            } else {
                return prev.slice(0, passengerCount);
            }
        });
        setSelectedSeats((prev) => {
            if (prev.length > passengerCount) {
                return prev.slice(0, passengerCount);
            }
            return prev;
        });
    }, [passengerCount]);

    const [selectedFloor, setSelectedFloor] = useState(1);

    const getColumnLayout = (seatsPerFloor) => {
        if (seatsPerFloor <= 20) {
            return {
                left: ["A"],
                right: ["D"],
                perRow: 2
            };
        } else if (seatsPerFloor <= 60) {
            return {
                left: ["A", "B"],
                right: ["D", "E"],
                perRow: 4
            };
        } else {
            return {
                left: ["A", "B", "C"],
                right: ["D", "E", "F"],
                perRow: 6
            };
        }
    };

    const preBookedSeats = schedule?.bookedSeats || [];

    useEffect(() => {
        const fetchScheduleDetails = async () => {
            setLoading(true);
            try {
                const response = await getScheduleById(scheduleId);
                const scheduleData = response.data || response.schedule;
                
                // Also fetch live seat layout from ferry to get accurate seatConfiguration
                if (scheduleData?.ferry?._id) {
                    try {
                        const layoutRes = await getFerryLayout(scheduleData.ferry._id);
                        const layoutData = layoutRes.data || layoutRes;
                        // Merge fresh seatConfiguration into ferry sub-document
                        scheduleData.ferry = {
                            ...scheduleData.ferry,
                            seatConfiguration: layoutData.seatConfiguration || scheduleData.ferry.seatConfiguration
                        };
                    } catch (layoutErr) {
                        console.warn("Could not fetch seat layout, using stored config:", layoutErr);
                    }
                }
                
                setSchedule(scheduleData);
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

    useEffect(() => {
        if (!scheduleId) return;

        socket.emit("join:schedule", scheduleId);

        const handleSeatBooked = ({ seatNumbers }) => {
            setSchedule((prev) => {
                if (!prev) return prev;
                const uniqueBooked = Array.from(new Set([...(prev.bookedSeats || []), ...seatNumbers]));
                return { ...prev, bookedSeats: uniqueBooked };
            });
            setSelectedSeats((prevSelected) => prevSelected.filter(s => !seatNumbers.includes(s)));
        };

        const handleSeatReleased = ({ seatNumbers }) => {
            setSchedule((prev) => {
                if (!prev) return prev;
                const filteredBooked = (prev.bookedSeats || []).filter(s => !seatNumbers.includes(s));
                return { ...prev, bookedSeats: filteredBooked };
            });
        };

        socket.on("seat:booked", handleSeatBooked);
        socket.on("seat:released", handleSeatReleased);

        return () => {
            socket.emit("leave:schedule", scheduleId);
            socket.off("seat:booked", handleSeatBooked);
            socket.off("seat:released", handleSeatReleased);
        };
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
        
        // Validation — name and age are required for all passengers; phone/email optional
        const incomplete = passengersData.some((p) => !p.name || !p.age);
        if (incomplete) {
            toast.error("Please fill in name and age for all passengers");
            return;
        }

        if (selectedSeats.length < passengerCount) {
            toast.error(`Please select exactly ${passengerCount} seats before paying`);
            return;
        }

        try {
            const passengerDetails = passengersData.map((p, idx) => ({
                name: p.name,
                age: parseInt(p.age),
                gender: idx === 0 ? p.gender.toLowerCase() : "male",
                phone: p.phone || undefined,
                email: p.email || undefined
            }));

            const response = await createBooking({
                schedule: schedule._id,
                passengerDetails,
                seatsBooked: selectedSeats.length,
                seatNumbers: selectedSeats
            });

            if (response.statusCode < 400 && (response.data || response.booking)) {
                toast.success(response.message || "Booking created. Proceed to payment.");
                navigate("/payment", { state: { booking: response.data || response.booking } });
            } else {
                toast.error(response.message || "Failed to create booking on the server");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Booking creation failed. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Link to="/dashboard" className="btn btn-ghost btn-circle bg-base-100 border border-base-300/30">
                        <FiArrowLeft size={20} />
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Booking Details</h1>
                </div>
                <DetailSkeleton />
            </div>
        );
    }

    if (!schedule) {
        return (
            <div className="p-8 text-center bg-white dark:bg-[#0F1D36] rounded-[28px] border border-slate-200 dark:border-sky-950/85 shadow-lg max-w-xl mx-auto my-12 text-slate-800 dark:text-white">
                <FiCompass size={50} className="mx-auto text-error mb-4" />
                <h3 className="text-2xl font-bold">Journey Not Found</h3>
                <p className="mt-2 text-slate-500 dark:text-slate-400">The schedule you are trying to book is no longer active.</p>
                <Link to="/dashboard" className="btn btn-primary mt-6 rounded-xl border-0 bg-gradient-to-r from-blue-600 to-sky-500 text-white">
                    Back to Search
                </Link>
            </div>
        );
    }

    // Dynamic Billing (all in INR — use schedule.fare directly)
    const farePerSeat = schedule.fare || 0;
    const ticketSubtotal = farePerSeat * passengerCount;
    const bookingFee = 25;                         // flat ₹25 booking fee
    const taxRate = 0.05;                          // 5% GST
    const taxAmount = Math.round(ticketSubtotal * taxRate);
    const finalTotal = ticketSubtotal + bookingFee + taxAmount;

    const formattedDate = schedule.departureTime 
        ? new Date(schedule.departureTime).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })
        : "Journey Date";
    const formattedTime = schedule.departureTime 
        ? new Date(schedule.departureTime).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
        : "";

    // Dynamic Seat Layout (from ferry seatConfiguration)
    const seatConfig = schedule.ferry?.seatConfiguration;
    const totalFloors = seatConfig?.totalFloors || 1;
    const seatsPerFloor = seatConfig?.seatsPerFloor || 30;
    const colLayout = getColumnLayout(seatsPerFloor);
    const { left, right, perRow } = colLayout;

    // Compute row labels for the currently selected floor
    const rowsPerFloor = Math.ceil(seatsPerFloor / perRow);
    const floorRowOffset = (selectedFloor - 1) * rowsPerFloor;
    const floorRows = Array.from({ length: rowsPerFloor }, (_, i) => String(floorRowOffset + i + 1));

    return (
        <div className="space-y-8 pb-12 text-slate-800 dark:text-slate-200">
            {/* Header */}
            <div className="flex items-center gap-4 text-left">
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-ghost btn-circle bg-white dark:bg-[#0F1D36] hover:bg-slate-50 dark:hover:bg-slate-900/60 border border-slate-200 dark:border-sky-950/80 shadow-sm transition-all"
                    title="Go back"
                >
                    <FiArrowLeft size={20} />
                </button>
                <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Complete Your Booking</p>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mt-0.5">
                        {schedule.route?.origin} → {schedule.route?.destination}
                    </h1>
                    <p className="text-[11px] text-slate-450 dark:text-slate-400 font-semibold mt-0.5">
                        {formattedDate} • {formattedTime}
                    </p>
                </div>
            </div>

            {/* Form & Summary splits */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Left Forms (Passenger + Seats Selection) */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Passenger details */}
                    <div className="bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 rounded-3xl p-6 shadow-sm text-left">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-sky-950/40 mb-6">
                            <div className="flex items-center gap-3">
                                <FiUser className="text-primary" size={18} />
                                <h3 className="font-bold text-base text-slate-800 dark:text-white">Passenger Information</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tickets:</label>
                                <select
                                    value={passengerCount}
                                    onChange={(e) => setPassengerCount(Number(e.target.value))}
                                    className="select select-bordered select-xs rounded-lg font-bold bg-white dark:bg-slate-950 border-slate-200 dark:border-sky-950/40 text-xs text-slate-700 dark:text-slate-200 h-8"
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                        <option key={num} value={num}>{num} {num === 1 ? "Ticket" : "Tickets"}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {passengersData.map((passenger, i) => {
                                const isPrimary = i === 0;
                                if (!isPrimary) {
                                    return (
                                        <div key={i} className="space-y-4 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/60 dark:border-sky-950/20 text-left">
                                            <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Passenger #{i + 1}</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex flex-col">
                                                    <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Full Name</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder={`Passenger #${i + 1} Name`}
                                                        value={passenger.name}
                                                        onChange={(e) => handlePassengerFieldChange(i, "name", e.target.value)}
                                                        className="input input-bordered rounded-xl h-11 text-xs font-semibold bg-white dark:bg-slate-950 border-slate-200 dark:border-sky-950/60 focus:outline-none focus:border-[#2563EB]"
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Age</label>
                                                    <input
                                                        type="number"
                                                        required
                                                        min="1"
                                                        placeholder="e.g. 28"
                                                        value={passenger.age}
                                                        onChange={(e) => handlePassengerFieldChange(i, "age", e.target.value)}
                                                        className="input input-bordered rounded-xl h-11 text-xs font-semibold bg-white dark:bg-slate-950 border-slate-200 dark:border-sky-950/60 focus:outline-none focus:border-[#2563EB]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={i} className="space-y-4 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/60 dark:border-sky-950/20">
                                        <h4 className="text-xs font-bold uppercase text-primary tracking-wider">Passenger #{i + 1} (Primary)</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex flex-col">
                                                <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Full Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="e.g. John Doe"
                                                    value={passenger.name}
                                                    onChange={(e) => handlePassengerFieldChange(i, "name", e.target.value)}
                                                    className="input input-bordered rounded-xl h-11 text-xs font-semibold bg-white dark:bg-slate-950 border-slate-200 dark:border-sky-950/60 focus:outline-none focus:border-[#2563EB]"
                                                />
                                            </div>
                                            <div className="flex grid grid-cols-2 gap-3">
                                                <div className="flex flex-col">
                                                    <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Age</label>
                                                    <input
                                                        type="number"
                                                        required
                                                        min="1"
                                                        placeholder="e.g. 28"
                                                        value={passenger.age}
                                                        onChange={(e) => handlePassengerFieldChange(i, "age", e.target.value)}
                                                        className="input input-bordered rounded-xl h-11 text-xs font-semibold bg-white dark:bg-slate-950 border-slate-200 dark:border-sky-950/60 focus:outline-none focus:border-[#2563EB]"
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Gender</label>
                                                    <select
                                                        value={passenger.gender}
                                                        onChange={(e) => handlePassengerFieldChange(i, "gender", e.target.value)}
                                                        className="select select-bordered rounded-xl h-11 text-xs font-semibold bg-white dark:bg-slate-950 border-slate-200 dark:border-sky-950/60 focus:outline-none focus:border-[#2563EB]"
                                                    >
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    placeholder="e.g. +91 9876543210"
                                                    value={passenger.phone}
                                                    onChange={(e) => handlePassengerFieldChange(i, "phone", e.target.value)}
                                                    className="input input-bordered rounded-xl h-11 text-xs font-semibold bg-white dark:bg-slate-950 border-slate-200 dark:border-sky-950/60 focus:outline-none focus:border-[#2563EB]"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Email Address</label>
                                                <input
                                                    type="email"
                                                    placeholder="e.g. john@example.com"
                                                    value={passenger.email}
                                                    onChange={(e) => handlePassengerFieldChange(i, "email", e.target.value)}
                                                    className="input input-bordered rounded-xl h-11 text-xs font-semibold bg-white dark:bg-slate-950 border-slate-200 dark:border-sky-950/60 focus:outline-none focus:border-[#2563EB]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Seat Map Selector */}
                    <div className="bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 rounded-3xl p-6 shadow-sm text-left">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-sky-950/40 mb-6">
                            <FiUsers className="text-secondary" size={18} />
                            <h3 className="font-bold text-base text-slate-800 dark:text-white">Cabin Seat Selection</h3>
                        </div>

                        <div className="flex flex-col items-center py-4 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-200/60 dark:border-sky-950/20">
                            {/* Floor Deck Selection */}
                            {totalFloors > 1 && (
                                <div className="flex gap-2.5 mb-6">
                                    {Array.from({ length: totalFloors }).map((_, fIdx) => {
                                        const floorNum = fIdx + 1;
                                        return (
                                            <button
                                                key={floorNum}
                                                type="button"
                                                onClick={() => setSelectedFloor(floorNum)}
                                                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all border ${
                                                    selectedFloor === floorNum
                                                        ? "bg-[#2563EB] border-transparent text-white shadow-md shadow-[#2563EB]/15"
                                                        : "bg-white dark:bg-slate-950 border-slate-200 dark:border-sky-950/60 text-slate-700 dark:text-slate-350 hover:bg-slate-100"
                                                }`}
                                            >
                                                Floor {floorNum}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Front Screen Directional Indicator */}
                            <div className="w-56 bg-primary/10 border border-primary/20 rounded-full py-1.5 text-center mb-10 text-[9px] uppercase font-bold tracking-widest text-[#2563EB] dark:text-[#00A8FF]">
                                ▲ Cruise Direction (Front Cabin) ▲
                            </div>

                            {/* Cabin Seat Grid layout */}
                            <div className="space-y-4 px-4 overflow-x-auto w-full flex flex-col items-center">
                                {floorRows.map((rowVal, rowIdx) => (
                                    <div key={rowVal} className="flex gap-4 items-center shrink-0">
                                        <span className="w-4 text-center font-bold text-xs text-slate-400">{rowVal}</span>
                                        <div className="flex gap-2.5">
                                            {/* Left side seats */}
                                            <div className="flex gap-2">
                                                {left.map((colVal, colIdx) => {
                                                    const seatId = `${rowVal}${colVal}`;
                                                    const seatIndexOnFloor = rowIdx * perRow + colIdx;
                                                    const exists = seatIndexOnFloor < seatsPerFloor;
                                                    if (!exists) return <div key={colVal} className="w-9 h-9"></div>;

                                                    const isBooked = preBookedSeats.includes(seatId);
                                                    const isSelected = selectedSeats.includes(seatId);

                                                    return (
                                                        <button
                                                            key={colVal}
                                                            type="button"
                                                            disabled={isBooked}
                                                            onClick={() => handleSeatClick(seatId)}
                                                            className={`w-9 h-9 rounded-xl font-bold text-xs transition-all flex items-center justify-center border ${
                                                                isBooked
                                                                    ? "bg-rose-100 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-500 cursor-not-allowed"
                                                                    : isSelected
                                                                    ? "bg-[#2563EB] dark:bg-[#00A8FF] border-0 text-white shadow-md scale-95"
                                                                    : "bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border-slate-200 dark:border-sky-950/60 text-slate-700 dark:text-slate-300"
                                                            }`}
                                                            title={isBooked ? `Seat ${seatId} (Occupied)` : `Seat ${seatId}`}
                                                        >
                                                            {colVal}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Aisle */}
                                            <div className="w-6 sm:w-10"></div>

                                            {/* Right side seats */}
                                            <div className="flex gap-2">
                                                {right.map((colVal, colIdx) => {
                                                    const seatId = `${rowVal}${colVal}`;
                                                    const seatIndexOnFloor = rowIdx * perRow + left.length + colIdx;
                                                    const exists = seatIndexOnFloor < seatsPerFloor;
                                                    if (!exists) return <div key={colVal} className="w-9 h-9"></div>;

                                                    const isBooked = preBookedSeats.includes(seatId);
                                                    const isSelected = selectedSeats.includes(seatId);

                                                    return (
                                                        <button
                                                            key={colVal}
                                                            type="button"
                                                            disabled={isBooked}
                                                            onClick={() => handleSeatClick(seatId)}
                                                            className={`w-9 h-9 rounded-xl font-bold text-xs transition-all flex items-center justify-center border ${
                                                                isBooked
                                                                    ? "bg-rose-100 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-500 cursor-not-allowed"
                                                                    : isSelected
                                                                    ? "bg-[#2563EB] dark:bg-[#00A8FF] border-0 text-white shadow-md scale-95"
                                                                    : "bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border-slate-200 dark:border-sky-950/60 text-slate-700 dark:text-slate-300"
                                                            }`}
                                                            title={isBooked ? `Seat ${seatId} (Occupied)` : `Seat ${seatId}`}
                                                        >
                                                            {colVal}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Legend */}
                            <div className="flex flex-wrap justify-center gap-6 mt-8 text-xs font-semibold text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-sky-950/20 pt-4 w-full px-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-sky-950/60 rounded"></div>
                                    <span>Available</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-[#2563EB] dark:bg-[#00A8FF] rounded"></div>
                                    <span>Selected</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-rose-100 border border-rose-200 dark:border-rose-950/40 rounded"></div>
                                    <span>Booked</span>
                                </div>
                                <div className="text-[#2563EB] dark:text-[#00A8FF] font-bold">
                                    Selected Seats: {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"} ({selectedSeats.length} / {passengerCount} Seats)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Summary column */}
                <div className="space-y-6 text-left">
                    {/* Voyage details info panel */}
                    <div className="bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 rounded-3xl p-6 shadow-sm hover:scale-[1.01] transition-transform duration-300">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-sky-950/40 mb-4">
                            <FiCompass className="text-primary" size={18} />
                            <h3 className="font-bold text-base text-slate-800 dark:text-white">Journey Summary</h3>
                        </div>

                        <div className="space-y-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
                            <div>
                                <span className="text-[10px] text-slate-400 uppercase block mb-1">Vessel</span>
                                <span className="font-bold text-slate-800 dark:text-white text-sm">🚢 {schedule.ferry?.name || "Transit Vessel"}</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-400 uppercase block mb-1">Route Path</span>
                                <span className="text-slate-800 dark:text-white text-sm font-bold">
                                    {schedule.route?.origin} → {schedule.route?.destination}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-[10px] text-slate-400 uppercase block mb-1">Departure</span>
                                    <span className="text-slate-800 dark:text-white font-bold">
                                        {formattedTime}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 uppercase block mb-1">Duration</span>
                                    <span className="text-slate-800 dark:text-white font-bold">
                                        {schedule.route?.duration || "20 minutes"}
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-[10px] text-slate-400 uppercase block mb-1">Passengers</span>
                                    <span className="text-slate-800 dark:text-white font-bold">
                                        {passengerCount} {passengerCount === 1 ? "Passenger" : "Passengers"}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 uppercase block mb-1">Seats</span>
                                    <span className="text-slate-800 dark:text-white font-mono font-bold">
                                        {selectedSeats.length > 0 ? selectedSeats.join(", ") : "TBD"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cost Summary panel */}
                    <div className="bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 rounded-3xl p-6 shadow-sm hover:scale-[1.01] transition-transform duration-300">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-sky-950/40 mb-4">
                            <FiCreditCard className="text-primary" size={18} />
                            <h3 className="font-bold text-base text-slate-800 dark:text-white">Billing Details</h3>
                        </div>

                        <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-350">
                            <div className="flex justify-between font-medium">
                                <span>
                                    Ticket Price (₹{farePerSeat.toFixed(2)} × {passengerCount})
                                </span>
                                <span className="font-bold text-slate-800 dark:text-white">₹{ticketSubtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-medium">
                                <span>Booking Fee</span>
                                <span className="font-bold text-slate-800 dark:text-white">₹{bookingFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-medium">
                                <span>GST (5%)</span>
                                <span className="font-bold text-slate-800 dark:text-white">₹{taxAmount.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-slate-100 dark:border-sky-950/20 my-2 pt-3 flex justify-between items-baseline">
                                <span className="font-bold text-slate-800 dark:text-white">Total Amount</span>
                                <span className="text-2xl font-bold text-[#2563EB] dark:text-[#00A8FF]">₹{finalTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleProceedToPayment}
                            className="btn w-full h-12 mt-6 rounded-xl border-0 text-white bg-gradient-to-r from-[#2563EB] to-[#00A8FF] hover:scale-[1.01] hover:shadow-lg transition-all duration-300 font-bold"
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
