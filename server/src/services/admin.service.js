const User = require("../models/user.model");
const bcrypt = require("bcrypt");

const createAdminManagedUserService = async (userData) => {
    const { name, email, password, role } = userData;

    // Validate role
    const validRoles = ["citizen", "tourist", "staff", "admin"];
    if (!role || !validRoles.includes(role)) {
        return {
            success: false,
            statusCode: 400,
            message: "Invalid user role specified"
        };
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return {
            success: false,
            statusCode: 409,
            message: "User already exists"
        };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        isVerified: true // Admin created accounts are verified automatically
    });

    // Remove password field before returning user details
    const userResponse = user.toObject();
    delete userResponse.password;

    return {
        success: true,
        statusCode: 201,
        message: `${role.charAt(0).toUpperCase() + role.slice(1)} account created successfully`,
        user: userResponse
    };
};

module.exports = {
    createAdminManagedUserService
};
