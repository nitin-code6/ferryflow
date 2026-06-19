const bcrypt = require("bcrypt");
const Otp = require("../models/otp.model");
const sendEmail = require("./sendEmail");

const createAndSendOtp = async (
    userId,
    email,
    purpose
) => {

    await Otp.deleteMany({
        userId,
        purpose
    });

    const otp = Math.floor(
        100000 + Math.random() * 900000
    );

    const hashedOtp =
        await bcrypt.hash(
            otp.toString(),
            10
        );
    console.log("OTP:", otp);
    await Otp.create({
        userId,
        otp: hashedOtp,
        purpose,
        expiresAt: new Date(
            Date.now() + 5 * 60 * 1000
        )
    });

    await sendEmail({
        to: email,
        subject: "Your OTP",
        html: `
            <h2>OTP Verification</h2>
            <p>Your OTP is:</p>
            <h1>${otp}</h1>
            <p>Valid for 5 minutes.</p>
        `
    });

};

module.exports = createAndSendOtp;