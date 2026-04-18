import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://wificombat-staging-backend-production.up.railway.app";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

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

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      console.error(`API error ${error.response.status}: ${error.response.statusText}`);
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
