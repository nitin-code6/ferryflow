const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
const validate = require("../middleware/validate");
const { adminCreateUserSchema } = require("../validators/auth.validator");
const { createAdminManagedUser } = require("../controllers/admin.controller");

router.post(
    "/create-user",
    authMiddleware,
    authorizeRoles("admin"),
    validate(adminCreateUserSchema),
    createAdminManagedUser
);

module.exports = router;
