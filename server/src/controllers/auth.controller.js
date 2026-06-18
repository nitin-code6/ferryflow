const { registerUser, verifyEmailService, LoginService, LogoutService, forgotPasswordService, resetPasswordService, changePasswordService, resendOTPService } = require("../services/auth.service");
const User = require("../models/user.model");
const register = async (req, res) => {

    const result = await registerUser(req.body);

    return res
        .status(result.statusCode || 200)
        .json(result);
};
const verifyEmail = async (req, res) => {
    const result = await verifyEmailService(req.body);

    if (!result.success) {
        return res.status(result.statusCode || 400).json(result.message);
    }

    res.cookie("token", result.token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
        success: true,
        message: result.message
    });
};
const Login = async (req, res) => {

    const { email, password } = req.body;

    const result = await LoginService(
        email,
        password
    );

    if (!result.success) {
        return res.status(400).json(result);
    }

    res.cookie("token", result.token, {
        httpOnly: true,
        maxAge: 10 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
        success: true,
        message: result.message
    });
};
const getCurrentUser = async (req, res) => {

    const user = await User.findById(req.userId).select("-password");
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

    const token = req.cookies.token;
    const result = await LogoutService(token);

    if (!result.success) {
        return res.status(result.statusCode || 400).json(result.message);
    }

    res.clearCookie("token");
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
    return res
        .status(result.statusCode || 200)
        .json(result);
};
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const result = await resetPasswordService({
        email,
        otp,
        newPassword
    });
    if (!result.success) {
        return res.status(400).json(result);
    }
    return res.status(200).json({
        success: true,
        message: result.message
    });
};
const changePassword = async (req, res) => {
    const result = await changePasswordService(req.userId, req.body);
    if (!result.success) {
        return res.status(400).json(result);
    }
    return res.status(200).json({
        success: true,
        message: result.message
    });
}
const resendOTP = async (req, res) => {
    const { email } = req.body;
    const result = await resendOTPService(email);
    if (!result.success) {
        return res.status(400).json(result);
    }
    return res.status(200).json(result);
}
module.exports = {
    register,
    verifyEmail,
    Login,
    getCurrentUser,
    Logout,
    forgotPassword,
    resetPassword,
    changePassword,
    resendOTP
};
