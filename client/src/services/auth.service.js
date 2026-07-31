import axios from "../api/axios";
import API from "../api";

// Register
export const register = async (userData) => {
  const response = await axios.post("/auth/register", userData);
  return response.data;
};

// Login
export const login = async (userData) => {
  const response = await axios.post("/auth/login", userData);
  return response.data;
};

// Verify OTP
export const verifyOtp = async (data) => {
  const response = await axios.post("/auth/verify-otp", data);
  return response.data;
};

// Forgot Password
export const forgotPassword = async (data) => {
  const response = await axios.post("/auth/forgot-password", data);
  return response.data;
};

// Reset Password
export const resetPassword = async (data) => {
  const response = await axios.post("/auth/reset-password", data);
  return response.data;
};