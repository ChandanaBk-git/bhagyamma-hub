import api from "../api/axios";

export const getDashboard = async () => {
  const response = await api.get("/user/dashboard");

  return response.data.data;
};