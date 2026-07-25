const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const { createAdminManagedUserService } = require("../services/admin.service");

const createAdminManagedUser = asyncHandler(async (req, res) => {
    const result = await createAdminManagedUserService(req.body);
    
    return res.status(result.statusCode).json(
        new ApiResponse(result.statusCode, result.user || null, result.message)
    );
});

module.exports = {
    createAdminManagedUser
};
