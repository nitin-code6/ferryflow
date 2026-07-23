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

    await sendEmail({

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

                <h2>
                    ${isEmailVerification
                ? "Email Verification"
                : "Password Reset"
            }
                </h2>

                <p>
                    ${isEmailVerification
                ? "Use the OTP below to verify your FerryFlow account."
                : "Use the OTP below to reset your FerryFlow password."
            }
                </p>

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
                    This OTP will expire in
                    <strong>5 minutes</strong>.
                </p>

                <p>
                    If you did not request this,
                    please ignore this email.
                </p>

            </div>
        `

    });

};

module.exports = createAndSendOtp;