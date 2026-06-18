const User = require("../models/user.model");
const bcrypt = require('bcrypt');
const Otp = require('../models/otp.model');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const client = require('../config/redis');
const jwt = require('jsonwebtoken');
const registerUser = async (userData) => {
    const { name, email, password } = userData;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return {
            success: false,
            statusCode: 409,
            message: "User already exists"
        };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });
    await Otp.deleteMany({
        userId: user._id,
        purpose: "verify-email"
    });
    const otp = Math.floor(
        100000 + Math.random() * 900000
    );

    const hashedOtp = await bcrypt.hash(
        otp.toString(),
        10
    );

    await Otp.create({
        userId: user._id,
        otp: hashedOtp,
        purpose: "verify-email",
        expiresAt: new Date(
            Date.now() + 5 * 60 * 1000
        )
    });

    // TODO:
    // Send OTP through email

    return {
        success: true,
        message: "User registered successfully",
        otp // remove after nodemailer integration
    };
};
const verifyEmailService = async (userData) => {
    const { email, otp } = userData;

    const user = await User.findOne({ email });
    if (!user) {
        return {
            success: false,
            statusCode: 404,
            message: "User not found"
        };
    }

    if (user.isVerified) {
        return {
            success: false,
            statusCode: 400,
            message: "Email already verified"
        };
    }

    const otpEntry = await Otp.findOne({
        userId: user._id,
        purpose: "verify-email"
    });

    if (!otpEntry) {
        return {
            success: false,
            statusCode: 404,
            message: "OTP not found"
        };
    }

    if (otpEntry.expiresAt < new Date()) {
        return {
            success: false,
            statusCode: 410,
            message: "OTP has expired"
        };
    }

    const isOtpValid = await bcrypt.compare(
        otp,
        otpEntry.otp

    );

    if (!isOtpValid) {
        return {
            success: false,
            statusCode: 401,
            message: "Invalid OTP"
        };
    }


    user.isVerified = true;

    await Otp.findByIdAndDelete(otpEntry._id);
    await user.save();

    const accessToken = generateAccessToken(
        user._id,
        user.role
    );
    const refreshToken = generateRefreshToken(
        user._id,
        user.role
    );
    // Store refresh token in Redis
    await client.set(
        `refresh:${user._id}`,
        refreshToken,
        {
            EX: 7 * 24 * 60 * 60
        }
    );


    return {
        success: true,
        message: "Email verified successfully",
        accessToken,
        refreshToken
    };
};
const LoginService = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        return {
            success: false,
            statusCode: 404,
            message: "Invalid Credentials"
        };
    }
    if (user.accountStatus !== "active") {
        return {
            success: false,
            statusCode: 403,
            message: "Account is not active"
        };
    }
    if (!user.isVerified) {
        return {
            success: false,
            statusCode: 403,
            message: "Please verify your email first"
        };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);


    if (!isPasswordValid) {
        return {
            success: false,
            statusCode: 401,
            message: "Invalid Credentials"
        };
    }
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);
    await client.set(
        `refresh:${user._id}`,
        refreshToken,
        {
            EX: 7 * 24 * 60 * 60
        }
    );

    return {
        success: true,
        message: "Login successful",
        accessToken,
        refreshToken
    };
};
const LogoutService = async (
    accessToken,
    refreshToken
) => {
    try {

        if (!accessToken) {
            return {
                success: false,
                statusCode: 401,
                message: "Access token not found"
            };
        }

        const decoded = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );

        // Remove refresh session
        await client.del(
            `refresh:${decoded._id}`
        );

        // Blacklist access token
        const remainingTime =
            decoded.exp -
            Math.floor(Date.now() / 1000);

        if (remainingTime > 0) {
            await client.set(
                `blacklist:${accessToken}`,
                "true",
                {
                    EX: remainingTime
                }
            );
        }

        return {
            success: true,
            message: "Logged out successfully"
        };

    } catch (error) {

        return {
            success: false,
            statusCode: 401,
            message: "Invalid token"
        };
    }
};
const forgotPasswordService = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        return {
            success: false,
            statusCode: 404,
            message: "User not found"
        };
    }
    if (!user.isVerified) {
        return {
            success: false,
            statusCode: 403,
            message: "Please verify your email first"
        };
    }
    if (user.accountStatus !== "active") {
        return {
            success: false,
            statusCode: 403,
            message: "Account is not active"
        };
    }
    const otp = Math.floor(
        100000 + Math.random() * 900000
    );
    await Otp.deleteMany({
        userId: user._id,
        purpose: "reset-password"
    });
    const hashedOtp = await bcrypt.hash(
        otp.toString(),
        10
    );

    await Otp.create({
        userId: user._id,
        otp: hashedOtp,
        purpose: "reset-password",
        expiresAt: new Date(
            Date.now() + 5 * 60 * 1000
        )
    });

    return {
        success: true,
        message: "OTP sent successfully",
        otp
    };
};
const resetPasswordService = async (userData) => {
    const { otp, email, newPassword } = userData;
    const user = await User.findOne({ email });
    if (!user) {
        return {
            success: false,
            statusCode: 404,
            message: "User not found"
        };
    }
    if (user.accountStatus !== "active") {
        return {
            success: false,
            statusCode: 403,
            message: "Account is not active"
        };
    }
    const otpEntry = await Otp.findOne({
        userId: user._id,
        purpose: "reset-password"
    });
    if (!otpEntry) {
        return {
            success: false,
            statusCode: 404,
            message: "Invalid or expired OTP"
        };
    }
    if (otpEntry.expiresAt < new Date()) {
        return {
            success: false,
            statusCode: 400,
            message: "OTP has expired"
        };
    }
    const isOtpValid = await bcrypt.compare(
        otp,
        otpEntry.otp
    );

    if (!isOtpValid) {
        return {
            success: false,
            message: "Invalid OTP"
        };
    }


    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;


    await user.save();

    await Otp.findByIdAndDelete(otpEntry._id);
    return {
        success: true,
        message: "Password reset successfully"
    };
}

