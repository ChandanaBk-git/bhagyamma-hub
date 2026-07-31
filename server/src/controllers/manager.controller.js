const managerService = require("../services/manager.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

// ==========================================
// Dashboard
// ==========================================

const getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await managerService.getDashboard(req.user.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Dashboard fetched successfully.",
      dashboard
    )
  );
});

// ==========================================
// Members
// ==========================================

const getMembers = asyncHandler(async (req, res) => {
  const members = await managerService.getMembers(req.user.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Members fetched successfully.",
      members
    )
  );
});

// ==========================================
// Member Details
// ==========================================

const getMemberById = asyncHandler(async (req, res) => {
  const member = await managerService.getMemberById(req.params.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Member fetched successfully.",
      member
    )
  );
});

// ==========================================
// Referral Tree
// ==========================================

const getReferralTree = asyncHandler(async (req, res) => {
  const tree = await managerService.getReferralTree(req.user.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Referral Tree fetched successfully.",
      tree
    )
  );
});

// ==========================================
// Profile
// ==========================================

const getProfile = asyncHandler(async (req, res) => {
  const profile = await managerService.getProfile(req.user.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Profile fetched successfully.",
      profile
    )
  );
});

module.exports = {
  getDashboard,
  getMembers,
  getMemberById,
  getReferralTree,
  getProfile,
};