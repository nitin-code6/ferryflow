const rateLimit = require("express-rate-limit");

// Error response handler configuration
const limitResponse = {
    success: false,
    message: "Too many requests. Please try again later."
};

const bypassInDev = (req, res, next) => next();

// 1. Register Limit: 10 requests per hour per IP
const registerLimiter = process.env.NODE_ENV === "production" ? rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    message: limitResponse,
    standardHeaders: true,
    legacyHeaders: false,
    statusCode: 429
}) : bypassInDev;

// 2. Login Limit: 5 failed attempts per 15 minutes per IP
const loginLimiter = process.env.NODE_ENV === "production" ? rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: limitResponse,
    standardHeaders: true,
    legacyHeaders: false,
    statusCode: 429
}) : bypassInDev;

// 5. Forgot Password Limit: 3 requests per 15 minutes per IP
const forgotPasswordLimiter = process.env.NODE_ENV === "production" ? rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3,
    message: limitResponse,
    standardHeaders: true,
    legacyHeaders: false,
    statusCode: 429
}) : bypassInDev;

module.exports = {
    registerLimiter,
    loginLimiter,
    forgotPasswordLimiter
};
