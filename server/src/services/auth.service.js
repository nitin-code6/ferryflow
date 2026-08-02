const mongoose = require("mongoose");
const { sendEmail } = require("../utils/sendEmail");
const User = require("../models/user.model");
const bcrypt = require('bcrypt');
const Otp = require('../models/otp.model');
const createAndSendOtp = require("../utils/createAndSendOtp");
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const client = require('../config/redis');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const registerUser = async (userData) => {
    const { name, email, password, role } = userData;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        if (!existingUser.isVerified) {
            // Delete the old unverified user and their OTPs so they can try registering again
            await User.findByIdAndDelete(existingUser._id);
            await Otp.deleteMany({ userId: existingUser._id });
        } else {
            return {
                success: false,
                statusCode: 409,
                message: "User already exists"
            };
        }
    }

    // Force public registration role to be citizen or tourist only (defaults to citizen)
    const assignedRole = (role === "citizen" || role === "tourist") ? role : "citizen";

    const hashedPassword = await bcrypt.hash(password, 10);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Create User within the session transaction context
        const users = await User.create([{
            name,
            email,
            password: hashedPassword,
            role: assignedRole
        }], { session });

        const user = users[0];

        // Generate and Hash OTP within the session transaction context
        const otp = crypto.randomInt(100000, 999999);
        const hashedOtp = await bcrypt.hash(otp.toString(), 10);

        // Delete any existing OTP for this user in same session
        await Otp.deleteMany({
            userId: user._id,
            purpose: "verify-email"
        }, { session });

        // Save new OTP in same session
        await Otp.create([{
            userId: user._id,
            otp: hashedOtp,
            purpose: "verify-email",
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        }], { session });

        // Send OTP email before committing transaction so failure aborts the flow
        await sendEmail({
            to: email,
            subject: "Verify Your FerryFlow Account",
            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 20px;
                ">
                    <h2>Email Verification</h2>
                    <p>Use the OTP below to verify your FerryFlow account.</p>
                    <div style="
                        font-size: 32px;
                        font-weight: bold;
                        letter-spacing: 6px;
                        text-align: center;
                        margin: 25px 0;
                    ">
                        ${otp}
                    </div>
                    <p>This OTP will expire in <strong>5 minutes</strong>.</p>
                    <p>If you did not request this, please ignore this email.</p>
                </div>
            `
        });

        // Commit transaction after database and email operations succeed
        await session.commitTransaction();
        session.endSession();

        return {
            success: true,
            statusCode: 200,
            message: "User registered successfully"
        };
    } catch (error) {
        // Abort transaction and rollback user and OTP creation
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
const verifyEmailService = async (userData) => {
    const { email, otp, purpose } = userData;

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
        otpEntry.attempts = (otpEntry.attempts || 0) + 1;
        if (otpEntry.attempts >= 5) {
            await Otp.findByIdAndDelete(otpEntry._id);
            return {
                success: false,
                statusCode: 400,
                message: "Maximum OTP attempts reached. Please request a new OTP."
            };
        }
        await otpEntry.save();
        return {
            success: false,
            statusCode: 400,
            message: "Invalid OTP"
        };
    }

    const verifySession = await mongoose.startSession();
    verifySession.startTransaction();
    try {
        user.isVerified = true;
        await user.save({ session: verifySession });
        await Otp.findByIdAndDelete(otpEntry._id).session(verifySession);
        await verifySession.commitTransaction();
        verifySession.endSession();
    } catch (err) {
        await verifySession.abortTransaction();
        verifySession.endSession();
        throw err;
    }

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
    await createAndSendOtp(

        user._id,

        email,

        "reset-password"

    );

    return {
        success: true,
        message: "OTP sent successfully",
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
        otpEntry.attempts = (otpEntry.attempts || 0) + 1;
        if (otpEntry.attempts >= 5) {
            await Otp.findByIdAndDelete(otpEntry._id);
            return {
                success: false,
                message: "Maximum OTP attempts reached. Please request a new OTP."
            };
        }
        await otpEntry.save();
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
const resendOTPService = async (data) => {

    const {
        email,
        purpose
    } = data;

    const user =
        await User.findOne({
            email
        });

    if (!user) {

        return {
            success: false,
            message: "User not found"
        };

    }

    if (
        user.accountStatus !== "active"
    ) {

        return {
            success: false,
            message: "Account is not active"
        };

    }

    if (
        purpose === "verify-email" &&
        user.isVerified
    ) {

        return {
            success: false,
            message: "Email already verified"
        };

    }

    await createAndSendOtp(

        user._id,

        email,

        purpose

    );

    return {

        success: true,

        message:
            "OTP sent successfully"

    };

};
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
const deleteAccountService = async (userId) => {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
        return {
            success: false,
            statusCode: 404,
            message: "User not found"
        };
    }
    // Delete active refresh tokens from Redis cache
    await client.del(`refresh:${userId}`);

    return {
        success: true,
        statusCode: 200,
        message: "Account deleted successfully"
    };
};

const updateProfileService = async (userId, updateData) => {
    const { name, email } = updateData;
    const user = await User.findById(userId);
    if (!user) {
        return {
            success: false,
            statusCode: 404,
            message: "User not found"
        };
    }
    if (email && email !== user.email) {
        return {
            success: false,
            statusCode: 400,
            message: "Email address cannot be updated currently."
        };
    }

    if (name) user.name = name;
    
    await user.save();

    const updatedUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accountStatus: user.accountStatus
    };

    return {
        success: true,
        statusCode: 200,
        message: "Profile updated successfully",
        user: updatedUser
    };
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
    refreshTokenService,
    deleteAccountService,
    updateProfileService
};