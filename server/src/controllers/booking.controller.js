const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const {
    createBookingService,
    verifyPaymentService,
    getBookingsByUserService,
    getAllBookingsService,
    cancelBookingService,
    getBookingDetailsService
} = require("../services/booking.service");

const createBooking = asyncHandler(async (req, res) => {
    const result = await createBookingService(req.user._id, req.body);
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, result.booking, result.message)
    );
});

const verifyPayment = asyncHandler(async (req, res) => {
    const result = await verifyPaymentService(req.body, req.user._id);
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, result.data, result.message)
    );
});

const getUserBookings = asyncHandler(async (req, res) => {
    const result = await getBookingsByUserService(req.user._id);
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, result.bookings, result.message)
    );
});

const getBookingDetails = asyncHandler(async (req, res) => {
    const result = await getBookingDetailsService(req.params.id, req.user._id, req.user.role);
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, result.booking, result.message)
    );
});

const getAllBookings = asyncHandler(async (req, res) => {
    const result = await getAllBookingsService();
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, result.bookings, result.message)
    );
});

const cancelBooking = asyncHandler(async (req, res) => {
    const result = await cancelBookingService(req.params.id, req.user._id, req.user.role);
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, result.booking, result.message)
    );
});

module.exports = {
    createBooking,
    verifyPayment,
    getUserBookings,
    getBookingDetails,
    getAllBookings,
    cancelBooking
};