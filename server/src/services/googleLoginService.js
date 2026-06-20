const client = require("../config/googleClient");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");
const User = require("../models/user.model");

const googleLoginService = async (idToken) => {

    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
    });
    if (!idToken) {

        return {
            success: false,
            message: "Google token is required"
        };

    }
    const payload = ticket.getPayload();

    console.log(payload);
    const {
        sub,
        email,
        name,
        picture
    } = payload;
    let user = await User.findOne({
        email
    });
    if (!user) {

        user = await User.create({
            name,
            email,
            googleId: sub,
            provider: "google",
            profilePicture: picture,
            isVerified: true
        });

    }
    else {

        if (
            user.provider === "local"
            && !user.googleId
        ) {

            user.googleId = sub;



            if (!user.profilePicture) {
                user.profilePicture = picture;
            }

            await user.save();
        }
    }
    const accessToken = generateAccessToken(
        user._id,
        user.role
    );

    const refreshToken = generateRefreshToken(
        user._id,
        user.role
    );
    return {
        user,
        accessToken,
        refreshToken
    };
};

module.exports = {
    googleLoginService
};