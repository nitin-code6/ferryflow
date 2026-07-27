const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const eventBus = require("../utils/eventBus");
const {
    createAlertService,
    getAllAlertsService,
    updateAlertService,
    deleteAlertService
} = require("../services/alert.service");

const createAlert = asyncHandler(async (req, res) => {
    const result = await createAlertService(req.body, req.user._id);
    if (result.alert) {
        eventBus.emit("alert:created", result.alert);
    }
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, result.alert, result.message)
    );
});

const getAllAlerts = asyncHandler(async (req, res) => {
    const result = await getAllAlertsService(req.query);
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, result.data, result.message)
    );
});

const updateAlert = asyncHandler(async (req, res) => {
    const result = await updateAlertService(req.params.id, req.body);
    if (result.alert) {
        eventBus.emit("alert:updated", result.alert);
    }
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, result.alert, result.message)
    );
});

const deleteAlert = asyncHandler(async (req, res) => {
    const result = await deleteAlertService(req.params.id);
    eventBus.emit("alert:deleted", { id: req.params.id });
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, null, result.message)
    );
});

module.exports = {
    createAlert,
    getAllAlerts,
    updateAlert,
    deleteAlert
};
