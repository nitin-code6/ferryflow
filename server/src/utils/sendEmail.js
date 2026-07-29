const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    // Force IPv4 to prevent ENETUNREACH errors in production (Render)
    family: 4
});

const sendEmail = async ({ to, subject, html }) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html
        });
        console.log(`OTP email sent successfully to ${to}`);
    } catch (error) {
        console.error(`OTP email sending failed for ${to}:`, error.message);
        throw error;
    }
};

const sendBookingConfirmationEmail = async (
    user,
    booking,
    schedule,
    ferry,
    route
) => {

    try {
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
        console.log(`Booking confirmation email sent successfully to ${user.email}`);
    } catch (error) {
        console.error(`Booking confirmation email sending failed for ${user.email}:`, error.message);
        throw error;
    }

};

module.exports = {
    sendBookingConfirmationEmail, sendEmail
}; 