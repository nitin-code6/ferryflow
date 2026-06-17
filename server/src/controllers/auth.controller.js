const { registerUser } = require("../services/auth.service");

const register = async (req, res) => {

    const result = await registerUser(req.body);

    res.status(200).json(result);
};

module.exports = {
    register
};