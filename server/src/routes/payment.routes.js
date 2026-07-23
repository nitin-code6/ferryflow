const express = require("express");

const router = express.Router();


const authMiddleware = require("../middleware/auth.middleware");
const validate = require("../middleware/validate");
const { verifyPaymentSchema } = require("../validators/booking.validator");
const {
    createPaymentOrder, verifyPayment
} = require("../controllers/payment.controller");



// Create Razorpay Order

router.post(
    "/create-order",
    authMiddleware,
    createPaymentOrder
);

router.post(
    "/verify",
    authMiddleware,
    validate(verifyPaymentSchema),
    verifyPayment
);




module.exports = router;