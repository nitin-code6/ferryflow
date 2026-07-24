const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        message: {
            type: String,
            required: true,
            trim: true
        },
        type: {
            type: String,
            enum: ["info", "warning", "critical"],
            default: "info"
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "low"
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active"
        },
        ferry: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ferry"
        },
        route: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Route"
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Alert", alertSchema);
