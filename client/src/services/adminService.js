import api from "./axios";

export const adminCreateUserAPI = async (userData) => {
    const response = await api.post("/admin/create-user", userData);
    return response.data;
};
