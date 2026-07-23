const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
    {
        ferry: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ferry",
            required: [true, "Ferry is required"]
        },

        route: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Route",
            required: [true, "Route is required"]
        },

        departureTime: {
            type: Date,
            required: [true, "Departure time is required"]
        },

        arrivalTime: {
            type: Date,
            required: [true, "Arrival time is required"]
        },

        fare: {
            type: Number,
            required: [true, "Fare is required"],
            min: [0, "Fare cannot be negative"]
        },

        availableSeats: {
            type: Number,
            default: 0,
            min: [0, "Available seats cannot be negative"]
        },
        bookedSeats: [
            {
                type: String
            }
        ],
        status: {
            type: String,
            enum: [
                "scheduled",
                "boarding",
                "departed",
                "completed",
                "cancelled"
            ],
            default: "scheduled"
        }
    },
    {
        timestamps: true
    }
);

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;