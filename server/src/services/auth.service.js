const registerUser = async (userData) => {

    console.log("Register Service Hit");

    return {
        success: true,
        message: "Service Working"
    };
};

module.exports = {
    registerUser
};