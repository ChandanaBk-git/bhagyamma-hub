const express = require("express");

const {
  getPublishedPolicies,
  getPolicyBySlug,
} = require("../controllers/policy.controller");

const router = express.Router();

router.get("/", getPublishedPolicies);
router.get("/:slug", getPolicyBySlug);

module.exports = router;