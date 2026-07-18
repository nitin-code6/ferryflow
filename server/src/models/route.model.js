const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        origin: {
            type: String,
            required: true,
            trim: true
        },
        destination: {
            type: String,
            required: true,
            trim: true
        },
        distance: {
            type: Number,
            required: true,
            min: 0
        },
        estimatedDuration: {
            type: Number,
            required: true,
            min: 1
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Route", routeSchema);