const changePasswordService = async (userId, userData) => {
    const { oldPassword, newPassword } = userData;

    const user = await User.findById(userId);
    if (!user) {
        return {
            success: false,
            message: "User not found"
        };
    }
    if (user.accountStatus !== "active") {
        return {
            success: false,
            message: "Account is not active"
        };
    }
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
        return {
            success: false,
            message: "Invalid password"
        };
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return {
        success: true,
        message: "Password changed successfully"
    };
}
const resendOTPService = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        return {
            success: false,
            message: "User not found"
        };
    }
    if (user.accountStatus !== "active") {
        return {
            success: false,
            message: "Account is not active"
        };
    }
    if (user.isVerified) {
        return {
            success: false,
            message: "Email already verified"
        };
    }
    const otp = Math.floor(
        100000 + Math.random() * 900000
    );
    await Otp.deleteMany({
        userId: user._id,
        purpose: "verify-email"
    });
    const hashedOtp = await bcrypt.hash(
        otp.toString(),
        10
    );
    await Otp.create({
        userId: user._id,
        otp: hashedOtp,
        purpose: "verify-email",
        expiresAt: new Date(
            Date.now() + 5 * 60 * 1000
        )
    });
    return {
        success: true,
        message: "OTP sent successfully",
        otp
    };
}

const refreshTokenService = async (refreshToken) => {
    try {

        if (!refreshToken) {
            return {
                success: false,
                statusCode: 401,
                message: "Refresh token is required"
            };
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        const storedToken = await client.get(`refresh:${decoded._id}`);

        if (!storedToken || storedToken !== refreshToken) {
            return {
                success: false,
                statusCode: 401,
                message: "Invalid refresh token (session expired)"
            };
        }
        const user = await User.findById(decoded._id);

        if (!user) {
            return {
                success: false,
                statusCode: 404,
                message: "User not found"
            };
        }

        if (user.accountStatus !== "active") {
            return {
                success: false,
                statusCode: 403,
                message: "Account is not active"
            };
        }

        if (!user.isVerified) {
            return {
                success: false,
                statusCode: 403,
                message: "Email not verified"
            };
        }

        const accessToken = generateAccessToken(
            user._id,
            user.role
        );

        const newRefreshToken = generateRefreshToken(
            user._id,
            user.role
        );
        await client.set(
            `refresh:${user._id}`,
            newRefreshToken,
            {
                EX: 7 * 24 * 60 * 60
            }
        );
        return {
            success: true,
            message: "Tokens refreshed successfully",
            accessToken,
            refreshToken: newRefreshToken
        };

    } catch (error) {

        return {
            success: false,
            statusCode: 401,
            message: "Invalid or expired refresh token"
        };
    }
};
module.exports = {
    registerUser,
    verifyEmailService,
    LoginService,
    LogoutService,
    forgotPasswordService,
    resetPasswordService,
    changePasswordService,
    resendOTPService,
    refreshTokenService
};