import { z } from "zod";

export const ferrySchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Ferry name must be at least 3 characters")
        .max(50, "Ferry name cannot exceed 50 characters"),

    registrationNumber: z
        .string()
        .trim()
        .min(3, "Registration number is required")
        .max(20, "Registration number cannot exceed 20 characters")
        .transform((value) => value.toUpperCase()),

    capacity: z.coerce
        .number()
        .min(1, "Capacity must be at least 1"),

    status: z.enum([
        "available",
        "maintenance",
        "out_of_service",
    ]),
});