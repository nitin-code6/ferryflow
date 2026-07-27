const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const eventBus = require("../utils/eventBus");
const {
    createScheduleService, 
    getAllSchedulesService, 
    getScheduleByIdService, 
    updateScheduleService, 
    deleteScheduleService,
    searchSchedulesService
} = require("../services/schedule.service");

const createSchedule = asyncHandler(async (req, res) => {
    const result = await createScheduleService(req.body);
    if (result.schedule) {
        eventBus.emit("schedule:created", result.schedule);
    }
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, result.schedule, result.message)
    );
});

const getAllSchedules = asyncHandler(async (req, res) => {
    const result = await getAllSchedulesService(req.query);
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, result.data, result.message)
    );
});

const getScheduleById = asyncHandler(async (req, res) => {
    const result = await getScheduleByIdService(req.params.id);
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, result.schedule, result.message)
    );
});

const updateSchedule = asyncHandler(async (req, res) => {
    const result = await updateScheduleService(req.params.id, req.body);
    if (result.schedule) {
        eventBus.emit("schedule:updated", result.schedule);
    }
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, result.schedule, result.message)
    );
});

const deleteSchedule = asyncHandler(async (req, res) => {
    const result = await deleteScheduleService(req.params.id);
    eventBus.emit("schedule:deleted", { id: req.params.id });
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, result.schedule, result.message)
    );
});

const searchSchedules = asyncHandler(async (req, res) => {
    const { origin, destination, date } = req.query;
    const result = await searchSchedulesService({ origin, destination, date });
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, result.schedules, result.message)
    );
});

module.exports = {
    createSchedule,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule,
    searchSchedules
};