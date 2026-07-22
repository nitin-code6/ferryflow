import api from "./axios";

export const getAllRoutes = async () => {
    const response = await api.get("/route");
    return response.data;
};

export const getRouteById = async (id) => {
    const response = await api.get(`/route/${id}`);
    return response.data;
};

export const createRoute = async (routeData) => {
    const response = await api.post("/route", routeData);
    return response.data;
};

export const updateRoute = async (id, routeData) => {
    const response = await api.patch(`/route/${id}`, routeData);
    return response.data;
};

export const deleteRoute = async (id) => {
    const response = await api.delete(`/route/${id}`);
    return response.data;
};
