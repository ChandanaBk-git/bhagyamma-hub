import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Automatically attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/*
|--------------------------------------------------------------------------
| Get Logged-in Member Network
|--------------------------------------------------------------------------
*/

export const getMyNetwork = async () => {
  const response = await API.get("/users/my-network");

  return response.data.data;
};

/*
|--------------------------------------------------------------------------
| Get Referral Tree
|--------------------------------------------------------------------------
*/

export const getReferralTree = async () => {
  const response = await API.get("/users/referral-tree");
  return response.data.data;
};

/*
|--------------------------------------------------------------------------
| Search Members in Network
|--------------------------------------------------------------------------
*/

export const searchNetwork = async (keyword) => {
  const response = await API.get(
    `/users/network/search?keyword=${keyword}`
  );

  return response.data.data;
};

/*
|--------------------------------------------------------------------------
| Get Member Details
|--------------------------------------------------------------------------
*/

export const getMemberDetails = async (memberId) => {
  const response = await API.get(
    `/users/member/${memberId}`
  );

  return response.data.data;
};