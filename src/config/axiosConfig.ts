import { API_BASE_URL, ENDPOINTS } from "./apiConfig";
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,   // ← sends cookies automatically (accessToken, refreshToken)
    headers: {
        "Content-Type": "application/json",
    },
});

// ─────────────────────────────────────────────
// Response interceptor — handles token refresh
// ─────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(null);
    });
    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retrying and not a refresh/login call
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes(ENDPOINTS.AUTH.REFRESH) &&
            !originalRequest.url?.includes(ENDPOINTS.AUTH.LOGIN)
        ) {
            if (isRefreshing) {
                // Queue requests while refresh is in progress
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => axiosInstance(originalRequest))
                  .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Attempt token refresh — cookie sent automatically
                await axiosInstance.post(ENDPOINTS.AUTH.REFRESH);
                processQueue(null);
                return axiosInstance(originalRequest); // retry original
            } catch (refreshError) {
                processQueue(refreshError);
                // Refresh failed — force logout
                window.location.href = "/login";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;