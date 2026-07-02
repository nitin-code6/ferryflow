const Ferry = require("../models/ferry.model");
const mongoose = require("mongoose");

const createFerryService = async (ferryData) => {

    const existingFerry = await Ferry.findOne({
        registrationNumber: ferryData.registrationNumber
    });

    if (existingFerry) {

        return {
            success: false,
            statusCode: 409,
            message: "Registration number already exists"
        };

    }

    const ferry = await Ferry.create(ferryData);

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
    console.log(ferryId, ferryData)
    if (!mongoose.Types.ObjectId.isValid(ferryId)) {

        return {
            success: false,
            statusCode: 400,
            message: "Invalid ferry id"
        };

    }

    const ferry = await Ferry.findByIdAndUpdate(ferryId, ferryData, {
        new: true,
        runValidators: true
    });
    console.log(ferry)
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