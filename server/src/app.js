const express = require("express");
const authRouter = require('./routes/auth.routes.js');
const app = express();

// Middleware
app.use(express.json());
app.use("/api/v1/auth", authRouter);
// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "FerryFlow API Running"
  });
});

module.exports = app;