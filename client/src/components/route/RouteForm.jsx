import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { routeSchema } from "../../Validations/routeValidation";

const RouteForm = ({
    onSubmit,
    defaultValues,
    isLoading = false,
    submitButtonText = "Save Route",
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(routeSchema),
        defaultValues: defaultValues || {
            name: "",
            origin: "",
            destination: "",
            distance: "",
            estimatedDuration: "",
            status: "active",
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Route Name */}
                <div className="flex flex-col">
                    <label className="text-xs font-semibold uppercase tracking-wide text-base-content/70 mb-2">
                        Route Name
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Seattle to Bainbridge"
                        className="input input-bordered w-full h-12 rounded-xl"
                        {...register("name")}
                    />
                    {errors.name && (
                        <p className="text-error text-xs mt-1">
                            {errors.name.message}
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
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    {errors.status && (
                        <p className="text-error text-xs mt-1">
                            {errors.status.message}
                        </p>
                    )}
                </div>

                {/* Origin */}
                <div className="flex flex-col">
                    <label className="text-xs font-semibold uppercase tracking-wide text-base-content/70 mb-2">
                        Origin Port
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Seattle Port"
                        className="input input-bordered w-full h-12 rounded-xl"
                        {...register("origin")}
                    />
                    {errors.origin && (
                        <p className="text-error text-xs mt-1">
                            {errors.origin.message}
                        </p>
                    )}
                </div>

                {/* Destination */}
                <div className="flex flex-col">
                    <label className="text-xs font-semibold uppercase tracking-wide text-base-content/70 mb-2">
                        Destination Port
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Bainbridge Island Port"
                        className="input input-bordered w-full h-12 rounded-xl"
                        {...register("destination")}
                    />
                    {errors.destination && (
                        <p className="text-error text-xs mt-1">
                            {errors.destination.message}
                        </p>
                    )}
                </div>

                {/* Distance */}
                <div className="flex flex-col">
                    <label className="text-xs font-semibold uppercase tracking-wide text-base-content/70 mb-2">
                        Distance (Nautical Miles / Km)
                    </label>
                    <input
                        type="number"
                        step="any"
                        placeholder="e.g. 8.6"
                        className="input input-bordered w-full h-12 rounded-xl"
                        {...register("distance")}
                    />
                    {errors.distance && (
                        <p className="text-error text-xs mt-1">
                            {errors.distance.message}
                        </p>
                    )}
                </div>

                {/* Estimated Duration */}
                <div className="flex flex-col">
                    <label className="text-xs font-semibold uppercase tracking-wide text-base-content/70 mb-2">
                        Estimated Duration (Minutes)
                    </label>
                    <input
                        type="number"
                        placeholder="e.g. 35"
                        className="input input-bordered w-full h-12 rounded-xl"
                        {...register("estimatedDuration")}
                    />
                    {errors.estimatedDuration && (
                        <p className="text-error text-xs mt-1">
                            {errors.estimatedDuration.message}
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

export default RouteForm;
