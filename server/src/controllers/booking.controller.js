const {
    createBookingService,
    verifyPaymentService,
    getBookingsByUserService,
    getAllBookingsService,
    cancelBookingService
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

const getUserBookings = async (req, res) => {
    try {
        const result = await getBookingsByUserService(req.user._id);
        return res.status(result.statusCode).json(result);
    } catch (error) {
        console.error("GET USER BOOKINGS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const result = await getAllBookingsService();
        return res.status(result.statusCode).json(result);
    } catch (error) {
        console.error("GET ALL BOOKINGS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const result = await cancelBookingService(
            req.params.id,
            req.user._id,
            req.user.role
        );
        return res.status(result.statusCode).json(result);
    } catch (error) {
        console.error("CANCEL BOOKING ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


module.exports = {
    createBooking,
    verifyPayment,
    getUserBookings,
    getAllBookings,
    cancelBooking
};