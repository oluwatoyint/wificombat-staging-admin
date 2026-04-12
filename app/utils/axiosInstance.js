import axios from "axios";
import Cookies from "js-cookie";

// Reads from NEXT_PUBLIC_BASE_URL env var — set this in Vercel dashboard.
// Falls back to the production backend so the app still works if the var is missing.
const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://backend.wificombatelearn.com";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Attach JWT token from cookie on every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401/403 globally — clear session and redirect to login
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      console.error(
        `API error ${error.response.status}: ${error.response.statusText}`
      );
      if ([401, 403].includes(error.response.status)) {
        localStorage.removeItem("token");
        Cookies.remove("token");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    } else {
      console.error("No response from API:", error?.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
