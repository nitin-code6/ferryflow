const { z } = require("zod");

const createFerrySchema = z.object({

    name: z
        .string()
        .trim()
        .min(3, "Ferry name must be at least 3 characters")
        .max(100, "Ferry name cannot exceed 100 characters"),

    registrationNumber: z
        .string()
        .trim()
        .min(3, "Registration number is required")
        .max(30, "Registration number cannot exceed 30 characters"),

    capacity: z
        .number({
            required_error: "Capacity is required"
        })
        .int("Capacity must be an integer")
        .positive("Capacity must be greater than 0"),

    status: z.enum(
        ["available", "maintenance", "out_of_service"],
        {
            errorMap: () => ({
                message: "Invalid ferry status"
            })
        }
    )
});

const updateFerrySchema =
    createFerrySchema.partial();

module.exports = {
    createFerrySchema,
    updateFerrySchema
};