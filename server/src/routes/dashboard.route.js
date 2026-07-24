const express = require("express");
const router = express.Router();

const { getStats } = require("../controllers/dashboard.controller");
const authMiddleware = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

// Admin dashboard stats
router.get(
    "/stats",
    authMiddleware,
    authorizeRoles("admin"),
    getStats
);

module.exports = router;
