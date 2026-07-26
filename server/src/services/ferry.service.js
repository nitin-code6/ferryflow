const Ferry = require("../models/ferry.model");
const Schedule = require("../models/schedule.model");
const { generateSeatLayout } = require("../utils/seatLayoutGenerator");
const eventBus = require("../utils/eventBus");
const mongoose = require("mongoose");

const createFerryService = async (ferryData) => {
    const registrationNumber = ferryData.registrationNumber?.trim().toUpperCase();
    const existingFerry = await Ferry.findOne({
        registrationNumber
    });

    if (existingFerry) {
        return {
            success: false,
            statusCode: 409,
            message: "Registration number already exists"
        };
    }

    const ferry = new Ferry({ ...ferryData, registrationNumber });
    await ferry.save(); // triggers pre-save hook → seatConfiguration computed

    return {
        success: true,
        statusCode: 201,
        message: "Ferry created successfully",
        ferry
    };

};
const getFerryByIdService = async (ferryId) => {

    if (!mongoose.Types.ObjectId.isValid(ferryId)) {

        return {
            success: false,
            statusCode: 400,
            message: "Invalid ferry id"
        };

    }

    const ferry = await Ferry.findById(ferryId);

    if (!ferry) {

        return {
            success: false,
            statusCode: 404,
            message: "Ferry not found"
        };

    }

    return {
        success: true,
        statusCode: 200,
        message: "Ferry fetched successfully",
        ferry
    };

};
const getAllFerryService = async () => {
    const ferries = await Ferry.find().lean();
    return {
        success: true,
        statusCode: 200,
        message: "Ferries fetched successfully",
        ferries
    };
};
const updateFerryService = async (ferryId, ferryData) => {
    if (!mongoose.Types.ObjectId.isValid(ferryId)) {
        return {
            success: false,
            statusCode: 400,
            message: "Invalid ferry id"
        };
    }

    const ferry = await Ferry.findById(ferryId);
    if (!ferry) {
        return {
            success: false,
            statusCode: 404,
            message: "Ferry not found"
        };
    }

    // 1. Normalization & Duplicate checks
    if (ferryData.registrationNumber) {
        const registrationNumber = ferryData.registrationNumber.trim().toUpperCase();
        if (registrationNumber !== ferry.registrationNumber) {
            const existingFerry = await Ferry.findOne({ registrationNumber });
            if (existingFerry) {
                return {
                    success: false,
                    statusCode: 409,
                    message: "Registration number already exists"
                };
            }
            ferryData.registrationNumber = registrationNumber;
        }
    }

    // 2. Capacity Reduction Guard
    if (ferryData.capacity !== undefined) {
        const newCapacity = parseInt(ferryData.capacity);
        if (newCapacity < ferry.capacity) {
            const futureSchedules = await Schedule.find({
                ferry: ferryId,
                departureTime: { $gte: new Date() }
            });

            const { floors } = generateSeatLayout(newCapacity);
            const newSeatsSet = new Set(floors.flatMap(f => f.seats.map(s => s.seatNumber)));

            for (const schedule of futureSchedules) {
                if (schedule.bookedSeats.length > newCapacity) {
                    return {
                        success: false,
                        statusCode: 400,
                        message: `Cannot reduce capacity. Schedule on ${schedule.departureTime.toLocaleString()} already has ${schedule.bookedSeats.length} booked seats, which exceeds new capacity of ${newCapacity}.`
                    };
                }

                for (const seat of schedule.bookedSeats) {
                    if (!newSeatsSet.has(seat)) {
                        return {
                            success: false,
                            statusCode: 400,
                            message: `Cannot reduce capacity. Seat '${seat}' is booked on schedule for ${schedule.departureTime.toLocaleString()}, but does not exist in new layout.`
                        };
                    }
                }
            }
        }
    }

    // 3. Ferry Status Transition Guard
    if (ferryData.status && ferryData.status !== ferry.status) {
        if (ferryData.status !== "available") {
            const inProgressSchedule = await Schedule.findOne({
                ferry: ferryId,
                status: { $in: ["boarding", "departed"] }
            });

            if (inProgressSchedule) {
                return {
                    success: false,
                    statusCode: 400,
                    message: "Cannot change status. The ferry is currently operating an active voyage."
                };
            }
        }
    }

    Object.assign(ferry, ferryData);
    await ferry.save();

    // 4. Post-save Event Bus emissions
    if (ferryData.status && ferryData.status !== ferry.status) {
        eventBus.emit("ferry:statusChanged", { ferryId: ferry._id, status: ferry.status });
        if (ferry.status !== "available") {
            const affectedSchedules = await Schedule.find({
                ferry: ferryId,
                departureTime: { $gte: new Date() },
                status: { $ne: "cancelled" }
            });
            affectedSchedules.forEach((sch) => {
                eventBus.emit("schedule:reviewRequired", { scheduleId: sch._id });
            });
        }
    }

    return {
        success: true,
        statusCode: 200,
        message: "Ferry updated successfully",
        ferry
    };
};

const deleteFerryService = async (ferryId) => {
    if (!mongoose.Types.ObjectId.isValid(ferryId)) {
        return {
            success: false,
            statusCode: 400,
            message: "Invalid ferry id"
        };
    }

    // Deletion Guard: Prevent orphan schedules
    const activeSchedule = await Schedule.findOne({
        ferry: ferryId,
        departureTime: { $gte: new Date() },
        status: { $ne: "cancelled" }
    });

    if (activeSchedule) {
        return {
            success: false,
            statusCode: 409,
            message: "Cannot delete ferry. It is currently assigned to active or future schedules."
        };
    }

    const ferry = await Ferry.findByIdAndDelete(ferryId);
    if (!ferry) {
        return {
            success: false,
            statusCode: 404,
            message: "Ferry not found"
        };
    }

    return {
        success: true,
        statusCode: 200,
        message: "Ferry deleted successfully",
        ferry
    };
};
module.exports = {
    createFerryService,
    getFerryByIdService,
    getAllFerryService,
    updateFerryService,
    deleteFerryService
};