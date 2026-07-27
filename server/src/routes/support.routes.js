const express = require("express");
const router = express.Router();
const Inquiry = require("../models/inquiry.model");
const authMiddleware = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
const eventBus = require("../utils/eventBus");

// Submit inquiry (Public)
router.post("/inquiry", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const newInquiry = await Inquiry.create({
            name,
            email,
            subject,
            message
        });

        // Emit real-time creation event via Socket
        eventBus.emit("inquiry:created", newInquiry);

        res.status(200).json({
            success: true,
            message: "Thank you! Your message has been sent to our harbor support operations team.",
            data: newInquiry
        });
    } catch (error) {
        console.error("Support inquiry submission error:", error);
        res.status(500).json({ success: false, message: "Failed to submit support inquiry" });
    }
});

// Get all inquiries (Admin/Staff only)
router.get("/inquiries", authMiddleware, authorizeRoles("admin", "staff"), async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: inquiries
        });
    } catch (error) {
        console.error("Fetch support inquiries error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch support inquiries" });
    }
});

// Resolve inquiry (Admin/Staff only)
router.patch("/inquiry/:id/resolve", authMiddleware, authorizeRoles("admin", "staff"), async (req, res) => {
    try {
        const { id } = req.params;
        const updatedInquiry = await Inquiry.findByIdAndUpdate(
            id,
            { status: "resolved" },
            { new: true }
        );

        if (!updatedInquiry) {
            return res.status(404).json({ success: false, message: "Inquiry not found" });
        }

        // Emit real-time status resolution event via Socket
        eventBus.emit("inquiry:resolved", { id, status: "resolved" });

        res.status(200).json({
            success: true,
            message: "Inquiry marked as resolved",
            data: updatedInquiry
        });
    } catch (error) {
        console.error("Resolve inquiry error:", error);
        res.status(500).json({ success: false, message: "Failed to resolve inquiry" });
    }
});

module.exports = router;
