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



    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Ferry", ferrySchema);