const rateLimit = require("express-rate-limit");

// Error response handler configuration
const limitResponse = {
    success: false,
    message: "Too many requests. Please try again later."
};

// 1. Register Limit: 10 requests per hour per IP
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    message: limitResponse,
    standardHeaders: true,
    legacyHeaders: false,
    statusCode: 429
});

// 2. Login Limit: 5 failed attempts per 15 minutes per IP
// Note: Normally login limiter restricts requests on a given window
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: limitResponse,
    standardHeaders: true,
    legacyHeaders: false,
    statusCode: 429
});

// 5. Forgot Password Limit: 3 requests per 15 minutes per IP
const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3,
    message: limitResponse,
    standardHeaders: true,
    legacyHeaders: false,
    statusCode: 429
});

module.exports = {
    registerLimiter,
    loginLimiter,
    forgotPasswordLimiter
};
