const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const validate = require("../middleware/validate");

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
    googleLogin
} = require("../controllers/auth.controller");

router.post("/register", validate(registerSchema), register);
router.post("/verify-email", validate(verifyEmailSchema), verifyEmail);
router.post("/login", validate(loginSchema), Login);
router.get("/me", authMiddleware, getCurrentUser);
router.post("/logout", authMiddleware, Logout);
router.post("/forget-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.post("/change-password", authMiddleware, validate(changePasswordSchema), changePassword);
router.post("/resend-otp", validate(resendOTPSchema), resendOTP);
router.post("/refresh-token", refreshToken);
router.post("/google", googleLogin);
module.exports = router;