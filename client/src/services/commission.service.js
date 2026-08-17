import API from "../api";

// ======================================
// Get Logged-in Member Commission History
// ======================================

export const getMyCommissions = async () => {

    const response =
        await API.get("/commissions/my");

    return response.data.data;

};

// ======================================
// Get Commission Details
// ======================================

export const getCommissionById = async (id) => {

    const response =
        await API.get(`/commissions/${id}`);

    return response.data.data;

};