const mongoose = require("mongoose");

const Schedule = require("../models/schedule.model");
const Ferry = require("../models/ferry.model");
const Route = require("../models/route.model");
const createScheduleService = async (data) => {

    const {
        ferry,
        route,
        departureTime,
        arrivalTime
    } = data;

    // 1. Validate Ferry ObjectId

    if (!mongoose.Types.ObjectId.isValid(ferry)) {
        return {
            success: false,
            statusCode: 400,
            message: "Invalid ferry id"
        };
    }

    // 2. Validate Route ObjectId

    if (!mongoose.Types.ObjectId.isValid(route)) {
        return {
            success: false,
            statusCode: 400,
            message: "Invalid route id"
        };
    }

    // 3. Check Ferry Exists

    const existingFerry = await Ferry.findById(ferry);

    if (!existingFerry) {
        return {
            success: false,
            statusCode: 404,
            message: "Ferry not found"
        };
    }

    // 4. Check Route Exists

    const existingRoute = await Route.findById(route);

    if (!existingRoute) {
        return {
            success: false,
            statusCode: 404,
            message: "Route not found"
        };
    }

    // 5. Validate Time

    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);

    if (arrival <= departure) {
        return {
            success: false,
            statusCode: 400,
            message: "Arrival time must be after departure time"
        };
    }

    // 6. Duplicate Schedule Check

    const duplicateSchedule = await Schedule.findOne({
        ferry,
        departureTime
    });

    if (duplicateSchedule) {
        return {
            success: false,
            statusCode: 409,
            message: "Schedule already exists"
        };
    }

    // 7. Create Schedule

    const schedule = await Schedule.create({
        ...data,
        availableSeats: existingFerry.capacity
    });

    return {
        success: true,
        statusCode: 201,
        message: "Schedule created successfully",
        schedule
    };

};
const getAllSchedulesService = async () => {

    const schedules = await Schedule.find()
        .populate("ferry")
        .populate("route")
        .lean();

    return {
        success: true,
        statusCode: 200,
        message: "Schedules fetched successfully",
        schedules
    };

};

const getScheduleByIdService = async (id) => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return {
            success: false,
            statusCode: 400,
            message: "Invalid schedule id"
        };
    }

    const schedule = await Schedule.findById(id)
        .populate("ferry")
        .populate("route")
        .lean();

    if (!schedule) {
        return {
            success: false,
            statusCode: 404,
            message: "Schedule not found"
        };
    }

    return {
        success: true,
        statusCode: 200,
        message: "Schedule fetched successfully",
        schedule
    };

};
const updateScheduleService = async (id, data) => {

    // 1. Validate Schedule ID

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return {
            success: false,
            statusCode: 400,
            message: "Invalid schedule id"
        };
    }

    // 2. Check Schedule Exists

    const existingSchedule = await Schedule.findById(id);

    if (!existingSchedule) {
        return {
            success: false,
            statusCode: 404,
            message: "Schedule not found"
        };
    }

    // 3. Validate Ferry (if updating)

    if (data.ferry) {

        if (!mongoose.Types.ObjectId.isValid(data.ferry)) {
            return {
                success: false,
                statusCode: 400,
                message: "Invalid ferry id"
            };
        }

        const ferry = await Ferry.findById(data.ferry);

        if (!ferry) {
            return {
                success: false,
                statusCode: 404,
                message: "Ferry not found"
            };
        }

        // Update available seats according to new ferry
        data.availableSeats = ferry.capacity;
    }

    // 4. Validate Route (if updating)

    if (data.route) {

        if (!mongoose.Types.ObjectId.isValid(data.route)) {
            return {
                success: false,
                statusCode: 400,
                message: "Invalid route id"
            };
        }

        const route = await Route.findById(data.route);

        if (!route) {
            return {
                success: false,
                statusCode: 404,
                message: "Route not found"
            };
        }
    }

    // 5. Validate Time

    const departure = new Date(
        data.departureTime || existingSchedule.departureTime
    );

    const arrival = new Date(
        data.arrivalTime || existingSchedule.arrivalTime
    );

    if (arrival <= departure) {
        return {
            success: false,
            statusCode: 400,
            message: "Arrival time must be after departure time"
        };
    }

    // 6. Duplicate Schedule Check

    const duplicateSchedule = await Schedule.findOne({
        _id: { $ne: id },
        ferry: data.ferry || existingSchedule.ferry,
        departureTime: data.departureTime || existingSchedule.departureTime
    });

    if (duplicateSchedule) {
        return {
            success: false,
            statusCode: 409,
            message: "Schedule already exists"
        };
    }

    // 7. Update Schedule

    const updatedSchedule = await Schedule.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    )
        .populate("ferry")
        .populate("route")
        .lean();

    return {
        success: true,
        statusCode: 200,
        message: "Schedule updated successfully",
        schedule: updatedSchedule
    };

};
const deleteScheduleService = async (id) => {

    // 1. Validate Schedule ID

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return {
            success: false,
            statusCode: 400,
            message: "Invalid schedule id"
        };
    }

    // 2. Check Schedule Exists

    const schedule = await Schedule.findById(id);

    if (!schedule) {
        return {
            success: false,
            statusCode: 404,
            message: "Schedule not found"
        };
    }

    // 3. Delete Schedule

    await Schedule.findByIdAndDelete(id);

    return {
        success: true,
        statusCode: 200,
        message: "Schedule deleted successfully"
    };

};
module.exports = { createScheduleService, getAllSchedulesService, getScheduleByIdService, updateScheduleService, deleteScheduleService }