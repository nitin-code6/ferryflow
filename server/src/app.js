const express = require("express");
const authRouter = require('./routes/auth.routes.js');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const app = express();


app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", authRouter);
// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "FerryFlow API Running"
  });
});

module.exports = app;