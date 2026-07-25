const Route = require("../models/route.model");
const Booking = require("../models/booking.model");
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

const getPopularRoutesService = async () => {
    const popularRoutes = await Booking.aggregate([
        {
            $match: { bookingStatus: { $ne: "cancelled" } }
        },
        {
            $lookup: {
                from: "schedules",
                localField: "schedule",
                foreignField: "_id",
                as: "scheduleInfo"
            }
        },
        {
            $unwind: "$scheduleInfo"
        },
        {
            $group: {
                _id: "$scheduleInfo.route",
                bookingCount: { $sum: 1 },
                seatsBooked: { $sum: "$seatsBooked" }
            }
        },
        {
            $lookup: {
                from: "routes",
                localField: "_id",
                foreignField: "_id",
                as: "routeInfo"
            }
        },
        {
            $unwind: "$routeInfo"
        },
        {
            $sort: { bookingCount: -1 }
        },
        {
            $project: {
                _id: "$routeInfo._id",
                name: "$routeInfo.name",
                origin: "$routeInfo.origin",
                destination: "$routeInfo.destination",
                distance: "$routeInfo.distance",
                estimatedDuration: "$routeInfo.estimatedDuration",
                status: "$routeInfo.status",
                bookingCount: 1,
                seatsBooked: 1
            }
        }
    ]);

    const allActiveRoutes = await Route.find({ status: "active" }).lean();
    const popularMap = new Map(popularRoutes.map(pr => [pr._id.toString(), pr]));
    
    const resultRoutes = allActiveRoutes.map(r => {
        const pr = popularMap.get(r._id.toString());
        return {
            _id: r._id,
            name: r.name,
            origin: r.origin,
            destination: r.destination,
            distance: r.distance,
            estimatedDuration: r.estimatedDuration,
            status: r.status,
            bookingCount: pr ? pr.bookingCount : 0,
            seatsBooked: pr ? pr.seatsBooked : 0
        };
    });

    resultRoutes.sort((a, b) => b.bookingCount - a.bookingCount);

    return {
        success: true,
        statusCode: 200,
        message: "Popular routes fetched successfully",
        routes: resultRoutes.slice(0, 4)
    };
};

module.exports = {
    createRouteService,
    getRouteByIdService,
    getAllRouteService,
    updateRouteService,
    deleteRouteService,
    getPopularRoutesService
};
