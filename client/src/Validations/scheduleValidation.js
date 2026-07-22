import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const scheduleSchema = z.object({
    ferry: z
        .string()
        .regex(objectIdRegex, "Please select a valid ferry"),

    route: z
        .string()
        .regex(objectIdRegex, "Please select a valid route"),

    departureTime: z.coerce
        .date({ required_error: "Departure time is required" }),

    arrivalTime: z.coerce
        .date({ required_error: "Arrival time is required" }),

    fare: z.coerce
        .number({ required_error: "Fare is required" })
        .nonnegative("Fare cannot be negative"),

    status: z.enum([
        "scheduled",
        "boarding",
        "departed",
        "completed",
        "cancelled"
    ]).default("scheduled"),
}).refine(
    (data) => data.arrivalTime > data.departureTime,
    {
        message: "Arrival time must be after departure time",
        path: ["arrivalTime"],
    }
);
