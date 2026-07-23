
const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const validate = require("../middleware/validate");

const {
    createBooking
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


module.exports = router;