const mongoose = require("mongoose");


const bookingSchema = new mongoose.Schema(
    {

        // User who made the booking
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        // Ferry schedule selected
        schedule: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Schedule",
            required: true
        },


        // Passenger information
        passengerDetails: [
            {
                name: {
                    type: String,
                    required: true,
                    trim: true
                },

                age: {
                    type: Number,
                    min: 1
                },

                gender: {
                    type: String,
                    enum: [
                        "male",
                        "female",
                        "other"
                    ]
                },
                phone: {
                    type: String,
                    trim: true
                },
                email: {
                    type: String,
                    trim: true
                }
            }
        ],


        // Number of seats booked
        seatsBooked: {
            type: Number,
            required: true,
            min: 1
        },


        // Selected seat numbers
        seatNumbers: [
            {
                type: String,
                required: true
            }
        ],


        // Total booking amount
        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },


        // Booking lifecycle — driven by payment, no admin approval needed
        bookingStatus: {
            type: String,
            enum: [
                "pending_payment",   // Created, waiting for Razorpay payment
                "confirmed",         // Payment verified — auto-confirmed
                "cancelled",         // Cancelled by passenger or admin
                "completed"          // Journey completed
            ],
            default: "pending_payment"
        },


        // Payment lifecycle
        paymentStatus: {
            type: String,
            enum: [
                "pending",
                "paid",
                "failed",
                "refunded"
            ],
            default: "pending"
        },


        // Razorpay/payment information
        paymentDetails: {

            orderId: {
                type: String
            },

            paymentId: {
                type: String
            },

            signature: {
                type: String
            }

        },


        // Public ticket reference
        ticketId: {
            type: String,
            unique: true,
            sparse: true
        },


        // Cancellation information
        cancellationReason: {
            type: String
        },


        cancelledAt: {
            type: Date
        }

    },
    {
        timestamps: true
    }
);

bookingSchema.index({ user: 1 });
bookingSchema.index({ schedule: 1 });
bookingSchema.index({ schedule: 1, bookingStatus: 1 });

const Booking = mongoose.model(
    "Booking",
    bookingSchema
);


module.exports = Booking;