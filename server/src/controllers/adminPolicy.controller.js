const mongoose = require("mongoose");

const Policy = require("../models/policy.model");
const PolicyHistory = require("../models/policyHistory.model");

// =====================================================
// CREATE POLICY HISTORY
// =====================================================

const createPolicyHistory = async (
  policy,
  action,
  changedBy = null
) => {
  return PolicyHistory.create({
    policy: policy._id,
    action,
    version: policy.version,
    title: policy.title,
    category: policy.category,
    content: policy.content,
    status: policy.status,
    effectiveDate: policy.effectiveDate,
    requiresLegalReview: policy.requiresLegalReview,
    displayOrder: policy.displayOrder,
    changedBy,
  });
};

// =====================================================
// GET ALL POLICIES
// Includes drafts, published and archived
// =====================================================

exports.getAllPolicies = async (req, res, next) => {
  try {
    const policies = await Policy.find({})
      .sort({
        displayOrder: 1,
        title: 1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      count: policies.length,
      policies,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET POLICY BY ID
// =====================================================

exports.getPolicyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid policy ID",
      });
    }

    const policy = await Policy.findById(id).lean();

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found",
      });
    }

    return res.status(200).json({
      success: true,
      policy,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// UPDATE POLICY
// Saves the previous version into PolicyHistory
// before updating the current policy
// =====================================================

exports.updatePolicy = async (req, res, next) => {
  try {
    const { id } = req.params;

    // -----------------------------------------------
    // Validate ID
    // -----------------------------------------------

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid policy ID",
      });
    }

    // -----------------------------------------------
    // Allowed fields
    // -----------------------------------------------

    const allowedFields = [
      "title",
      "category",
      "content",
      "version",
      "displayOrder",
      "requiresLegalReview",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (
        Object.prototype.hasOwnProperty.call(
          req.body,
          field
        )
      ) {
        updates[field] = req.body[field];
      }
    }

    // -----------------------------------------------
    // Check empty update
    // -----------------------------------------------

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided",
      });
    }

    // -----------------------------------------------
    // Validate title
    // -----------------------------------------------

    if (
      updates.title !== undefined &&
      (
        typeof updates.title !== "string" ||
        !updates.title.trim()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    // -----------------------------------------------
    // Validate category
    // -----------------------------------------------

    if (
      updates.category !== undefined &&
      (
        typeof updates.category !== "string" ||
        !updates.category.trim()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    // -----------------------------------------------
    // Validate content
    // -----------------------------------------------

    if (
      updates.content !== undefined &&
      (
        typeof updates.content !== "string" ||
        !updates.content.trim()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Policy content cannot be empty",
      });
    }

    // -----------------------------------------------
    // Validate version
    // -----------------------------------------------

    if (
      updates.version !== undefined &&
      (
        typeof updates.version !== "string" ||
        !updates.version.trim()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Version is required",
      });
    }

    // -----------------------------------------------
    // Validate display order
    // -----------------------------------------------

    if (
      updates.displayOrder !== undefined &&
      (
        !Number.isInteger(updates.displayOrder) ||
        updates.displayOrder < 0
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Display order must be a non-negative integer",
      });
    }

    // -----------------------------------------------
    // Validate legal review
    // -----------------------------------------------

    if (
      updates.requiresLegalReview !== undefined &&
      typeof updates.requiresLegalReview !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "requiresLegalReview must be boolean",
      });
    }

    // -----------------------------------------------
    // Trim string fields
    // -----------------------------------------------

    if (updates.title !== undefined) {
      updates.title = updates.title.trim();
    }

    if (updates.category !== undefined) {
      updates.category = updates.category.trim();
    }

    if (updates.version !== undefined) {
      updates.version = updates.version.trim();
    }

    // -----------------------------------------------
    // Find current policy
    // -----------------------------------------------

    const existingPolicy =
      await Policy.findById(id);

    if (!existingPolicy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found",
      });
    }

    // -----------------------------------------------
    // Save OLD version before modifying policy
    // -----------------------------------------------

    await createPolicyHistory(
      existingPolicy,
      "updated",
      req.user?.id || null
    );

    // -----------------------------------------------
    // Apply new changes
    // -----------------------------------------------

    Object.assign(
      existingPolicy,
      updates
    );

    // -----------------------------------------------
    // Save new policy
    // -----------------------------------------------

    await existingPolicy.save();

    return res.status(200).json({
      success: true,
      message: "Policy updated successfully",
      policy: existingPolicy,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// PUBLISH POLICY
// =====================================================

exports.publishPolicy = async (req, res, next) => {
  try {
    const { id } = req.params;

    // -----------------------------------------------
    // Validate ID
    // -----------------------------------------------

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid policy ID",
      });
    }

    // -----------------------------------------------
    // Find policy
    // -----------------------------------------------

    const policy =
      await Policy.findById(id);

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found",
      });
    }

    // -----------------------------------------------
    // Legal review check
    // -----------------------------------------------

    if (policy.requiresLegalReview) {
      return res.status(400).json({
        success: false,
        message:
          "Legal review is required before publishing",
      });
    }

    // -----------------------------------------------
    // Required fields
    // -----------------------------------------------

    if (
      !policy.title ||
      !policy.title.trim() ||
      !policy.content ||
      !policy.content.trim() ||
      !policy.category ||
      !policy.category.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Policy title, category and content are required",
      });
    }

    // -----------------------------------------------
    // Update status
    // -----------------------------------------------

    policy.status = "published";
    policy.effectiveDate = new Date();

    await policy.save();

    // -----------------------------------------------
    // Create history entry
    // -----------------------------------------------

    await createPolicyHistory(
      policy,
      "published",
      req.user?.id || null
    );

    return res.status(200).json({
      success: true,
      message:
        "Policy published successfully",
      policy,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// UNPUBLISH POLICY
// Moves published policy back to draft
// =====================================================

exports.unpublishPolicy = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    // -----------------------------------------------
    // Validate ID
    // -----------------------------------------------

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid policy ID",
      });
    }

    // -----------------------------------------------
    // Find policy
    // -----------------------------------------------

    const policy =
      await Policy.findById(id);

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found",
      });
    }

    // -----------------------------------------------
    // Move back to draft
    // -----------------------------------------------

    policy.status = "draft";
    policy.effectiveDate = null;

    await policy.save();

    // -----------------------------------------------
    // Create history entry
    // -----------------------------------------------

    await createPolicyHistory(
      policy,
      "unpublished",
      req.user?.id || null
    );

    return res.status(200).json({
      success: true,
      message:
        "Policy moved to draft",
      policy,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET POLICY HISTORY
// =====================================================

exports.getPolicyHistory = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    // -----------------------------------------------
    // Validate ID
    // -----------------------------------------------

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid policy ID",
      });
    }

    // -----------------------------------------------
    // Verify policy exists
    // -----------------------------------------------

    const policy =
      await Policy.findById(id).lean();

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found",
      });
    }

    // -----------------------------------------------
    // Get history
    // -----------------------------------------------

    const history =
      await PolicyHistory.find({
        policy: id,
      })
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    next(error);
  }
};