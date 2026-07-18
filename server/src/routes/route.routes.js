const express = require("express");

const {
    createRoute,
    getRouteById,
    getAllRoute,
    updateRoute,
    deleteRoute
} = require("../controllers/route.controller");

const authMiddleware = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
const validate = require("../middleware/validate");

const {
    createRouteSchema,
    updateRouteSchema
} = require("../validators/route.validator");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin"),
    validate(createRouteSchema),
    createRoute
);

router.get(
    "/",
    getAllRoute
);

router.get(
    "/:id",
    getRouteById
);

router.patch(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    validate(updateRouteSchema),
    updateRoute
);

router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    deleteRoute
);

module.exports = router;