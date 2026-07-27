const express = require("express");
const authRouter = require('./routes/auth.routes.js');
const cookieParser = require("cookie-parser");
const ferryRouter = require("./routes/ferry.routes.js");
const routeRouter = require("./routes/route.routes.js");
const cors = require('cors');
const app = express();

const scheduleRoutes = require("./routes/schedule.route.js");
const bookingRouter = require("./routes/booking.route.js");
const paymentRouter = require("./routes/payment.routes.js");
const alertRouter = require("./routes/alert.route.js");
const dashboardRouter = require("./routes/dashboard.route.js");
const adminRouter = require("./routes/admin.routes.js");
const supportRouter = require("./routes/support.routes.js");
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Secure Headers Middleware
app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    next();
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/ferry", ferryRouter);
app.use("/api/v1/route", routeRouter);
app.use("/api/v1/schedules", scheduleRoutes);
app.use("/api/v1/booking", bookingRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/alerts", alertRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/support", supportRouter);
app.use("/api/admin", adminRouter);
app.use("/api/v1/admin", adminRouter);

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || []
    });
});

module.exports = app;