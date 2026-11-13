import axios from "axios";
import toast from "react-hot-toast";

const AxiosClient = axios.create({
    // set VITE_API_URL in your .env for production, e.g. https://api.yoursite.com/api
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
    headers: { Accept: "application/json" },
});

AxiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    // only send the header when there is a token (otherwise it sends "Bearer null")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const AUTH_PATHS = ["/login", "/register"];

AxiosClient.interceptors.response.use(
    (response) => {
        // toast after actions (POST, PUT, PATCH, DELETE), not on every GET
        const message = response.data?.message;
        if (message && response.config.method !== "get") {
            toast.success(message);
        }
        return response;
    },
    (error) => {
        const { response, config } = error;

        // no response at all: server down, no internet, CORS problem
        if (!response) {
            toast.error("Can't reach the server. Please check your connection.", {
                id: "network-error", // same id = only one toast, even for parallel requests
            });
            return Promise.reject(error);
        }

        const status = response.status;
        const isAuthRequest = AUTH_PATHS.some((p) => config?.url?.startsWith(p));

        if (status === 401 && !isAuthRequest) {
            // a real expired or invalid session (not a wrong password on the login form)
            localStorage.removeItem("ACCESS_TOKEN");
            toast.error("Session expired. Please log in again.", { id: "session-expired" });
            if (!AUTH_PATHS.includes(window.location.pathname)) {
                window.location.assign("/login");
            }
        } else if (status === 422) {
            // field errors: the component shows them with setErrors
        } else if (status >= 500 || status === 419) {
            toast.error("Something went wrong on our end. Please try again.", {
                id: "server-error",
            });
        } else if (status === 404) {
            toast.error("We couldn't find what you were looking for.", { id: "not-found" });
        } else {
            // 401 on login, 403, 429, and so on: show the message from Laravel
            toast.error(response.data?.message || "Something went wrong.");
        }

        return Promise.reject(error);
    },
);

export default AxiosClient;
