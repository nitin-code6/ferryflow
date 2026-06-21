const nodemailer =
    require("nodemailer");

const transporter =
    nodemailer.createTransport({

        service: "gmail",

        auth: {
            user:
                process.env.EMAIL_USER,

            pass:
                process.env.EMAIL_PASS
        }

    });

const sendEmail = async ({
    to,
    subject,
    html
}) => {

    try {
        console.log(process.env.EMAIL_USER);
        console.log(
            process.env.EMAIL_PASS
                ? "PASS FOUND"
                : "PASS MISSING"
        );

        console.log("1. sendEmail called");

        await transporter.verify();

        console.log("2. SMTP Ready");

    } catch (error) {

        console.log("VERIFY ERROR");
        console.log(error);

    }

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html
    });

    console.log("3. Email sent");
};
module.exports =
    sendEmail;