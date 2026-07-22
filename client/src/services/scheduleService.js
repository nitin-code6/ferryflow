import api from "./axios";

export const getAllSchedules = async () => {
    const response = await api.get("/schedules");
    return response.data;
};

export const getScheduleById = async (id) => {
    const response = await api.get(`/schedules/${id}`);
    return response.data;
};

export const createSchedule = async (scheduleData) => {
    const response = await api.post("/schedules", scheduleData);
    return response.data;
};

export const updateSchedule = async (id, scheduleData) => {
    const response = await api.patch(`/schedules/${id}`, scheduleData);
    return response.data;
};

export const deleteSchedule = async (id) => {
    const response = await api.delete(`/schedules/${id}`);
    return response.data;
};
