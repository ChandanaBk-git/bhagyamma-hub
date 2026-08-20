import api from "../api";

/*
=========================================================
MANAGER SERVICE
=========================================================

Frontend service only.

IMPORTANT:
Do NOT import:
- Mongoose models
- Product model
- Order model
- OrderItem model
- Node.js backend files

All database operations are handled by the backend.

Base API:
    /api/v1

Manager API:
    /api/v1/manager
=========================================================
*/


/*
=========================================================
DASHBOARD
=========================================================
*/

export const getDashboard = async () => {
  const response = await api.get(
    "/manager/dashboard"
  );

  return response.data;
};


/*
=========================================================
MEMBERS
=========================================================
*/

export const getMembers = async () => {
  const response = await api.get(
    "/manager/members"
  );

  return response.data;
};


/*
=========================================================
SINGLE MEMBER
=========================================================
*/

export const getMemberById = async (memberId) => {

  if (!memberId) {
    throw new Error(
      "Member ID is required"
    );
  }

  const response = await api.get(
    `/manager/members/${memberId}`
  );

  return response.data;
};


/*
=========================================================
COMPLETE MEMBER DETAILS
=========================================================
*/

export const getMemberDetails = async (memberId) => {

  if (!memberId) {
    throw new Error(
      "Member ID is required"
    );
  }

  const response = await api.get(
    `/manager/members/${memberId}/details`
  );

  return response.data;
};


/*
=========================================================
REFERRAL TREE
=========================================================
*/

export const getReferralTree = async () => {

  const response = await api.get(
    "/manager/referral-tree"
  );

  return response.data;
};


/*
=========================================================
PROFILE
=========================================================
*/

export const getProfile = async () => {

  const response = await api.get(
    "/manager/profile"
  );

  return response.data;
};


/*
=========================================================
MANAGER ORDERS
=========================================================
*/

export const getManagerOrders = async () => {

  const response = await api.get(
    "/orders/manager-orders"
  );

  return response.data;
};


/*
=========================================================
MANAGER PRODUCTS
=========================================================

Manager can VIEW products only.

The backend handles:
- Product database query
- Sold quantity
- Remaining stock
- Availability
- Product information

Frontend only calls the API.

Endpoint:

GET /api/v1/manager/products
=========================================================
*/

export const getManagerProducts = async () => {

  const response = await api.get(
    "/manager/products"
  );

  return response.data;
};


/*
=========================================================
MANAGER COMMISSION PAGE
=========================================================

Endpoint:

GET /api/v1/manager/commission

This page shows:

- Manager commission
- Managed members
- Member name
- Member ID
- Commission percentage
- Commission amount
- Total commission earned

No payment/pending/paid logic is handled here
unless the backend specifically provides it.

=========================================================
*/

export const getCommissionPage = async () => {

  const response = await api.get(
    "/manager/commission"
  );

  return response.data;
};


/*
=========================================================
COMMISSION ALIAS
=========================================================

Supports older frontend code using:

getCommissions()
=========================================================
*/

export const getCommissions = async () => {

  return getCommissionPage();

};


/*
=========================================================
COMMISSION ALIAS
=========================================================

Supports older frontend code using:

getManagerCommissions()
=========================================================
*/

export const getManagerCommissions = async () => {

  return getCommissionPage();

};


/*
=========================================================
DEFAULT EXPORT
=========================================================

Supports:

import managerService from
"../services/manager.service";

=========================================================
*/

const managerService = {

  getDashboard,

  getMembers,

  getMemberById,

  getMemberDetails,

  getReferralTree,

  getProfile,

  getManagerOrders,

  getManagerProducts,

  getCommissionPage,

  getCommissions,

  getManagerCommissions,

};


export default managerService;