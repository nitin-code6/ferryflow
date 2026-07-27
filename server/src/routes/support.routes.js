const express = require("express");
const router = express.Router();
const { sendEmail } = require("../utils/sendEmail");

router.post("/inquiry", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Send notification to support team
        try {
            await sendEmail({
                to: "ferryflow.team@gmail.com",
                subject: `🚢 Support Inquiry: ${subject || "General Assistance"}`,
                html: `
                    <h2>New Support Inquiry Received</h2>
                    <p><b>Name:</b> ${name}</p>
                    <p><b>Email:</b> ${email}</p>
                    <p><b>Subject:</b> ${subject}</p>
                    <p><b>Message:</b></p>
                    <p>${message}</p>
                `
            });
        } catch (supportEmailErr) {
            console.error("Failed to email support team:", supportEmailErr);
        }

        // Send confirmation email to sender
        try {
            await sendEmail({
                to: email,
                subject: "🚢 FerryFlow Support Inquiry Received",
                html: `
                    <h2>We've Received Your Inquiry</h2>
                    <p>Hello <b>${name}</b>,</p>
                    <p>Thank you for reaching out to the FerryFlow support operations team. We have received your inquiry and our desk team will get back to you shortly.</p>
                    <p><b>Your Message:</b></p>
                    <blockquote style="border-left: 3px solid #ccc; padding-left: 10px; color: #555;">
                        ${message}
                    </blockquote>
                    <hr>
                    <p>Safe Travels,<br/>FerryFlow Support Desk</p>
                `
            });
        } catch (clientEmailErr) {
            console.error("Failed to email client confirmation:", clientEmailErr);
        }

        res.status(200).json({ success: true, message: "Inquiry sent successfully" });
    } catch (error) {
        console.error("Support inquiry error:", error);
        res.status(500).json({ success: false, message: "Failed to send inquiry" });
    }
});

module.exports = router;
