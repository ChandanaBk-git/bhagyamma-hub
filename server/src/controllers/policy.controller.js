const Policy = require("../models/policy.model");

// GET /api/v1/policies
exports.getPublishedPolicies = async (req, res) => {
  try {
    const policies = await Policy.find({
      status: "published",
    })
      .select(
        "title slug category version effectiveDate updatedAt displayOrder"
      )
      .sort({ displayOrder: 1, title: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: policies.length,
      policies,
    });
  } catch (error) {
    console.error("Get policies error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch policies",
    });
  }
};

// GET /api/v1/policies/:slug
exports.getPolicyBySlug = async (req, res) => {
  try {
    const policy = await Policy.findOne({
      slug: req.params.slug,
      status: "published",
    }).lean();

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
    console.error("Get policy details error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch policy details",
    });
  }
};