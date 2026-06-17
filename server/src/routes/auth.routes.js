const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { register, verifyEmail, Login, getCurrentUser } = require("../controllers/auth.controller");
router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/login", Login);
router.get("/me", authMiddleware, getCurrentUser);
module.exports = router;