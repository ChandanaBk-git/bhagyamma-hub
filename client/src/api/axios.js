
import axios from "axios";

const hostname = window.location.hostname;

const baseURL = import.meta.env.DEV
  ? `http://${hostname}:5000/api/v1`
  : import.meta.env.VITE_API_URL ||
    "https://bhagyamma-hub.onrender.com/api/v1";

const axiosInstance = axios.create({
  baseURL,
  timeout: 20000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("AXIOS ERROR:", {
      message: error.message,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      status: error.response?.status,
      response: error.response?.data,
    });

    return Promise.reject(error);
  }
);

export default axiosInstance;
