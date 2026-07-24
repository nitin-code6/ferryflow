import api from "./axios";

export const createBooking = async (bookingData) => {
    const response = await api.post("/booking", bookingData);
    return response.data;
};

export const getUserBookings = async () => {
    const response = await api.get("/booking/user");
    return response.data;
};

export const getAllBookings = async () => {
    const response = await api.get("/booking");
    return response.data;
};

export const cancelBooking = async (bookingId) => {
    const response = await api.patch(`/booking/${bookingId}/cancel`);
    return response.data;
};
