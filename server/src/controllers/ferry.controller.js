const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const { createFerryService, getFerryByIdService, getAllFerryService, updateFerryService, deleteFerryService } = require("../services/ferry.service");

const createFerry = asyncHandler(async (req, res) => {
    const result = await createFerryService(req.body);
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, result.ferry, result.message)
    );
});

const getFerryById = asyncHandler(async (req, res) => {
    const result = await getFerryByIdService(req.params.id);
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, result.ferry, result.message)
    );
});

const getAllFerry = asyncHandler(async (req, res) => {
    const result = await getAllFerryService();
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, result.ferries, result.message)
    );
});

const updateFerry = asyncHandler(async (req, res) => {
    const result = await updateFerryService(req.params.id, req.body);
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, result.ferry, result.message)
    );
});

const deleteFerry = asyncHandler(async (req, res) => {
    const result = await deleteFerryService(req.params.id);
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, null, result.message)
    );
});

module.exports = {
    createFerry,
    getFerryById,
    getAllFerry,
    updateFerry,
    deleteFerry
};