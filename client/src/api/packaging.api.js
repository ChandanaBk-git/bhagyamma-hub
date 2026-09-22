import axios from "axios";

const API_URL =
    "http://localhost:5000/api/v1";

// =====================================================
// ADMIN TOKEN
// =====================================================

const getAdminToken = () => {
    return localStorage.getItem("token");
};

// =====================================================
// PACKAGING TOKEN
// =====================================================

const getPackagingToken = () => {
    return (
        localStorage.getItem("packagingToken") ||
        sessionStorage.getItem("packagingToken")
    );
};

// =====================================================
// GET VALID PACKAGING TOKEN
// =====================================================
// Always prefer the latest token stored after common login.
// The passed token is used only as a fallback.
// =====================================================

const getValidPackagingToken = (token = null) => {
    const storedToken = getPackagingToken();

    return storedToken || token;
};

// =====================================================
// ADMIN — CREATE PACKAGING STAFF
// =====================================================

export const createPackagingStaff = async (data) => {
    const token = getAdminToken();

    return axios.post(
        `${API_URL}/packaging/staff`,
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );
};

// =====================================================
// ADMIN — GET PACKAGING STAFF
// =====================================================

export const getPackagingStaff = async () => {
    const token = getAdminToken();

    return axios.get(
        `${API_URL}/packaging/staff`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

// =====================================================
// PACKAGING — LOGIN
// =====================================================
// Kept for backward compatibility.
// Common /login is now the main Packaging login.
// =====================================================

export const packagingLogin = async (data) => {
    return axios.post(
        `${API_URL}/packaging/login`,
        data,
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
};

// =====================================================
// PACKAGING — DASHBOARD
// =====================================================

export const getPackagingDashboard = async (
    token = null
) => {
    const packagingToken =
        getValidPackagingToken(token);

    if (!packagingToken) {
        throw new Error(
            "Packaging authentication token not found."
        );
    }

    return axios.get(
        `${API_URL}/packaging/dashboard`,
        {
            headers: {
                Authorization: `Bearer ${packagingToken}`,
            },
        }
    );
};

// =====================================================
// PACKAGING — ASSIGNED ORDERS
// =====================================================

export const getPackagingOrders = async (
    token = null
) => {
    const packagingToken =
        getValidPackagingToken(token);

    if (!packagingToken) {
        throw new Error(
            "Packaging authentication token not found."
        );
    }

    return axios.get(
        `${API_URL}/packaging/orders`,
        {
            headers: {
                Authorization: `Bearer ${packagingToken}`,
            },
        }
    );
};

// =====================================================
// PACKAGING — ORDER DETAILS
// =====================================================

export const getPackagingOrder = async (
    orderId,
    token = null
) => {
    const packagingToken =
        getValidPackagingToken(token);

    if (!packagingToken) {
        throw new Error(
            "Packaging authentication token not found."
        );
    }

    return axios.get(
        `${API_URL}/packaging/orders/${orderId}`,
        {
            headers: {
                Authorization: `Bearer ${packagingToken}`,
            },
        }
    );
};

// =====================================================
// PACKAGING — UPDATE STATUS
// =====================================================

export const updatePackagingStatus = async (
    orderId,
    status,
    token = null
) => {
    const packagingToken =
        getValidPackagingToken(token);

    if (!packagingToken) {
        throw new Error(
            "Packaging authentication token not found."
        );
    }

    return axios.patch(
        `${API_URL}/packaging/orders/${orderId}/status`,
        {
            status,
        },
        {
            headers: {
                Authorization: `Bearer ${packagingToken}`,
                "Content-Type": "application/json",
            },
        }
    );
};

// =====================================================
// ADMIN — ASSIGN ORDER TO PACKAGING STAFF
// =====================================================

export const assignPackagingOrder = async (
    orderId,
    staffId
) => {
    const token = getAdminToken();

    return axios.patch(
        `${API_URL}/packaging/orders/${orderId}/assign`,
        {
            staffId,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );
};

export const updatePackagingStaff = async (
  staffId,
  data
) => {
  const token = getAdminToken();

  return axios.patch(
    `${API_URL}/packaging/staff/${staffId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};