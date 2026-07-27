const { registerUser, verifyEmailService, LoginService, LogoutService, forgotPasswordService, resetPasswordService, changePasswordService, resendOTPService, refreshTokenService, deleteAccountService, updateProfileService } = require("../services/auth.service");
const { googleLoginService } = require("../services/googleLoginService");
const User = require("../models/user.model");
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
};

const register = async (req, res) => {
    try {
        const result = await registerUser(req.body);
        return res.status(result.statusCode || 200).json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const result = await verifyEmailService(req.body);
        if (!result.success) {
            return res.status(result.statusCode || 400).json({
                success: false,
                message: result.message
            });
        }
        res.cookie("accessToken", result.accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000
        });
        res.cookie("refreshToken", result.refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        console.error("Verify Email Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await LoginService(email, password);
        if (!result.success) {
            return res.status(result.statusCode || 400).json(result);
        }
        res.cookie("refreshToken", result.refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.cookie("accessToken", result.accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000
        });
        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getCurrentUser = async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }
    res.status(200).json({
        success: true,
        user: user
    });
};

const Logout = async (req, res) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    const result = await LogoutService(accessToken, refreshToken);
    if (!result.success) {
        return res.status(result.statusCode || 400).json(result.message);
    }
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    return res.status(200).json({
        success: true,
        message: result.message
    });
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const result = await forgotPasswordService(email);
    if (!result.success) {
        return res.status(400).json(result);
    }
    return res.status(result.statusCode || 200).json(result);
};

const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const result = await resetPasswordService({ email, otp, newPassword });
    if (!result.success) {
        return res.status(400).json(result);
    }
    return res.status(200).json({
        success: true,
        message: result.message
    });
};

const changePassword = async (req, res) => {
    const result = await changePasswordService(req.user._id, req.body);
    if (!result.success) {
        return res.status(400).json(result);
    }
    return res.status(200).json({
        success: true,
        message: result.message
    });
}

const resendOTP = async (req, res) => {
    const result = await resendOTPService(req.body);
    if (!result.success) {
        return res.status(400).json(result);
    }
    return res.status(200).json(result);
}

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        const result = await refreshTokenService(token);
        if (!result.success) {
            return res.status(result.statusCode || 400).json({
                success: false,
                message: result.message
            });
        }
        res.cookie("accessToken", result.accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000
        });
        res.cookie("refreshToken", result.refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        console.error("Refresh Token Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;
        const result = await googleLoginService(idToken);
        console.log("RESULT", result)
        res.cookie("refreshToken", result.refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.cookie("accessToken", result.accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000
        });
        return res.status(200).json({
            success: true,
            message: "Google login successful"
        });
    } catch (error) {
        console.error("Google Login Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const result = await deleteAccountService(req.user._id);
        if (result.success) {
            res.clearCookie("accessToken", cookieOptions);
            res.clearCookie("refreshToken", cookieOptions);
        }
        return res.status(result.statusCode || 200).json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const result = await updateProfileService(req.user._id, req.body);
        return res.status(result.statusCode || 200).json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
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
};
