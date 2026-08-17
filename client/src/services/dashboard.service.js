import api from "../api/axios";

export const getDashboard = async () => {
    const response = await api.get("/users/dashboard");
    return response.data.data;
};