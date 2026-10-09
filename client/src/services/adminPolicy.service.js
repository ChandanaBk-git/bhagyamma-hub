import API from "../api";

// =====================================================
// GET ALL POLICIES
// =====================================================

export const getAdminPolicies = async () => {
  const response = await API.get("/admin/policies");

  return response.data;
};

// =====================================================
// GET ONE POLICY
// =====================================================

export const getAdminPolicy = async (id) => {
  const response = await API.get(
    `/admin/policies/${id}`
  );

  return response.data;
};

// =====================================================
// UPDATE POLICY
// =====================================================

export const updateAdminPolicy = async (
  id,
  data
) => {
  const response = await API.patch(
    `/admin/policies/${id}`,
    data
  );

  return response.data;
};

// =====================================================
// PUBLISH POLICY
// =====================================================

export const publishAdminPolicy = async (id) => {
  const response = await API.patch(
    `/admin/policies/${id}/publish`
  );

  return response.data;
};

// =====================================================
// UNPUBLISH POLICY
// =====================================================

export const unpublishAdminPolicy = async (id) => {
  const response = await API.patch(
    `/admin/policies/${id}/unpublish`
  );

  return response.data;
};

// =====================================================
// GET POLICY HISTORY
// =====================================================

export const getAdminPolicyHistory = async (id) => {
  const response = await API.get(
    `/admin/policies/${id}/history`
  );

  return response.data;
};