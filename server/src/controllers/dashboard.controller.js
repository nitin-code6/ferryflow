const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const { getStatsService } = require("../services/dashboard.service");

const getStats = asyncHandler(async (req, res) => {
    const result = await getStatsService();
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, result.data, result.message)
    );
});

module.exports = {
    getStats
};
