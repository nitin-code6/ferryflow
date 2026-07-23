const { createPaymentOrderService } = require('../services/paymentService');


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



module.exports = {
    createPaymentOrder
};