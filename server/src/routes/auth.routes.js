const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const validate = require("../middleware/validate");
const { registerLimiter, loginLimiter, forgotPasswordLimiter } = require("../middleware/rateLimiter/authLimiter");
const { verifyOtpLimiter, resendOtpLimiter } = require("../middleware/rateLimiter/otpLimiter");

const {
    registerSchema,
    loginSchema,
    verifyEmailSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
    resendOTPSchema
} = require("../validators/auth.validator");
const {
    register,
    verifyEmail,
    Login,
    getCurrentUser,
    Logout,
    forgotPassword,
    resetPassword,
    changePassword,
    resendOTP,
    refreshToken,
    googleLogin,
    deleteAccount,
    updateProfile
} = require("../controllers/auth.controller");

router.post("/register", registerLimiter, validate(registerSchema), register);
router.post("/verify-email", verifyOtpLimiter, validate(verifyEmailSchema), verifyEmail);
router.post("/login", loginLimiter, validate(loginSchema), Login);
router.get("/me", authMiddleware, getCurrentUser);
router.post("/logout", authMiddleware, Logout);
router.delete("/delete-account", authMiddleware, deleteAccount);
router.put("/update-profile", authMiddleware, updateProfile);
router.post("/forget-password", forgotPasswordLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.post("/change-password", authMiddleware, validate(changePasswordSchema), changePassword);
router.post("/resend-otp", resendOtpLimiter, validate(resendOTPSchema), resendOTP);
router.post("/refresh-token", refreshToken);
router.post("/google", googleLogin);
module.exports = router;