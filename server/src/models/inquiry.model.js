const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true
        },
        subject: {
            type: String,
            required: [true, "Subject/Inquiry Type is required"],
            trim: true
        },
        message: {
            type: String,
            required: [true, "Message content is required"],
            trim: true
        },
        status: {
            type: String,
            enum: ["pending", "resolved"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Inquiry", inquirySchema);
