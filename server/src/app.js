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
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

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