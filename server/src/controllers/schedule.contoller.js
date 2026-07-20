const {
    createScheduleService, getAllSchedulesService, getScheduleByIdService, updateScheduleService, deleteScheduleService
} = require("../services/schedule.service");

const createSchedule = async (req, res) => {

    try {

        const result = await createScheduleService(req.body);

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
const getAllSchedules = async (req, res) => {

    try {

        const result = await getAllSchedulesService();

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
const getScheduleById = async (req, res) => {
    try {
        const result = await getScheduleByIdService(req.params.id);
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
const updateSchedule = async (req, res) => {
    try {
        const result = await updateScheduleService(req.params.id, req.body);
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

const deleteSchedule = async (req, res) => {
    try {
        const result = await deleteScheduleService(req.params.id);
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
    createSchedule,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule
};