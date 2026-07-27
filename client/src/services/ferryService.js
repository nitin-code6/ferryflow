import api from "./axios";

export const getAllFerries = async (params = { limit: 100 }) => {
    const response = await api.get("/ferry", { params });

    return response.data;
};

export const getFerryById = async (id) => {
    const response = await api.get(`/ferry/${id}`);

    return response.data;
};

export const createFerry = async (ferryData) => {
    const response = await api.post(
        "/ferry",
        ferryData
    );

    return response.data;
};

export const updateFerry = async (
    id,
    ferryData
) => {
    const response = await api.patch(
        `/ferry/${id}`,
        ferryData
    );

    return response.data;
};

export const deleteFerry = async (id) => {
    const response = await api.delete(
        `/ferry/${id}`
    );

    return response.data;
};

export const getFerryLayout = async (ferryId) => {
    const response = await api.get(`/ferry/${ferryId}/seat-layout`);
    return response.data;
};