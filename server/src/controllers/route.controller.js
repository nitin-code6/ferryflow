const {
    createRouteService,
    getRouteByIdService,
    getAllRouteService,
    updateRouteService,
    deleteRouteService
} = require("../services/route.service");

const createRoute = async (req, res) => {

    try {

        const result = await createRouteService(req.body);

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
const getRouteById = async (req, res) => {

    try {

        const result = await getRouteByIdService(req.params.id);

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
const getAllRoute = async (req, res) => {

    try {

        const result = await getAllRouteService();

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
const updateRoute = async (req, res) => {

    try {

        const result = await updateRoute(
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
const deleteRoute = async (req, res) => {

    try {

        const result = await deleteRouteService(req.params.id);

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


module.exports = {
    createRoute,
    getAllRoute,
    getRouteById,
    updateRoute,
    deleteRoute
};