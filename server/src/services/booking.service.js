const mongoose = require("mongoose");

const Booking = require("../models/booking.model");
const Schedule = require("../models/schedule.model");


const createBookingService = async (userId, data) => {

    try {

        const {
            schedule,
            passengerDetails,
            seatsBooked,
            seatNumbers
        } = data;


        // 1. Check seat count matches

        if (seatsBooked !== seatNumbers.length) {

            return {
                success: false,
                statusCode: 400,
                message: "Seat count and seat numbers mismatch"
            };

        }


        // 2. Find schedule

        const existingSchedule = await Schedule
            .findById(schedule)
            .populate("ferry")
            .populate("route");


        if (!existingSchedule) {

            return {
                success: false,
                statusCode: 404,
                message: "Schedule not found"
            };

        }

        // Check ferry availability

        if (
            existingSchedule.ferry.status !== "available"
        ) {

            return {
                success: false,
                statusCode: 400,
                message: `Ferry is currently ${existingSchedule.ferry.status}`
            };

        }

        // 3. Check available seats

        if (existingSchedule.availableSeats < seatsBooked) {

            return {
                success: false,
                statusCode: 400,
                message: "Not enough seats available"
            };

        }



        // 4. Check selected seats already booked

        const alreadyBooked = seatNumbers.some(
            seat =>
                existingSchedule.bookedSeats.includes(seat)
        );


        if (alreadyBooked) {

            return {
                success: false,
                statusCode: 409,
                message: "Selected seats are already booked"
            };

        }



        // 5. Calculate amount

        const totalAmount =
            existingSchedule.fare * seatsBooked;



        // 6. Create pending booking

        const booking = await Booking.create({

            user: userId,

            schedule,

            passengerDetails,

            seatsBooked,

            seatNumbers,

            totalAmount,

            bookingStatus: "pending",

            paymentStatus: "pending"

        });



        return {

            success: true,
            statusCode: 201,

            message:
                "Booking created. Proceed with payment.",

            booking

        };


    }
    catch (error) {

        throw error;

    }

};


module.exports = {
    createBookingService
};
