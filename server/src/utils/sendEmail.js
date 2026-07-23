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

        await transporter.verify();



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


};

const sendBookingConfirmationEmail = async (
    user,
    booking,
    schedule,
    ferry,
    route
) => {

    await transporter.sendMail({

        from: process.env.EMAIL_USER,

        to: user.email,

        subject: "  FerryFlow Booking Confirmed",

        html: `
            <h2>Booking Confirmed</h2>

            <p>Hello <b>${user.name}</b>,</p>

            <p>Your ferry booking has been confirmed.</p>

            <hr>

            <p><b>Ticket ID:</b> ${booking.ticketId}</p>

            <p><b>Ferry:</b> ${ferry.name}</p>

            <p><b>Route:</b> ${route.source} → ${route.destination}</p>

            <p><b>Departure:</b> ${new Date(schedule.departureTime).toLocaleString()}</p>

            <p><b>Arrival:</b> ${new Date(schedule.arrivalTime).toLocaleString()}</p>

            <p><b>Seats:</b> ${booking.seatNumbers.join(", ")}</p>

            <p><b>Passengers:</b></p>

            <ul>
                ${booking.passengerDetails.map(passenger => `
                    <li>${passenger.name}</li>
                `).join("")}
            </ul>

            <p><b>Total Paid:</b> ₹${booking.totalAmount}</p>

            <hr>

            <p>Thank you for choosing FerryFlow.</p>
        `

    });

};

module.exports = {
    sendBookingConfirmationEmail, sendEmail
}; 