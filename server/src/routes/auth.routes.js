const express = require('express');
const router = express.Router();

const { register, verifyEmail, Login } = require("../controllers/auth.controller");
router.post("/register", register);

router.post("/verify-email", verifyEmail);

router.post("/login", Login);
module.exports = router;