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


        // 1. Seat count must match seat numbers array
        if (seatsBooked !== seatNumbers.length) {
            return {
                success: false,
                statusCode: 400,
                message: "Seat count and seat numbers mismatch"
            };
        }


        // 2. Load schedule with populated ferry + route
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

        if (existingSchedule.status === "cancelled") {
            return {
                success: false,
                statusCode: 400,
                message: "Cannot book a cancelled schedule"
            };
        }

        // 3. Ferry must be available
        if (existingSchedule.ferry.status !== "available") {
            return {
                success: false,
                statusCode: 400,
                message: `Ferry is currently ${existingSchedule.ferry.status}`
            };
        }

        // 4. Enough seats on the schedule
        if (existingSchedule.availableSeats < seatsBooked) {
            return {
                success: false,
                statusCode: 400,
                message: "Not enough seats available"
            };
        }

        // 5. Dynamic seat conflict check — query confirmed/pending_payment bookings
        const activeBookings = await Booking.find({
            schedule,
            bookingStatus: { $nin: ["cancelled"] }
        });
        const occupiedSeats = activeBookings.flatMap(b => b.seatNumbers || []);

        const alreadyBooked = seatNumbers.some(seat => occupiedSeats.includes(seat));
        if (alreadyBooked) {
            return {
                success: false,
                statusCode: 409,
                message: "One or more selected seats are already booked"
            };
        }

        // 6. Calculate total amount
        const totalAmount = existingSchedule.fare * seatsBooked;

        // 7. Create booking — status starts at pending_payment until Razorpay confirms
        const booking = await Booking.create({
            user: userId,
            schedule,
            passengerDetails,
            seatsBooked,
            seatNumbers,
            totalAmount,
            bookingStatus: "pending_payment",
            paymentStatus: "pending"
        });

        return {
            success: true,
            statusCode: 201,
            message: "Booking created. Proceed with payment.",
            booking
        };

    } catch (error) {
        throw error;
    }

};

const getBookingsByUserService = async (userId) => {
    try {
        const bookings = await Booking.find({ user: userId })
            .populate({
                path: "schedule",
                populate: [
                    { path: "ferry" },
                    { path: "route" }
                ]
            })
            .sort({ createdAt: -1 });

        return {
            success: true,
            statusCode: 200,
            message: "Bookings retrieved successfully",
            bookings
        };
    } catch (error) {
        throw error;
    }
};

const getAllBookingsService = async () => {
    try {
        const bookings = await Booking.find()
            .populate("user")
            .populate({
                path: "schedule",
                populate: [
                    { path: "ferry" },
                    { path: "route" }
                ]
            })
            .sort({ createdAt: -1 });

        return {
            success: true,
            statusCode: 200,
            message: "All bookings retrieved successfully",
            bookings
        };
    } catch (error) {
        throw error;
    }
};

const cancelBookingService = async (bookingId, userId, role) => {
    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return {
                success: false,
                statusCode: 404,
                message: "Booking not found"
            };
        }

        if (role !== "admin" && booking.user.toString() !== userId.toString()) {
            return {
                success: false,
                statusCode: 403,
                message: "Unauthorized to cancel this booking"
            };
        }

        if (booking.bookingStatus === "cancelled") {
            return {
                success: false,
                statusCode: 400,
                message: "Booking is already cancelled"
            };
        }

        booking.bookingStatus = "cancelled";
        booking.cancelledAt = new Date();
        await booking.save();

        // Release seats back to the schedule
        const schedule = await Schedule.findById(booking.schedule);
        if (schedule) {
            schedule.availableSeats += booking.seatsBooked;
            schedule.bookedSeats = schedule.bookedSeats.filter(
                (seat) => !booking.seatNumbers.includes(seat)
            );
            await schedule.save();
        }

        return {
            success: true,
            statusCode: 200,
            message: "Booking cancelled successfully",
            booking
        };
    } catch (error) {
        throw error;
    }
};


const getBookingDetailsService = async (bookingId, userId, role) => {
    try {
        const booking = await Booking.findById(bookingId).populate({
            path: "schedule",
            populate: [
                { path: "ferry" },
                { path: "route" }
            ]
        });

        if (!booking) {
            return {
                success: false,
                statusCode: 404,
                message: "Booking not found"
            };
        }

        if (role !== "admin" && booking.user.toString() !== userId.toString()) {
            return {
                success: false,
                statusCode: 403,
                message: "Unauthorized to access this booking"
            };
        }

        return {
            success: true,
            statusCode: 200,
            message: "Booking details retrieved successfully",
            booking
        };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createBookingService,
    getBookingsByUserService,
    getAllBookingsService,
    cancelBookingService,
    getBookingDetailsService
};
