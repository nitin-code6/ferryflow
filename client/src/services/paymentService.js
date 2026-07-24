import api from "./axios";

export const createPaymentOrder = async (bookingId) => {
    const response = await api.post("/payment/create-order", { bookingId });
    return response.data;
};

export const verifyPayment = async (verificationData) => {
    const response = await api.post("/payment/verify", verificationData);
    return response.data;
};
