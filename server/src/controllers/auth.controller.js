const { registerUser, verifyEmailService, LoginService, LogoutService, forgotPasswordService, resetPasswordService, changePasswordService, resendOTPService, refreshTokenService } = require("../services/auth.service");
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

    res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000 // 15 min
    });
    res.cookie("refreshToken", result.refreshToken, {
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

    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000
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

    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    const result =
        await LogoutService(
            accessToken,
            refreshToken
        );
    if (!result.success) {
        return res.status(result.statusCode || 400).json(result.message);
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

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
const refreshToken = async (req, res) => {
    try {

        const refreshToken = req.cookies.refreshToken;

        const result = await refreshTokenService(
            refreshToken
        );

        if (!result.success) {
            return res.status(
                result.statusCode || 400
            ).json({
                success: false,
                message: result.message
            });
        }

        res.cookie(
            "accessToken",
            result.accessToken,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000 // 15 min
            }
        );

        res.cookie(
            "refreshToken",
            result.refreshToken,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            }
        );

        return res.status(200).json({
            success: true,
            message: result.message
        });

    } catch (error) {

        console.error(
            "Refresh Token Controller Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
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
    refreshToken
};
