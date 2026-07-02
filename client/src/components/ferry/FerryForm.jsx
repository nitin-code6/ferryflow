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
            className="space-y-5 max-w-xl"
        >

            {/* Ferry Name */}

            <div>
                <label className="label">
                    <span className="label-text">
                        Ferry Name
                    </span>
                </label>

                <input
                    type="text"
                    className="input input-bordered w-full"
                    {...register("name")}
                />

                {errors.name && (
                    <p className="text-error text-sm mt-1">
                        {errors.name.message}
                    </p>
                )}
            </div>

            {/* Registration Number */}

            <div>
                <label className="label">
                    <span className="label-text">
                        Registration Number
                    </span>
                </label>

                <input
                    type="text"
                    className="input input-bordered w-full"
                    {...register("registrationNumber")}
                />

                {errors.registrationNumber && (
                    <p className="text-error text-sm mt-1">
                        {errors.registrationNumber.message}
                    </p>
                )}
            </div>

            {/* Capacity */}

            <div>
                <label className="label">
                    <span className="label-text">
                        Capacity
                    </span>
                </label>

                <input
                    type="number"
                    className="input input-bordered w-full"
                    {...register("capacity")}
                />

                {errors.capacity && (
                    <p className="text-error text-sm mt-1">
                        {errors.capacity.message}
                    </p>
                )}
            </div>

            {/* Status */}

            <div>
                <label className="label">
                    <span className="label-text">
                        Status
                    </span>
                </label>

                <select
                    className="select select-bordered w-full"
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
                    <p className="text-error text-sm mt-1">
                        {errors.status.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full"
            >
                {isLoading ? "Saving..." : submitButtonText}
            </button>

        </form>
    );
};

export default FerryForm;