const { createFerryService, getFerryByIdService, getAllFerryService, updateFerryService, deleteFerryService } = require("../services/ferry.service");

const createFerry = async (req, res) => {

    try {

        const result =
            await createFerryService(req.body);

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
const getFerryById = async (req, res) => {

    try {

        const result =
            await getFerryByIdService(req.params.id);

        return res
            .status(result.statusCode)
            .json(result);

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }

};
const getAllFerry = async (req, res) => {

    try {

        const result =
            await getAllFerryService();

        return res
            .status(result.statusCode)
            .json(result);

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }

};
const updateFerry = async (req, res) => {

    try {

        const result =
            await updateFerryService(req.params.id, req.body);

        return res
            .status(result.statusCode)
            .json(result);

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }

};
const deleteFerry = async (req, res) => {

    try {

        const result =
            await deleteFerryService(req.params.id);

        return res
            .status(result.statusCode)
            .json(result);

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }

};
module.exports = {
    createFerry,
    getFerryById,
    getAllFerry,
    updateFerry,
    deleteFerry
}