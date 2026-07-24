const User = require("../models/user.model");
const Ferry = require("../models/ferry.model");
const Route = require("../models/route.model");
const Schedule = require("../models/schedule.model");
const Booking = require("../models/booking.model");

const getStatsService = async () => {
    try {
        const [
            totalUsers,
            totalFerries,
            totalRoutes,
            totalSchedules,
            totalBookings,
            revenueResult
        ] = await Promise.all([
            User.countDocuments(),
            Ferry.countDocuments(),
            Route.countDocuments(),
            Schedule.countDocuments(),
            Booking.countDocuments(),
            Booking.aggregate([
                { $match: { paymentStatus: "paid" } },
                { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
            ])
        ]);

        const revenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

        return {
            success: true,
            statusCode: 200,
            message: "Dashboard stats fetched successfully",
            data: {
                totalUsers,
                totalFerries,
                totalRoutes,
                totalSchedules,
                totalBookings,
                revenue
            }
        };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getStatsService
};
