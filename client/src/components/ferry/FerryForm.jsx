import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ferrySchema } from "../../Validations/ferryValidation";

const FerryForm = ({
    onSubmit,
    defaultValues,
    isLoading = false,
    submitButtonText = "Save Ferry",
}) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(ferrySchema),
        defaultValues: defaultValues || {
            name: "",
            registrationNumber: "",
            capacity: "",
            status: "available",
        },
    });

    return (

        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full"
        >

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Ferry Name */}

                <div className="flex flex-col">

                    <label className="text-xs font-semibold uppercase tracking-wide text-base-content/70 mb-2">
                        Ferry Name
                    </label>

                    <input
                        type="text"
                        placeholder="Enter ferry name"
                        className="
                        input
                        input-bordered
                        w-full
                        h-12
                        rounded-xl
                        "
                        {...register("name")}
                    />

                    {errors.name && (
                        <p className="text-error text-xs mt-1">
                            {errors.name.message}
                        </p>
                    )}

                </div>

                {/* Registration */}

                <div className="flex flex-col">

                    <label className="text-xs font-semibold uppercase tracking-wide text-base-content/70 mb-2">
                        Registration Number
                    </label>

                    <input
                        type="text"
                        placeholder="Enter registration number"
                        className="
                        input
                        input-bordered
                        w-full
                        h-12
                        rounded-xl
                        font-mono
                        "
                        {...register("registrationNumber")}
                    />

                    {errors.registrationNumber && (
                        <p className="text-error text-xs mt-1">
                            {errors.registrationNumber.message}
                        </p>
                    )}

                </div>

                {/* Capacity */}

                <div className="flex flex-col">

                    <label className="text-xs font-semibold uppercase tracking-wide text-base-content/70 mb-2">
                        Capacity
                    </label>

                    <input
                        type="number"
                        placeholder="Maximum passengers"
                        className="
                        input
                        input-bordered
                        w-full
                        h-12
                        rounded-xl
                        "
                        {...register("capacity")}
                    />

                    {errors.capacity && (
                        <p className="text-error text-xs mt-1">
                            {errors.capacity.message}
                        </p>
                    )}

                </div>

                {/* Status */}

                <div className="flex flex-col">

                    <label className="text-xs font-semibold uppercase tracking-wide text-base-content/70 mb-2">
                        Status
                    </label>

                    <select
                        className="
                        select
                        select-bordered
                        w-full
                        h-12
                        rounded-xl
                        "
                        {...register("status")}
                    >
                        <option value="available">
                            Available
                        </option>

                        <option value="maintenance">
                            Maintenance
                        </option>

                        <option value="out_of_service">
                            Out of Service
                        </option>

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
                className="
                btn
                w-full
                h-12
                mt-8
                rounded-xl
                border-0
                text-white
                bg-gradient-to-r
                from-[#2563EB]
                to-[#06B6D4]
                hover:opacity-95
                transition-all
                "
            >

                {
                    isLoading ? (
                        <span className="loading loading-spinner loading-sm" />
                    ) : (
                        submitButtonText
                    )
                }

            </button>

        </form>

    );
};

export default FerryForm;