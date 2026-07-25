import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Call the refresh endpoint to get new cookies
                await axios.post(
                    "http://localhost:8000/api/v1/auth/refresh",
                    {},
                    { withCredentials: true }
                );

                // Retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, it means both tokens are invalid
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;