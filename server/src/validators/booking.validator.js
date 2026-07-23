const { z } = require("zod");


// MongoDB ObjectId validation

const objectIdSchema = z
    .string()
    .regex(
        /^[0-9a-fA-F]{24}$/,
        "Invalid MongoDB ObjectId"
    );


// Passenger validation

const passengerSchema = z.object({

    name: z
        .string()
        .min(
            3,
            "Passenger name must be at least 3 characters"
        )
        .trim(),


    age: z
        .number({
            required_error: "Age is required"
        })
        .int()
        .min(
            1,
            "Age must be greater than 0"
        ),


    gender: z.enum([
        "male",
        "female",
        "other"
    ])

});


// Create Booking Validator

const createBookingSchema = z.object({

    schedule: objectIdSchema,


    passengerDetails: z
        .array(passengerSchema)
        .min(
            1,
            "At least one passenger is required"
        ),


    seatsBooked: z
        .number({
            required_error: "Seat count is required"
        })
        .int()
        .min(
            1,
            "At least one seat is required"
        ),


    seatNumbers: z
        .array(
            z.string().trim()
        )
        .min(
            1,
            "At least one seat number is required"
        )

});


// Payment Verification Validator

const verifyPaymentSchema = z.object({

    bookingId: objectIdSchema,

    razorpay_order_id: z.string(),

    razorpay_payment_id: z.string(),

    razorpay_signature: z.string()

});


// Cancel Booking Validator

const cancelBookingSchema = z.object({

    reason: z
        .string()
        .min(
            5,
            "Cancellation reason must be at least 5 characters"
        )
        .optional()

});


module.exports = {

    createBookingSchema,
    verifyPaymentSchema,
    cancelBookingSchema

};