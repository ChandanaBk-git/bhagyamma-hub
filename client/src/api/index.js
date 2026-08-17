import axios from "axios";

const baseURL = import.meta.env.DEV
  ? "http://localhost:5000/api/v1"
  : import.meta.env.VITE_API_URL || "https://bhagyamma-hub.onrender.com/api/v1";

const API = axios.create({
  baseURL,
  timeout: 15000,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API ERROR:", {
      message: error.message,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      method: error.config?.method,
      status: error.response?.status,
      response: error.response?.data,
    });

    return Promise.reject(error);
  }
);

export default API;