const { z } = require("zod");


const createRouteSchema = z.object({

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

    distance: z
        .number()
        .positive("Distance must be positive"),

    estimatedDuration: z
        .number()
        .positive("Estimated duration must be positive"),

    status: z
        .enum(["active", "inactive"])
        .default("active")

});


const updateRouteSchema = z.object({

    name: z
        .string()
        .trim()
        .min(3)
        .max(100)
        .optional(),

    origin: z
        .string()
        .trim()
        .min(3)
        .optional(),

    destination: z
        .string()
        .trim()
        .min(3)
        .optional(),

    distance: z
        .number()
        .positive()
        .optional(),

    estimatedDuration: z
        .number()
        .positive()
        .optional(),

    status: z
        .enum(["active", "inactive"])
        .optional()

});


module.exports = {
    createRouteSchema,
    updateRouteSchema
};