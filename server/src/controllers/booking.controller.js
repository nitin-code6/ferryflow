const {
    createBookingService
} = require("../services/booking.service");


const createBooking = async (req, res) => {

    try {
        console.log(req.user);
        const result = await createBookingService(
            req.user._id,
            req.body
        );


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
    createBooking
};