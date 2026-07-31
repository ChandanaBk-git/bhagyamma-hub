import API from "../api";

export const getDashboard = async () => {
  const response = await API.get("/manager/dashboard");
  return response.data;
};

export const getMembers = async () => {
  const response = await API.get("/manager/members");
  return response.data;
};

export const getMemberById = async (id) => {
  const response = await API.get(`/manager/members/${id}`);
  return response.data;
};

export const getReferralTree = async () => {
  const response = await API.get("/manager/referral-tree");
  return response.data;
};

export const getProfile = async () => {
  const response = await API.get("/manager/profile");
  return response.data;
};