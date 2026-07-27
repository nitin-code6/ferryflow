import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import { searchSchedules } from "../../services/scheduleService";
import FerryCard from "../../components/passenger/FerryCard";
import { FiArrowLeft, FiFilter, FiSliders, FiClock, FiAlertCircle } from "react-icons/fi";
import { TableSkeleton } from "../../components/ui/LoadingSkeleton";
import EmptyState from "../../components/ui/EmptyState";
import SearchCard from "../../components/passenger/SearchCard";

const SearchResultsPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const fromVal = searchParams.get("from") || "";
    const toVal = searchParams.get("to") || "";
    const dateVal = searchParams.get("date") || "";
    const passengerCount = Number(searchParams.get("passengers")) || 1;

    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("departure"); // 'departure', 'price', 'duration'
    const [showSearchModal, setShowSearchModal] = useState(false);

    useEffect(() => {
        const fetchSchedules = async () => {
            setLoading(true);
            try {
                const response = await searchSchedules({
                    origin: fromVal,
                    destination: toVal,
                    date: dateVal
                });
                
                // The backend API returns { success, count, schedules }
                const allSchedules = response.data || response.schedules || [];
                setSchedules(allSchedules);
            } catch (error) {
                console.error("Failed to load schedules:", error);
            } finally {
                setLoading(false);
            }
        };

        if (fromVal && toVal) {
            fetchSchedules();
        } else {
            setLoading(false);
        }
    }, [fromVal, toVal, dateVal]);

    const handleBook = (schedule) => {
        const query = new URLSearchParams({
            scheduleId: schedule._id,
            passengers: passengerCount.toString(),
            date: dateVal
        }).toString();

        navigate(`/booking?${query}`);
    };

    const handleSearchSubmit = (newParams) => {
        const query = new URLSearchParams({
            from: newParams.fromTerminal,
            to: newParams.toTerminal,
            date: newParams.journeyDate,
            passengers: newParams.passengerCount.toString()
        }).toString();
        setShowSearchModal(false);
        navigate(`/search-results?${query}`);
    };

    // Sorting logic
    const sortedSchedules = [...schedules].sort((a, b) => {
        if (sortBy === "departure") {
            return new Date(a.departureTime) - new Date(b.departureTime);
        }
        if (sortBy === "price") {
            return a.fare - b.fare;
        }
        if (sortBy === "duration") {
            const durA = a.route?.estimatedDuration || 0;
            const durB = b.route?.estimatedDuration || 0;
            return durA - durB;
        }
        return 0;
    });

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-10 w-48 bg-base-300 animate-pulse rounded-lg"></div>
                <TableSkeleton rows={4} />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link
                        to="/dashboard"
                        className="btn btn-ghost btn-circle bg-base-100 hover:bg-base-200 border border-base-300/30 shadow-sm transition-all focus:ring-2 focus:ring-primary/20"
                        title="Back to dashboard"
                    >
                        <FiArrowLeft size={20} />
                    </Link>
                    <div>
                        <p className="text-xs text-base-content/60 font-medium">Passenger Terminal</p>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-base-content mt-0.5">
                            Search Results
                        </h1>
                    </div>
                </div>

                {/* active search params overview */}
                <div className="flex flex-wrap items-center gap-2 bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 p-3 rounded-2xl w-fit text-sm font-semibold shadow-sm">
                    <span className="text-base-content/75">{fromVal}</span>
                    <span className="text-primary font-bold">→</span>
                    <span className="text-base-content/75">{toVal}</span>
                    <span className="text-base-content/30">|</span>
                    <span className="text-base-content/75">
                        {dateVal ? new Date(dateVal).toLocaleDateString(undefined, { dateStyle: "medium" }) : "Any Date"}
                    </span>
                    <span className="text-base-content/30">|</span>
                    <span className="text-base-content/75">{passengerCount} {passengerCount === 1 ? "Passenger" : "Passengers"}</span>
                    <button
                        onClick={() => setShowSearchModal(true)}
                        className="btn btn-primary btn-xs rounded-lg text-[10px] ml-2 text-white border-0 bg-gradient-to-r from-blue-600 to-sky-500"
                    >
                        Change
                    </button>
                </div>
            </div>

            {/* Sorting controls panel */}
            {schedules.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/80 dark:bg-[#0F1D36]/80 backdrop-blur-md border border-slate-200/60 dark:border-sky-950/50 p-4 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-base-content/60">
                        <FiSliders className="text-primary" /> Sort Journeys
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSortBy("departure")}
                            className={`btn btn-sm rounded-xl font-bold transition-all ${sortBy === "departure" ? "btn-primary text-white border-0 bg-gradient-to-r from-blue-600 to-sky-500" : "btn-ghost"
                                }`}
                        >
                            Departure Time
                        </button>
                        <button
                            onClick={() => setSortBy("price")}
                            className={`btn btn-sm rounded-xl font-bold transition-all ${sortBy === "price" ? "btn-primary text-white border-0 bg-gradient-to-r from-blue-600 to-sky-500" : "btn-ghost"
                                }`}
                        >
                            Lowest Price
                        </button>
                        <button
                            onClick={() => setSortBy("duration")}
                            className={`btn btn-sm rounded-xl font-bold transition-all ${sortBy === "duration" ? "btn-primary text-white border-0 bg-gradient-to-r from-blue-600 to-sky-500" : "btn-ghost"
                                }`}
                        >
                            Duration
                        </button>
                    </div>
                </div>
            )}

            {/* Results Grid list */}
            <div className="space-y-4">
                {sortedSchedules.length === 0 ? (
                    <EmptyState
                        title="No Crossings Available"
                        description={`There are no ferry operations scheduled between ${fromVal} and ${toVal} on this date.`}
                        buttonText="Search Again"
                        onButtonClick={() => setShowSearchModal(true)}
                    />
                ) : (
                    sortedSchedules.map((schedule) => (
                        <FerryCard
                            key={schedule._id}
                            schedule={schedule}
                            passengerCount={passengerCount}
                            onBook={handleBook}
                        />
                    ))
                )}
            </div>

            {/* Change Search Modal overlay */}
            {showSearchModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
                    <div className="w-full max-w-4xl bg-white/95 dark:bg-[#0A1120]/95 backdrop-blur-md border border-slate-200 dark:border-sky-950/50 rounded-3xl p-6 pb-32 shadow-2xl relative text-slate-800 dark:text-slate-100 animate-scale-in">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-extrabold text-xl">Modify Search Criteria</h3>
                            <button
                                onClick={() => setShowSearchModal(false)}
                                className="btn btn-ghost btn-sm btn-circle"
                            >
                                ✕
                            </button>
                        </div>
                        <SearchCard
                            minimal={true}
                            key={`${fromVal}-${toVal}-${dateVal}-${passengerCount}`}
                            onSearch={handleSearchSubmit}
                            initialValues={{
                                fromTerminal: fromVal,
                                toTerminal: toVal,
                                journeyDate: dateVal,
                                passengerCount
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchResultsPage;
