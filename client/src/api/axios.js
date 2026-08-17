import axios from "axios";

const baseURL = import.meta.env.DEV
  ? "http://localhost:5000/api/v1"
  : import.meta.env.VITE_API_URL ||
    "https://bhagyamma-hub.onrender.com/api/v1";

const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;