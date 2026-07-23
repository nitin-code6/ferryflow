const express = require("express");

const router = express.Router();


const authMiddleware = require("../middleware/auth.middleware");


const {
    createPaymentOrder
} = require("../controllers/payment.controller");



// Create Razorpay Order

router.post(
    "/create-order",
    authMiddleware,
    createPaymentOrder
);



module.exports = router;