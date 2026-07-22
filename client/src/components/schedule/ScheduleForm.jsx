import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { scheduleSchema } from "../../Validations/scheduleValidation";
import { getAllFerries } from "../../services/ferryService";
import { getAllRoutes } from "../../services/routeService";

const formatDateTimeLocal = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const pad = (num) => String(num).padStart(2, "0");
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const min = pad(date.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
};

const ScheduleForm = ({
    onSubmit,
    defaultValues,
    isLoading = false,
    submitButtonText = "Save Schedule",
}) => {
    const [ferries, setFerries] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [loadingDropdowns, setLoadingDropdowns] = useState(true);

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [ferriesRes, routesRes] = await Promise.all([
                    getAllFerries(),
                    getAllRoutes(),
                ]);
                // Filter ferries to only show available ones for new schedules, unless editing
                setFerries(ferriesRes.ferries || []);
                setRoutes(routesRes.routes || []);
            } catch (error) {
                toast.error("Failed to load routes or ferries.");
            } finally {
                setLoadingDropdowns(false);
            }
        };

        fetchDropdownData();
    }, []);

    const preppedDefaultValues = {
        ferry: defaultValues?.ferry?._id || defaultValues?.ferry || "",
        route: defaultValues?.route?._id || defaultValues?.route || "",
        departureTime: formatDateTimeLocal(defaultValues?.departureTime),
        arrivalTime: formatDateTimeLocal(defaultValues?.arrivalTime),
        fare: defaultValues?.fare !== undefined ? defaultValues.fare : "",
        status: defaultValues?.status || "scheduled",
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(scheduleSchema),
        defaultValues: preppedDefaultValues,
    });

    if (loadingDropdowns) {
        return (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <span className="loading loading-spinner loading-md text-primary"></span>
                <p className="text-xs text-base-content/60 font-semibold uppercase tracking-wider">
                    Loading ferries and routes...
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Ferry Selection */}
                <div className="flex flex-col">
                    <label className="text-xs font-semibold uppercase tracking-wide text-base-content/70 mb-2">
                        Ferry Vessel
                    </label>
                    <select
                        className="select select-bordered w-full h-12 rounded-xl"
                        {...register("ferry")}
                    >
                        <option value="">Select a ferry...</option>
                        {ferries.map((f) => (
                            <option key={f._id} value={f._id}>
                                {f.name} ({f.registrationNumber}) - Cap: {f.capacity}
                            </option>
                        ))}
                    </select>
                    {errors.ferry && (
                        <p className="text-error text-xs mt-1">
                            {errors.ferry.message}
                        </p>
                    )}
                </div>

                {/* Route Selection */}
                <div className="flex flex-col">
                    <label className="text-xs font-semibold uppercase tracking-wide text-base-content/70 mb-2">
                        Route
                    </label>
                    <select
                        className="select select-bordered w-full h-12 rounded-xl"
                        {...register("route")}
                    >
                        <option value="">Select a route...</option>
                        {routes.map((r) => (
                            <option key={r._id} value={r._id}>
                                {r.name} ({r.origin} → {r.destination})
                            </option>
                        ))}
                    </select>
                    {errors.route && (
                        <p className="text-error text-xs mt-1">
                            {errors.route.message}
                        </p>
                    )}
                </div>

                {/* Departure Time */}
                <div className="flex flex-col">
                    <label className="text-xs font-semibold uppercase tracking-wide text-base-content/70 mb-2">
                        Departure Time
                    </label>
                    <input
                        type="datetime-local"
                        className="input input-bordered w-full h-12 rounded-xl"
                        {...register("departureTime")}
                    />
                    {errors.departureTime && (
                        <p className="text-error text-xs mt-1">
                            {errors.departureTime.message}
                        </p>
                    )}
                </div>

                {/* Arrival Time */}
                <div className="flex flex-col">
                    <label className="text-xs font-semibold uppercase tracking-wide text-base-content/70 mb-2">
                        Arrival Time
                    </label>
                    <input
                        type="datetime-local"
                        className="input input-bordered w-full h-12 rounded-xl"
                        {...register("arrivalTime")}
                    />
                    {errors.arrivalTime && (
                        <p className="text-error text-xs mt-1">
                            {errors.arrivalTime.message}
                        </p>
                    )}
                </div>

                {/* Fare */}
                <div className="flex flex-col">
                    <label className="text-xs font-semibold uppercase tracking-wide text-base-content/70 mb-2">
                        Fare / Ticket Price ($)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 15.50"
                        className="input input-bordered w-full h-12 rounded-xl"
                        {...register("fare")}
                    />
                    {errors.fare && (
                        <p className="text-error text-xs mt-1">
                            {errors.fare.message}
                        </p>
                    )}
                </div>

                {/* Status */}
                <div className="flex flex-col">
                    <label className="text-xs font-semibold uppercase tracking-wide text-base-content/70 mb-2">
                        Status
                    </label>
                    <select
                        className="select select-bordered w-full h-12 rounded-xl"
                        {...register("status")}
                    >
                        <option value="scheduled">Scheduled</option>
                        <option value="boarding">Boarding</option>
                        <option value="departed">Departed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    {errors.status && (
                        <p className="text-error text-xs mt-1">
                            {errors.status.message}
                        </p>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="btn w-full h-12 mt-8 rounded-xl border-0 text-white bg-gradient-to-r from-[#2563EB] to-[#06B6D4] hover:opacity-95 transition-all"
            >
                {isLoading ? (
                    <span className="loading loading-spinner loading-sm" />
                ) : (
                    submitButtonText
                )}
            </button>
        </form>
    );
};

export default ScheduleForm;
