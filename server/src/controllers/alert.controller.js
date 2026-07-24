const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const {
    createAlertService,
    getAllAlertsService,
    updateAlertService,
    deleteAlertService
} = require("../services/alert.service");

const createAlert = asyncHandler(async (req, res) => {
    const result = await createAlertService(req.body, req.user._id);
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, result.alert, result.message)
    );
});

const getAllAlerts = asyncHandler(async (req, res) => {
    const result = await getAllAlertsService(req.query);
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, result.alerts, result.message)
    );
});

const updateAlert = asyncHandler(async (req, res) => {
    const result = await updateAlertService(req.params.id, req.body);
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, result.alert, result.message)
    );
});

const deleteAlert = asyncHandler(async (req, res) => {
    const result = await deleteAlertService(req.params.id);
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
