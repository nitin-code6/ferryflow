import { z } from "zod";

export const routeSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Route name must be at least 3 characters")
        .max(100, "Route name cannot exceed 100 characters"),

    origin: z
        .string()
        .trim()
        .min(3, "Origin must be at least 3 characters"),

    destination: z
        .string()
        .trim()
        .min(3, "Destination must be at least 3 characters"),

    distance: z.coerce
        .number()
        .positive("Distance must be a positive number"),

    estimatedDuration: z.coerce
        .number()
        .positive("Estimated duration must be a positive number"),

    status: z.enum(["active", "inactive"]),
});
