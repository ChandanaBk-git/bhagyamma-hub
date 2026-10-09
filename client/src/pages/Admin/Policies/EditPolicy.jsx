import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import PublishRoundedIcon from "@mui/icons-material/PublishRounded";
import UnpublishedRoundedIcon from "@mui/icons-material/UnpublishedRounded";
import PreviewRoundedIcon from "@mui/icons-material/PreviewRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";

import {
  getAdminPolicy,
  updateAdminPolicy,
  publishAdminPolicy,
  unpublishAdminPolicy,
  getAdminPolicyHistory,
} from "../../../services/adminPolicy.service";

const EditPolicy = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [policy, setPolicy] = useState(null);

  const [form, setForm] = useState({
    title: "",
    category: "",
    content: "",
    version: "1.0",
    displayOrder: 0,
    requiresLegalReview: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // History
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

  // --------------------------------------------------
  // LOAD POLICY
  // --------------------------------------------------

  const loadPolicy = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminPolicy(id);

      const data = response?.policy || response;

      if (!data) {
        throw new Error("Policy not found");
      }

      setPolicy(data);

      setForm({
        title: data.title || "",
        category: data.category || "",
        content: data.content || "",
        version: data.version || "1.0",
        displayOrder: data.displayOrder ?? 0,
        requiresLegalReview: Boolean(data.requiresLegalReview),
      });
    } catch (err) {
      console.error("LOAD POLICY ERROR:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load policy"
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // LOAD HISTORY
  // --------------------------------------------------

  const loadHistory = async () => {
    try {
      setHistoryLoading(true);
      setHistoryError("");

      const response = await getAdminPolicyHistory(id);

      setHistory(response?.history || []);
    } catch (err) {
      console.error("LOAD POLICY HISTORY ERROR:", err);

      setHistoryError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load policy history"
      );
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    loadPolicy();
    loadHistory();
  }, [id]);

  // --------------------------------------------------
  // FORM HANDLERS
  // --------------------------------------------------

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  };

  const handleLegalReviewChange = (event) => {
    const checked = event.target.checked;

    setForm((prev) => ({
      ...prev,
      requiresLegalReview: checked,
    }));

    setSuccess("");
    setError("");
  };

  // --------------------------------------------------
  // SAVE
  // --------------------------------------------------

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!form.title.trim()) {
        setError("Policy title is required.");
        return;
      }

      if (!form.category.trim()) {
        setError("Policy category is required.");
        return;
      }

      if (!form.content.trim()) {
        setError("Policy content is required.");
        return;
      }

      const payload = {
        title: form.title.trim(),
        category: form.category.trim(),
        content: form.content,
        version: form.version.trim() || "1.0",
        displayOrder: Number(form.displayOrder) || 0,
        requiresLegalReview: Boolean(form.requiresLegalReview),
      };

      const response = await updateAdminPolicy(id, payload);

      const updatedPolicy = response?.policy;

      if (updatedPolicy) {
        setPolicy(updatedPolicy);

        setForm({
          title: updatedPolicy.title || "",
          category: updatedPolicy.category || "",
          content: updatedPolicy.content || "",
          version: updatedPolicy.version || "1.0",
          displayOrder: updatedPolicy.displayOrder ?? 0,
          requiresLegalReview: Boolean(
            updatedPolicy.requiresLegalReview
          ),
        });
      }

      setSuccess("Policy saved successfully.");

      await loadHistory();
    } catch (err) {
      console.error("SAVE POLICY ERROR:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to save policy"
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // PUBLISH
  // --------------------------------------------------

  const handlePublish = async () => {
    if (form.requiresLegalReview) {
      setError(
        "This policy still requires legal review. Complete legal review before publishing."
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to publish this policy?\n\nPublished policies can be visible to customers."
    );

    if (!confirmed) return;

    try {
      setPublishing(true);
      setError("");
      setSuccess("");

      /*
       * Save the latest form values first.
       *
       * IMPORTANT:
       * This does not bypass legal review.
       * The checkbox must already be unchecked by an authorized
       * admin after the required review.
       */
      await updateAdminPolicy(id, {
        title: form.title.trim(),
        category: form.category.trim(),
        content: form.content,
        version: form.version.trim() || "1.0",
        displayOrder: Number(form.displayOrder) || 0,
        requiresLegalReview: false,
      });

      const response = await publishAdminPolicy(id);

      const publishedPolicy = response?.policy;

      if (publishedPolicy) {
        setPolicy(publishedPolicy);

        setForm({
          title: publishedPolicy.title || "",
          category: publishedPolicy.category || "",
          content: publishedPolicy.content || "",
          version: publishedPolicy.version || "1.0",
          displayOrder: publishedPolicy.displayOrder ?? 0,
          requiresLegalReview: Boolean(
            publishedPolicy.requiresLegalReview
          ),
        });
      }

      setSuccess("Policy published successfully.");

      await loadHistory();
    } catch (err) {
      console.error("PUBLISH POLICY ERROR:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to publish policy"
      );
    } finally {
      setPublishing(false);
    }
  };

  // --------------------------------------------------
  // UNPUBLISH
  // --------------------------------------------------

  const handleUnpublish = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to unpublish this policy?\n\nIt will be moved back to draft status."
    );

    if (!confirmed) return;

    try {
      setUnpublishing(true);
      setError("");
      setSuccess("");

      const response = await unpublishAdminPolicy(id);

      const unpublishedPolicy = response?.policy;

      if (unpublishedPolicy) {
        setPolicy(unpublishedPolicy);

        setForm({
          title: unpublishedPolicy.title || "",
          category: unpublishedPolicy.category || "",
          content: unpublishedPolicy.content || "",
          version: unpublishedPolicy.version || "1.0",
          displayOrder: unpublishedPolicy.displayOrder ?? 0,
          requiresLegalReview: Boolean(
            unpublishedPolicy.requiresLegalReview
          ),
        });
      }

      setSuccess("Policy unpublished successfully.");

      await loadHistory();
    } catch (err) {
      console.error("UNPUBLISH POLICY ERROR:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to unpublish policy"
      );
    } finally {
      setUnpublishing(false);
    }
  };

  // --------------------------------------------------
  // PREVIEW
  // --------------------------------------------------

  const handlePreview = () => {
    navigate(`/admin/policies/${id}/preview`);
  };

  // --------------------------------------------------
  // FORMAT DATE
  // --------------------------------------------------

  const formatDate = (date) => {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "—";
    }

    return parsed.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // --------------------------------------------------
  // STATUS CHIP
  // --------------------------------------------------

  const getStatusChip = (status) => {
    if (status === "published") {
      return (
        <Chip
          icon={<CheckCircleRoundedIcon />}
          label="Published"
          size="small"
          color="success"
        />
      );
    }

    if (status === "archived") {
      return (
        <Chip
          label="Archived"
          size="small"
          color="default"
        />
      );
    }

    return (
      <Chip
        label="Draft"
        size="small"
        color="warning"
      />
    );
  };

  // --------------------------------------------------
  // ACTION CHIP
  // --------------------------------------------------

  const getActionChip = (action) => {
    switch (action) {
      case "created":
        return (
          <Chip
            label="Created"
            size="small"
            color="info"
          />
        );

      case "updated":
        return (
          <Chip
            label="Updated"
            size="small"
            color="primary"
          />
        );

      case "published":
        return (
          <Chip
            label="Published"
            size="small"
            color="success"
          />
        );

      case "unpublished":
        return (
          <Chip
            label="Unpublished"
            size="small"
            color="warning"
          />
        );

      default:
        return (
          <Chip
            label={action || "Unknown"}
            size="small"
          />
        );
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography color="text.secondary">
            Loading policy...
          </Typography>
        </Stack>
      </Box>
    );
  }

  // --------------------------------------------------
  // ERROR / NOT FOUND
  // --------------------------------------------------

  if (!policy) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Button
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate("/admin/policies")}
          sx={{ mb: 2 }}
        >
          Back to Policies
        </Button>

        <Alert severity="error">
          {error || "Policy not found."}
        </Alert>
      </Box>
    );
  }

  // --------------------------------------------------
  // WARNING DETECTION
  // --------------------------------------------------

  const hasLegalReviewMarker =
    form.content.includes("[LEGAL REVIEW REQUIRED]");

  const hasConfirmationMarker =
    form.content.includes("[TO CONFIRM]");

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <Box
      sx={{
        p: {
          xs: 1.5,
          sm: 2,
          md: 3,
        },
        maxWidth: "1500px",
        mx: "auto",
      }}
    >
      {/* ==================================================
          HEADER
      ================================================== */}

      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{
          xs: "stretch",
          md: "center",
        }}
        sx={{ mb: 3 }}
      >
        <Box>
          <Button
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate("/admin/policies")}
            sx={{
              mb: 1,
              textTransform: "none",
            }}
          >
            Back to Policies
          </Button>

          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              fontSize: {
                xs: "1.35rem",
                sm: "1.6rem",
                md: "1.8rem",
              },
            }}
          >
            Edit Policy
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Manage policy content, version, legal review and publication.
          </Typography>
        </Box>

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={1}
        >
          <Button
            variant="outlined"
            startIcon={<PreviewRoundedIcon />}
            onClick={handlePreview}
            sx={{
              textTransform: "none",
            }}
          >
            Preview
          </Button>

          <Button
            variant="contained"
            startIcon={<SaveRoundedIcon />}
            onClick={handleSave}
            disabled={saving || publishing || unpublishing}
            sx={{
              textTransform: "none",
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Stack>
      </Stack>

      {/* ==================================================
          ALERTS
      ================================================== */}

      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          onClose={() => setSuccess("")}
          sx={{ mb: 2 }}
        >
          {success}
        </Alert>
      )}

      {/* ==================================================
          STATUS BAR
      ================================================== */}

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2.5,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
          justifyContent="space-between"
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"
            useFlexGap
          >
            <Typography
              variant="body2"
              fontWeight={600}
            >
              Current Status:
            </Typography>

            {getStatusChip(policy.status)}

            <Chip
              label={`Version ${form.version || "1.0"}`}
              size="small"
              variant="outlined"
            />
          </Stack>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            Last updated: {formatDate(policy.updatedAt)}
          </Typography>
        </Stack>
      </Paper>

      {/* ==================================================
          LEGAL REVIEW WARNING
      ================================================== */}

      {form.requiresLegalReview && (
        <Alert
          severity="warning"
          icon={<WarningAmberRoundedIcon />}
          sx={{ mb: 2 }}
        >
          <Typography
            variant="body2"
            fontWeight={700}
          >
            Legal review required
          </Typography>

          <Typography
            variant="body2"
            sx={{ mt: 0.5 }}
          >
            This policy cannot be published until the required legal
            review is completed and the review flag is cleared by an
            authorized administrator.
          </Typography>
        </Alert>
      )}

      {/* ==================================================
          CONTENT MARKER WARNING
      ================================================== */}

      {(hasLegalReviewMarker || hasConfirmationMarker) && (
        <Alert
          severity="warning"
          icon={<WarningAmberRoundedIcon />}
          sx={{ mb: 2 }}
        >
          <Typography
            variant="body2"
            fontWeight={700}
          >
            Draft content markers detected
          </Typography>

          <Typography
            variant="body2"
            sx={{ mt: 0.5 }}
          >
            {hasLegalReviewMarker &&
              "[LEGAL REVIEW REQUIRED] is present in the content. "}

            {hasConfirmationMarker &&
              "[TO CONFIRM] is present in the content. "}
          </Typography>

          <Typography
            variant="caption"
            display="block"
            sx={{ mt: 0.5 }}
          >
            Resolve these items before treating the policy as final.
          </Typography>
        </Alert>
      )}

      {/* ==================================================
          BASIC INFORMATION
      ================================================== */}

      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 2,
            sm: 2.5,
            md: 3,
          },
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          mb: 2.5,
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mb: 2.5 }}
        >
          <EditNoteRoundedIcon color="primary" />

          <Typography
            variant="h6"
            fontWeight={700}
          >
            Basic Information
          </Typography>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "2fr 1fr",
            },
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            label="Policy Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            select
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <MenuItem value="legal">
              Legal
            </MenuItem>

            <MenuItem value="privacy">
              Privacy
            </MenuItem>

            <MenuItem value="shipping">
              Shipping & Delivery
            </MenuItem>

            <MenuItem value="refund">
              Cancellation / Returns / Refunds
            </MenuItem>

            <MenuItem value="membership">
              Membership
            </MenuItem>

            <MenuItem value="commission">
              Referral / Commission
            </MenuItem>

            <MenuItem value="wallet">
              Wallet
            </MenuItem>

            <MenuItem value="conduct">
              Account Conduct
            </MenuItem>

            <MenuItem value="support">
              Grievance / Support
            </MenuItem>

            <MenuItem value="product">
              Product Information
            </MenuItem>

            <MenuItem value="direct-selling">
              Direct Selling
            </MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Version"
            name="version"
            value={form.version}
            onChange={handleChange}
            placeholder="1.0"
            helperText="Example: 1.0, 1.1, 2.0"
          />

          <TextField
            fullWidth
            type="number"
            label="Display Order"
            name="displayOrder"
            value={form.displayOrder}
            onChange={handleChange}
            inputProps={{
              min: 0,
            }}
            helperText="Lower numbers appear first."
          />
        </Box>
      </Paper>

      {/* ==================================================
          LEGAL REVIEW
      ================================================== */}

      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 2,
            sm: 2.5,
            md: 3,
          },
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          mb: 2.5,
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ mb: 1 }}
        >
          Legal Review
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1.5 }}
        >
          Keep this enabled until the policy has actually been reviewed
          and approved through your business/legal process.
        </Typography>

        <FormControlLabel
          control={
            <Checkbox
              checked={form.requiresLegalReview}
              onChange={handleLegalReviewChange}
            />
          }
          label={
            <Typography fontWeight={600}>
              This policy requires legal review
            </Typography>
          }
        />

        {!form.requiresLegalReview && (
          <Alert
            severity="info"
            sx={{ mt: 1 }}
          >
            Legal review flag is currently cleared. Only clear this flag
            after the required review has actually been completed.
          </Alert>
        )}
      </Paper>

      {/* ==================================================
          POLICY CONTENT
      ================================================== */}

      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 2,
            sm: 2.5,
            md: 3,
          },
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          mb: 2.5,
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ mb: 1 }}
        >
          Policy Content
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          Write the complete policy content below. Markdown-style headings
          and bullet points are supported by the preview page.
        </Typography>

        <TextField
          fullWidth
          multiline
          minRows={18}
          maxRows={40}
          label="Content"
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder={`# Policy Title

## 1. Introduction

Write policy details here.

## 2. Important Information

- Point one
- Point two
- Point three`}
          sx={{
            "& .MuiInputBase-root": {
              alignItems: "flex-start",
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              fontSize: "0.9rem",
              lineHeight: 1.6,
            },
          }}
        />

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={1}
          sx={{ mt: 2 }}
        >
          <Chip
            size="small"
            label={`${form.content.length} characters`}
            variant="outlined"
          />

          {hasLegalReviewMarker && (
            <Chip
              size="small"
              label="Legal review marker found"
              color="warning"
            />
          )}

          {hasConfirmationMarker && (
            <Chip
              size="small"
              label="Confirmation marker found"
              color="warning"
            />
          )}
        </Stack>
      </Paper>

      {/* ==================================================
          VERSION HISTORY
      ================================================== */}

      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 2,
            sm: 2.5,
            md: 3,
          },
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          mb: 2.5,
        }}
      >
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={1}
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <HistoryRoundedIcon color="primary" />

            <Typography
              variant="h6"
              fontWeight={700}
            >
              Version History
            </Typography>

            <Chip
              size="small"
              label={`${history.length} record${
                history.length === 1 ? "" : "s"
              }`}
              variant="outlined"
            />
          </Stack>

          <Button
            size="small"
            variant="outlined"
            startIcon={<HistoryRoundedIcon />}
            onClick={loadHistory}
            disabled={historyLoading}
            sx={{
              textTransform: "none",
            }}
          >
            Refresh History
          </Button>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {historyLoading && (
          <Box
            sx={{
              py: 4,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Stack
              spacing={1.5}
              alignItems="center"
            >
              <CircularProgress size={28} />

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Loading history...
              </Typography>
            </Stack>
          </Box>
        )}

        {!historyLoading && historyError && (
          <Alert severity="error">
            {historyError}
          </Alert>
        )}

        {!historyLoading &&
          !historyError &&
          history.length === 0 && (
            <Box
              sx={{
                py: 5,
                textAlign: "center",
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <HistoryRoundedIcon
                sx={{
                  fontSize: 40,
                  color: "text.disabled",
                  mb: 1,
                }}
              />

              <Typography
                fontWeight={600}
                color="text.secondary"
              >
                No version history yet
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Save this policy to create its first history record.
              </Typography>
            </Box>
          )}

        {!historyLoading &&
          !historyError &&
          history.length > 0 && (
            <Stack spacing={1.5}>
              {history.map((item, index) => (
                <Box
                  key={item._id || index}
                  sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    backgroundColor:
                      index === 0
                        ? "action.hover"
                        : "transparent",
                  }}
                >
                  <Stack
                    direction={{
                      xs: "column",
                      md: "row",
                    }}
                    spacing={1.5}
                    justifyContent="space-between"
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        flexWrap="wrap"
                        useFlexGap
                        sx={{ mb: 0.75 }}
                      >
                        {getActionChip(item.action)}

                        <Chip
                          size="small"
                          label={`v${item.version || "1.0"}`}
                          variant="outlined"
                        />

                        {getStatusChip(item.status)}
                      </Stack>

                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{
                          wordBreak: "break-word",
                        }}
                      >
                        {item.title || "Untitled policy"}
                      </Typography>

                      {item.category && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Category: {item.category}
                        </Typography>
                      )}
                    </Box>

                    <Box
                      sx={{
                        minWidth: {
                          xs: "100%",
                          md: "190px",
                        },
                        textAlign: {
                          xs: "left",
                          md: "right",
                        },
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Changed on
                      </Typography>

                      <Typography
                        variant="body2"
                        fontWeight={600}
                      >
                        {formatDate(item.createdAt)}
                      </Typography>
                    </Box>
                  </Stack>

                  {item.effectiveDate && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      sx={{ mt: 1 }}
                    >
                      Effective date:{" "}
                      {formatDate(item.effectiveDate)}
                    </Typography>
                  )}
                </Box>
              ))}
            </Stack>
          )}
      </Paper>

      {/* ==================================================
          BOTTOM ACTIONS
      ================================================== */}

      <Paper
        elevation={0}
        sx={{
          p: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={1.5}
          justifyContent="space-between"
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate("/admin/policies")}
            sx={{
              textTransform: "none",
            }}
          >
            Back
          </Button>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1.5}
          >
            <Button
              variant="outlined"
              color="primary"
              startIcon={<PreviewRoundedIcon />}
              onClick={handlePreview}
              sx={{
                textTransform: "none",
              }}
            >
              Preview
            </Button>

            <Button
              variant="contained"
              startIcon={<SaveRoundedIcon />}
              onClick={handleSave}
              disabled={
                saving ||
                publishing ||
                unpublishing
              }
              sx={{
                textTransform: "none",
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>

            {policy.status === "published" ? (
              <Button
                variant="outlined"
                color="warning"
                startIcon={<UnpublishedRoundedIcon />}
                onClick={handleUnpublish}
                disabled={
                  saving ||
                  publishing ||
                  unpublishing
                }
                sx={{
                  textTransform: "none",
                }}
              >
                {unpublishing
                  ? "Unpublishing..."
                  : "Unpublish"}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="success"
                startIcon={<PublishRoundedIcon />}
                onClick={handlePublish}
                disabled={
                  form.requiresLegalReview ||
                  saving ||
                  publishing ||
                  unpublishing
                }
                sx={{
                  textTransform: "none",
                }}
              >
                {publishing
                  ? "Publishing..."
                  : "Publish Policy"}
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};

export default EditPolicy;