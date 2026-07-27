const mongoose = require("mongoose");
const Alert = require("../models/alert.model");

const createAlertService = async (data, userId) => {
    try {
        const alert = await Alert.create({
            ...data,
            createdBy: userId
        });

        return {
            success: true,
            statusCode: 201,
            message: "Alert created successfully",
            alert
        };
    } catch (error) {
        throw error;
    }
};

const getAllAlertsService = async (query = {}) => {
    try {
        const page = Math.max(1, parseInt(query.page) || 1);
        const limit = Math.max(1, Math.min(100, parseInt(query.limit) || 10));
        const skip = (page - 1) * limit;

        const filter = {};
        if (query.status) filter.status = query.status;
        if (query.ferry) filter.ferry = query.ferry;
        if (query.route) filter.route = query.route;

        const total = await Alert.countDocuments(filter);
        const alerts = await Alert.find(filter)
            .populate("ferry", "name")
            .populate("route", "name")
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return {
            success: true,
            statusCode: 200,
            message: "Alerts fetched successfully",
            data: {
                data: alerts,
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        throw error;
    }
};

const updateAlertService = async (id, data) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return {
                success: false,
                statusCode: 400,
                message: "Invalid alert id"
            };
        }

        const alert = await Alert.findByIdAndUpdate(id, data, { new: true, runValidators: true });

        if (!alert) {
            return {
                success: false,
                statusCode: 404,
                message: "Alert not found"
            };
        }

        return {
            success: true,
            statusCode: 200,
            message: "Alert updated successfully",
            alert
        };
    } catch (error) {
        throw error;
    }
};

const deleteAlertService = async (id) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return {
                success: false,
                statusCode: 400,
                message: "Invalid alert id"
            };
        }

        const alert = await Alert.findByIdAndDelete(id);

        if (!alert) {
            return {
                success: false,
                statusCode: 404,
                message: "Alert not found"
            };
        }

        return {
            success: true,
            statusCode: 200,
            message: "Alert deleted successfully"
        };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createAlertService,
    getAllAlertsService,
    updateAlertService,
    deleteAlertService
};
