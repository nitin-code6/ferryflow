const bcrypt = require("bcrypt");
const Otp = require("../models/otp.model");
const { sendEmail } = require("./sendEmail");

const createAndSendOtp = async (
    userId,
    email,
    purpose
) => {
    // console.log("i have reached ceateand send otp");
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

    const isEmailVerification =
        purpose === "verify-email";

    sendEmail({

        to: email,

        subject: isEmailVerification
            ? "Verify Your FerryFlow Account"
            : "Reset Your FerryFlow Password",

        html: `
            <div style="
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: auto;
                padding: 20px;
            ">
                <h2>${isEmailVerification ? "Email Verification" : "Reset Password"}</h2>
                <p>Use the OTP below to verify your action.</p>
                <div style="
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 6px;
                    text-align: center;
                    margin: 25px 0;
                ">
                    ${otp}
                </div>
                <p>
                    If you did not request this,
                    please ignore this email.
                </p>

            </div>
        `
    }).catch(err => console.error("OTP email failed to send:", err));

};

module.exports = createAndSendOtp;