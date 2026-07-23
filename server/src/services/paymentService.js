const razorpay = require("../config/razorpay");

const Booking = require("../models/booking.model");


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



    // Already paid

    if (
        booking.paymentStatus === "paid"
    ) {

        return {
            success: false,
            statusCode: 400,
            message: "Payment already completed"
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


module.exports = {
    createPaymentOrderService
};