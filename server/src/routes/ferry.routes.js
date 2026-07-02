const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");
const { createFerry, getFerryById, getAllFerry, updateFerry, deleteFerry } = require("../controllers/ferry.controller");
const { createFerrySchema, updateFerrySchema } = require("../validators/ferry.validator");
const authMiddleware = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
console.log(updateFerry);
router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin"),
    validate(createFerrySchema),
    createFerry
);
router.get("/:id", getFerryById);
router.get("/", getAllFerry);

router.patch(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    validate(updateFerrySchema),
    updateFerry
);

router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    deleteFerry
);
module.exports = router;