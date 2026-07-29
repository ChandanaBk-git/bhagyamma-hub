import axios from "../api/axios";

// Auth API wrapper using the shared axios instance
export const register = (payload) => axios.post("/auth/register", payload);
export const login = (payload) => axios.post("/auth/login", payload);
export const verifyOtp = (payload) => axios.post("/auth/verify-otp", payload);
export const getProfile = () => axios.get("/auth/profile");
export const forgotPassword = (payload) => axios.post("/auth/forgot-password", payload);
export const resetPassword = (payload) => axios.post("/auth/reset-password", payload);

export const logout = () => {
  // Clear local storage (frontend-only)
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return Promise.resolve();
};

export default {
  register,
  login,
  verifyOtp,
  getProfile,
  forgotPassword,
  resetPassword,
  logout,
};