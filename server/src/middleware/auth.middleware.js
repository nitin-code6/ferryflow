const jwt = require("jsonwebtoken");
const client = require('../config/redis');
const authMiddleware = async (req, res, next) => {

    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }
    const isBlacklisted = await client.exists(`blacklist:${accessToken}`);
    if (isBlacklisted) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }
    try {

        const decoded = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );

        req.userId = decoded._id;
        req.role = decoded.role;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};

module.exports = authMiddleware;