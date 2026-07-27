import api from "./axios";

export const sendSupportInquiry = async (inquiryData) => {
    const response = await api.post("/support/inquiry", inquiryData);
    return response.data;
};
