import axios from "../api/axios";

// =====================================================
// GET MY KYC
// =====================================================

export const getMyKyc = async () => {
    const response = await axios.get("/kyc/me");

    return response.data;
};

// =====================================================
// SAVE / UPDATE KYC DETAILS
// =====================================================

export const updateKycDetails = async (data) => {
    const response = await axios.put(
        "/kyc/me",
        data
    );

    return response.data;
};

// =====================================================
// UPLOAD KYC DOCUMENTS
// =====================================================

export const uploadKycDocuments = async (
    formData
) => {
    const response = await axios.post(
        "/kyc/documents",
        formData
    );

    return response.data;
};