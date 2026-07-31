import API from "../api";

// ==============================
// Dashboard
// ==============================

export const getDashboard = async () => {
  const response = await API.get("/admin/dashboard");
  return response.data;
};

// ==============================
// Members
// ==============================

export const getAllMembers = async () => {
  const response = await API.get("/admin/users");
  return response.data;
};

export const getMemberById = async (id) => {
  const response = await API.get(`/admin/users/${id}`);
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await API.patch(`/admin/users/${id}`, data);
  return response.data;
};

export const updateUserStatus = async (id, isActive) => {
  const response = await API.patch(`/admin/users/${id}/status`, {
    isActive,
  });

  return response.data;
};

export const updateUserRole = async (id, role) => {
  const response = await API.patch(`/admin/users/${id}/role`, {
    role,
  });

  return response.data;
};

export const deleteUser = async (id) => {
  const response = await API.delete(`/admin/users/${id}`);
  return response.data;
};

// ==============================
// Referral Tree
// ==============================

export const getReferralTree = async () => {
  const response = await API.get("/admin/referral-tree");
  return response.data;
};