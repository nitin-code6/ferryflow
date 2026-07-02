const express = require("express");
const authRouter = require('./routes/auth.routes.js');
const cookieParser = require("cookie-parser");
const ferryRouter = require("./routes/ferry.routes.js");
const cors = require('cors');
const app = express();


app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/ferry", ferryRouter);


module.exports = app;