const rateLimit = require("express-rate-limit");

const limitResponse = {
    success: false,
    message: "Too many requests. Please try again later."
};

const bypassInDev = (req, res, next) => next();

// 3. Verify OTP Limit: 5 attempts per 10 minutes per IP
const verifyOtpLimiter = process.env.NODE_ENV === "production" ? rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5,
    message: limitResponse,
    standardHeaders: true,
    legacyHeaders: false,
    statusCode: 429
}) : bypassInDev;

// 4. Resend OTP Limit: 3 requests per 5 minutes per IP
const resendOtpLimiter = process.env.NODE_ENV === "production" ? rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3,
    message: limitResponse,
    standardHeaders: true,
    legacyHeaders: false,
    statusCode: 429
}) : bypassInDev;

module.exports = {
    verifyOtpLimiter,
    resendOtpLimiter
};
