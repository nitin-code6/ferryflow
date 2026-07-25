const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const {
    createRouteService,
    getRouteByIdService,
    getAllRouteService,
    updateRouteService,
    deleteRouteService,
    getPopularRoutesService
} = require("../services/route.service");

const createRoute = asyncHandler(async (req, res) => {
    const result = await createRouteService(req.body);
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, result.route, result.message)
    );
});

const getRouteById = asyncHandler(async (req, res) => {
    const result = await getRouteByIdService(req.params.id);
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, result.route, result.message)
    );
});

const getAllRoute = asyncHandler(async (req, res) => {
    const result = await getAllRouteService();
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, result.routes, result.message)
    );
});

const updateRoute = asyncHandler(async (req, res) => {
    const result = await updateRouteService(req.params.id, req.body);
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, result.route, result.message)
    );
});

const deleteRoute = asyncHandler(async (req, res) => {
    const result = await deleteRouteService(req.params.id);
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, null, result.message)
    );
});

const getPopularRoutes = asyncHandler(async (req, res) => {
    const result = await getPopularRoutesService();
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, result.routes, result.message)
    );
});

module.exports = {
    createRoute,
    getAllRoute,
    getRouteById,
    updateRoute,
    deleteRoute,
    getPopularRoutes
};