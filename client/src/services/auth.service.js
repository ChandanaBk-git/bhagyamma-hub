import axios from "../api/axios";

import API from "../api";

// =====================================================
// REGISTER
// =====================================================

export const register = async (userData) => {
  const response = await axios.post(
    "/auth/register",
    userData
  );

  return response.data;
};


// =====================================================
// LOGIN
// =====================================================

export const login = async (userData) => {
  const response = await axios.post(
    "/auth/login",
    userData
  );

  return response.data;
};


// =====================================================
// GET CURRENT PROFILE
// =====================================================

export const getProfile = async () => {
  const response = await axios.get(
    "/auth/profile"
  );

  return response.data;
};


// =====================================================
// UPDATE CURRENT PROFILE
// =====================================================

export const updateProfile = async (payload) => {
  const response = await axios.put(
    "/users/me",
    payload
  );

  return response.data;
};


// =====================================================
// VERIFY LOGIN OTP
// =====================================================

export const verifyOtp = async (data) => {
  const response = await axios.post(
    "/auth/verify-otp",
    data
  );

  return response.data;
};


// =====================================================
// EMAIL FORGOT PASSWORD
// EXISTING FLOW
// =====================================================

export const forgotPassword = async (data) => {
  const response = await axios.post(
    "/auth/forgot-password",
    data
  );

  return response.data;
};


// =====================================================
// MOBILE FORGOT PASSWORD
// SEND OTP
// DEVELOPMENT MODE
// =====================================================

export const sendMobileResetOtp = async (data) => {
  const response = await axios.post(
    "/auth/forgot-password-mobile",
    data
  );

  return response.data;
};


// =====================================================
// MOBILE FORGOT PASSWORD
// VERIFY OTP
// =====================================================

export const verifyResetOtp = async (data) => {
  const response = await axios.post(
    "/auth/verify-reset-otp",
    data
  );

  return response.data;
};


// =====================================================
// RESET PASSWORD
// =====================================================

export const resetPassword = async (data) => {
  const response = await axios.post(
    "/auth/reset-password",
    data
  );

  return response.data;
};