const express = require("express");
const router = express.Router();

const {
    createAlert,
    getAllAlerts,
    updateAlert,
    deleteAlert
} = require("../controllers/alert.controller");

const authMiddleware = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

// Public route to get alerts
router.get("/", getAllAlerts);

// Protected routes (admin/staff only)
router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin", "staff"),
    createAlert
);

router.patch(
    "/:id",
    authMiddleware,
    authorizeRoles("admin", "staff"),
    updateAlert
);

router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("admin", "staff"),
    deleteAlert
);

module.exports = router;
