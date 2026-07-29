import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1/auth",
});

// Register
export const register = (data) =>
  API.post("/register", data);

// Login (Sends OTP)
export const login = (data) =>
  API.post("/login", data);

// Verify Login OTP
export const verifyOtp = (data) =>
  API.post("/verify-otp", data);

// Forgot Password (Sends OTP)
export const forgotPassword = (data) =>
  API.post("/forgot-password", data);

// Reset Password
export const resetPassword = (data) =>
  API.post("/reset-password", data);