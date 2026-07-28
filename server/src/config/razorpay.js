const Razorpay = require("razorpay");

let _razorpay = null;

/**
 * Returns a lazily-initialised Razorpay instance.
 * Throws a descriptive error when the required env vars are missing
 * so the server can still start without payment keys in non-payment environments.
 */
const getRazorpay = () => {
    if (_razorpay) return _razorpay;

    const key_id = process.env.RAZORPAY_KEY_ID?.trim();
    const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim();

    if (!key_id || !key_secret) {
        throw new Error(
            "Razorpay configuration error: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in environment variables."
        );
    }

    _razorpay = new Razorpay({ key_id, key_secret });
    return _razorpay;
};

module.exports = getRazorpay;