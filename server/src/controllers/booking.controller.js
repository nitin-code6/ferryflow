const {
    createBookingService, verifyPaymentService
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

// Verify Razorpay Payment

const verifyPayment = async (req, res) => {

    try {


        const result =
            await verifyPaymentService(
                req.body,
                req.userId
            );


        return res
            .status(result.statusCode)
            .json(result);



    } catch (error) {


        console.error(
            "VERIFY PAYMENT ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message: error.message ||
                "Internal server error"

        });

    }

};


module.exports = {
    createBooking, verifyPayment
};