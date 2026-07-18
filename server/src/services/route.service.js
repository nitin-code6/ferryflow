const Route = require("../models/route.model");
const mongoose = require("mongoose");

const createRouteService = async (data) => {

    const { origin, destination } = data;

    const existingRoute = await Route.findOne({
        origin,
        destination
    });

    if (existingRoute) {

        return {
            success: false,
            statusCode: 409,
            message: "Route already exists"
        };

    }

    const route = await Route.create(data);

    return {
        success: true,
        statusCode: 201,
        message: "Route created successfully",
        route
    };

};
const getRouteByIdService = async (routeId) => {

    if (!mongoose.Types.ObjectId.isValid(routeId)) {

        return {
            success: false,
            statusCode: 400,
            message: "Invalid route id"
        };

    }

    const route = await Route.findById(routeId);

    if (!route) {

        return {
            success: false,
            statusCode: 404,
            message: "Route not found"
        };

    }

    return {
        success: true,
        statusCode: 200,
        message: "Route fetched successfully",
        route
    };

};
const getAllRouteService = async () => {

    const routes = await Route.find().lean();

    return {
        success: true,
        statusCode: 200,
        message: "Routes fetched successfully",
        routes
    };

};
const updateRouteService = async (req, res) => {

    try {

        const result = await updateRouteService(
            req.params.id,
            req.body
        );

        return res
            .status(result.statusCode)
            .json(result);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }

};
const deleteRouteService = async (routeId) => {

    if (!mongoose.Types.ObjectId.isValid(routeId)) {
        return {
            success: false,
            statusCode: 400,
            message: "Invalid route id"
        };
    }

    const route = await Route.findById(routeId);

    if (!route) {
        return {
            success: false,
            statusCode: 404,
            message: "Route not found"
        };
    }

    await Route.findByIdAndDelete(routeId);

    return {
        success: true,
        statusCode: 200,
        message: "Route deleted successfully"
    };

};

module.exports = {
    createRouteService,
    getRouteByIdService,
    getAllRouteService,
    updateRouteService,
    deleteRouteService
};
