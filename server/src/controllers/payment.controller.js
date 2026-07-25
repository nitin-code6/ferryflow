const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const { createPaymentOrderService, verifyPaymentService } = require('../services/paymentService');

const createPaymentOrder = asyncHandler(async (req, res) => {
    const { bookingId } = req.body;
    const result = await createPaymentOrderService(bookingId, req.user._id);
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, result.order || result.data, result.message)
    );
});

const verifyPayment = asyncHandler(async (req, res) => {
    const result = await verifyPaymentService(req.body, req.user._id);
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, result.booking || result.data, result.message)
    );
});

module.exports = {
    createPaymentOrder,
    verifyPayment
};