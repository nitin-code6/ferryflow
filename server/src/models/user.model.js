const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
        },

        role: {
            type: String,
            enum: ["citizen", "tourist", "staff", "admin"],
            default: "citizen",
        },

        provider: {
            type: String,
            enum: ["local", "google"],
            default: "local",
        },
        googleId: {
            type: String,
            default: null,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        accountStatus: {
            type: String,
            enum: ["active", "blocked", "suspended"],
            default: "active",
        },

        phoneNumber: {
            type: String,
        },

        profilePicture: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);


// name
// email
// password
// role
// provider
// isVerified
// accountStatus