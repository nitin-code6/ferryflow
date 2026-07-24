
const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const validate = require("../middleware/validate");

const {
    createBooking,
    getUserBookings,
    getAllBookings,
    cancelBooking
} = require("../controllers/booking.controller");

const {
    createBookingSchema
} = require("../validators/booking.validator");


// Create Booking
router.post(
    "/",
    authMiddleware,
    validate(createBookingSchema),
    createBooking
);

// Get Passenger Bookings
router.get(
    "/user",
    authMiddleware,
    getUserBookings
);

// Get All Bookings (Admin)
router.get(
    "/",
    authMiddleware,
    authorizeRoles("admin"),
    getAllBookings
);

// Cancel Booking
router.patch(
    "/:id/cancel",
    authMiddleware,
    cancelBooking
);


module.exports = router;