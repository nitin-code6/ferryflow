const { z } = require("zod");

const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

const createScheduleSchema = z.object({

    ferry: objectIdSchema,

    route: objectIdSchema,

    departureTime: z.coerce.date({
        required_error: "Departure time is required"
    }),

    arrivalTime: z.coerce.date({
        required_error: "Arrival time is required"
    }),

    fare: z
        .number({
            required_error: "Fare is required"
        })
        .nonnegative("Fare cannot be negative"),

    status: z
        .enum([
            "scheduled",
            "boarding",
            "departed",
            "completed",
            "cancelled"
        ])
        .optional()

});

const updateScheduleSchema = createScheduleSchema.partial();

module.exports = {
    createScheduleSchema,
    updateScheduleSchema
};