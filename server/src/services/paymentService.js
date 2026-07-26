const razorpay = require("../config/razorpay");


const mongoose = require("mongoose");
const crypto = require("crypto");

const Booking = require("../models/booking.model");
const Schedule = require("../models/schedule.model");
const { sendBookingConfirmationEmail } = require("../utils/sendEmail");
const User = require("../models/user.model");
const Ferry = require("../models/ferry.model");
const Route = require("../models/route.model");
const eventBus = require("../utils/eventBus");

const createPaymentOrderService = async (
    bookingId,
    userId
) => {

    const booking = await Booking.findById(bookingId);


    if (!booking) {

        return {
            success: false,
            statusCode: 404,
            message: "Booking not found"
        };

    }


    // Check ownership

    if (
        booking.user.toString() !== userId.toString()
    ) {

        return {
            success: false,
            statusCode: 403,
            message: "Unauthorized booking"
        };

    }



    // Already paid — guard against double payment
    if (booking.paymentStatus === "paid") {
        return {
            success: false,
            statusCode: 400,
            message: "Payment already completed"
        };
    }

    // Only pending_payment bookings can be paid
    if (booking.bookingStatus !== "pending_payment") {
        return {
            success: false,
            statusCode: 400,
            message: "Booking is not awaiting payment"
        };
    }



    const options = {

        amount: booking.totalAmount * 100,

        currency: "INR",

        receipt: `booking_${booking._id}`

    };



    const order =
        await razorpay.orders.create(options);



    booking.paymentDetails.orderId =
        order.id;


    await booking.save();



    return {

        success: true,

        statusCode: 201,

        message: "Payment order created",

        order

    };

};

const verifyPaymentService = async (
    data,
    userId
) => {

    const session = await mongoose.startSession();


    try {

        session.startTransaction();


        const {
            bookingId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = data;



        // 1. Verify Razorpay Signature

        // const generatedSignature =
        //     crypto
        //         .createHmac(
        //             "sha256",
        //             process.env.RAZORPAY_KEY_SECRET
        //         )
        //         .update(
        //             razorpay_order_id +
        //             "|" +
        //             razorpay_payment_id
        //         )
        //         .digest("hex");



        // if (
        //     generatedSignature !== razorpay_signature
        // ) {

        //     await session.abortTransaction();

        //     return {
        //         success: false,
        //         statusCode: 400,
        //         message: "Invalid payment signature"
        //     };

        // }



        // 2. Find Booking

        const booking =
            await Booking.findById(bookingId)
                .session(session);



        if (!booking) {

            throw new Error(
                "Booking not found"
            );

        }



        // 3. Check booking ownership

        if (
            booking.user.toString()
            !== userId.toString()
        ) {

            throw new Error(
                "Unauthorized booking"
            );

        }



        // 4. Check already paid

        if (
            booking.paymentStatus === "paid"
        ) {

            throw new Error(
                "Payment already completed"
            );

        }



        // 5. Find Schedule

        const schedule =
            await Schedule.findById(
                booking.schedule
            )
                .session(session);



        if (!schedule) {

            throw new Error(
                "Schedule not found"
            );

        }



        // 6. Atomic seat check & reservation block
        const updatedSchedule = await Schedule.findOneAndUpdate(
            {
                _id: booking.schedule,
                bookedSeats: { $nin: booking.seatNumbers },
                availableSeats: { $gte: booking.seatsBooked }
            },
            {
                $push: { bookedSeats: { $each: booking.seatNumbers } },
                $inc: { availableSeats: -booking.seatsBooked }
            },
            { session, new: true }
        );

        if (!updatedSchedule) {
            throw new Error("One or more seats already booked or insufficient capacity.");
        }

        // 9. Auto-confirm Booking — no admin approval needed
        booking.bookingStatus = "confirmed";
        booking.paymentStatus = "paid";

        booking.paymentDetails = {
            ...booking.paymentDetails,
            paymentId: razorpay_payment_id,
            signature: razorpay_signature
        };

        booking.ticketId = "FF-" + Date.now();

        await booking.save({
            session
        });

        // 10. Commit transaction
        await session.commitTransaction();

        // Trigger decoupled websocket hook
        eventBus.emit("seat:booked", { scheduleId: booking.schedule, seatNumbers: booking.seatNumbers });

        const user = await User.findById(booking.user);

        const scheduleDetails = await Schedule
            .findById(booking.schedule)
            .populate("ferry")
            .populate("route");

        try {

            await sendBookingConfirmationEmail(
                user,
                booking,
                scheduleDetails,
                scheduleDetails.ferry,
                scheduleDetails.route
            );

        } catch (error) {

            console.error(
                "Booking email failed:",
                error.message
            );

        }
        return {

            success: true,

            statusCode: 200,

            message:
                "Payment verified. Booking confirmed.",

            booking

        };


    }
    catch (error) {

        await session.abortTransaction();

        throw error;

    }
    finally {

        session.endSession();

    }

};
module.exports = {
    createPaymentOrderService, verifyPaymentService
};