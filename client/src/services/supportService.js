import api from "./axios";

export const sendSupportInquiry = async (inquiryData) => {
    const response = await api.post("/support/inquiry", inquiryData);
    return response.data;
};

export const getAllInquiries = async () => {
    const response = await api.get("/support/inquiries");
    return response.data;
};

export const resolveInquiry = async (id) => {
    const response = await api.patch(`/support/inquiry/${id}/resolve`);
    return response.data;
};
