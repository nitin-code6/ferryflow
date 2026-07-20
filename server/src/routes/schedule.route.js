const express = require("express");

const {
    createSchedule,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule
} = require("../controllers/schedule.contoller");

const authMiddleware = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
const validate = require("../middleware/validate");

const {
    createScheduleSchema
} = require("../validators/schedule.validator");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin"),
    validate(createScheduleSchema),
    createSchedule
);
router.get(
    "/",
    getAllSchedules
);
router.get(
    "/:id",
    getScheduleById
);
router.patch(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    updateSchedule
);
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    deleteSchedule
);
module.exports = router;