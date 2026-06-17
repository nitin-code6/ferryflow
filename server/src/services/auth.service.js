const User = require("../models/user.model");
const bcrypt = require('bcrypt')
const registerUser = async (userData) => {

    const email = userData.email;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return {
            message: "User already exists",
            success: false,
        }
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const { name } = userData;
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });
    return user;


};

module.exports = {
    registerUser
};