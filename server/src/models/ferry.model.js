const mongoose = require("mongoose");

const ferrySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        registrationNumber: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },
        capacity: {
            type: Number,
            required: true,
            min: 1
        },
        status: {
            type: String,
            enum: ["available", "maintenance", "out_of_service"],
            default: "available"
        },
        seatConfiguration: {
            totalFloors: { type: Number, default: 1 },
            seatsPerFloor: { type: Number, default: 0 },
            leftSideSeats: { type: Number, default: 0 },
            rightSideSeats: { type: Number, default: 0 }
        }
    },
    {
        timestamps: true
    }
);

ferrySchema.pre("save", function (next) {
    if (this.isModified("capacity") || !this.seatConfiguration?.seatsPerFloor) {
        try {
            const { seatConfiguration } = require("../utils/seatLayoutGenerator").generateSeatLayout(this.capacity);
            this.seatConfiguration = seatConfiguration;
        } catch (err) {
            return next(err);
        }
    }
    next();
});

module.exports = mongoose.model("Ferry", ferrySchema);