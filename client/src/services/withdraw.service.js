import API from "../api";

// ======================================
// Create Withdraw Request
// ======================================

export const requestWithdraw = async (data) => {
  const response = await API.post("/withdraws", data);
  return response.data?.data || null;
};

// ======================================
// Member Withdraw History
// ======================================

export const getMyWithdraws = async () => {
  const response = await API.get("/withdraws/my");
  return response.data?.data || [];
};

// ======================================
// Manager/Admin
// ======================================

export const getAllWithdraws = async () => {

  const response = await API.get(
    "/withdraws"
  );

  return response.data.data;

};

// ======================================
// Approve Withdraw
// ======================================

export const approveWithdraw = async (id) => {

  const response = await API.put(
    `/withdraws/${id}/approve`
  );

  return response.data.data;

};

// ======================================
// Reject Withdraw
// ======================================

export const rejectWithdraw = async (
  id,
  reason
) => {

  const response = await API.put(
    `/withdraws/${id}/reject`,
    {
      reason,
    }
  );

  return response.data.data;

};