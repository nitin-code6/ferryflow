import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if error response is 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            
            // Avoid looping on the refresh token endpoint itself
            if (originalRequest.url.includes("/auth/refresh-token")) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                // Queue requests while token is refreshing
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Call correct refresh-token endpoint
                await axios.post(
                    "http://localhost:8000/api/v1/auth/refresh-token",
                    {},
                    { withCredentials: true }
                );

                isRefreshing = false;
                processQueue(null);

                // Retry original request
                return api(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                processQueue(refreshError, null);

                // Dispatch global event to force logout on frontend
                window.dispatchEvent(new Event("unauthorized-logout"));

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;