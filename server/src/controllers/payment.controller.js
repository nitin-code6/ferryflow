const { createPaymentOrderService, verifyPaymentService } = require('../services/paymentService');


const createPaymentOrder = async (req, res) => {

    try {

        const {
            bookingId
        } = req.body;


        const result =
            await createPaymentOrderService(
                bookingId,
                req.user._id
            );


        return res
            .status(result.statusCode)
            .json(result);


    } catch (error) {

        console.error(
            "CREATE PAYMENT ORDER ERROR:",
            error
        );


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
                req.user._id
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
    createPaymentOrder, verifyPayment
};