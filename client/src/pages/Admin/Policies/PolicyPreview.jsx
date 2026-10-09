import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

import { getAdminPolicy } from "../../../services/adminPolicy.service";

const PolicyPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPolicy = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAdminPolicy(id);

        setPolicy(response.policy);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load policy"
        );
      } finally {
        setLoading(false);
      }
    };

    loadPolicy();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!policy) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">
          {error || "Policy not found"}
        </Alert>

        <Button
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() =>
            navigate("/admin/policies")
          }
          sx={{
            mt: 2,
            textTransform: "none",
          }}
        >
          Back to Policies
        </Button>
      </Box>
    );
  }

  const renderContent = (content) => {
    const lines = content.split("\n");

    return lines.map((line, index) => {
      const trimmed = line.trim();

      if (!trimmed) {
        return (
          <Box
            key={index}
            sx={{ height: 12 }}
          />
        );
      }

      if (trimmed.startsWith("# ")) {
        return (
          <Typography
            key={index}
            variant="h4"
            fontWeight={800}
            sx={{ mt: 2, mb: 2 }}
          >
            {trimmed.replace("# ", "")}
          </Typography>
        );
      }

      if (trimmed.startsWith("## ")) {
        return (
          <Typography
            key={index}
            variant="h6"
            fontWeight={800}
            sx={{
              mt: 3,
              mb: 1,
            }}
          >
            {trimmed.replace("## ", "")}
          </Typography>
        );
      }

      if (trimmed.startsWith("### ")) {
        return (
          <Typography
            key={index}
            variant="subtitle1"
            fontWeight={700}
            sx={{
              mt: 2,
              mb: 1,
            }}
          >
            {trimmed.replace("### ", "")}
          </Typography>
        );
      }

      if (trimmed.startsWith("- ")) {
        return (
          <Box
            key={index}
            sx={{
              display: "flex",
              gap: 1,
              mb: 0.8,
              pl: 1,
            }}
          >
            <Typography>•</Typography>

            <Typography
              variant="body1"
              sx={{ lineHeight: 1.7 }}
            >
              {trimmed.replace("- ", "")}
            </Typography>
          </Box>
        );
      }

      if (trimmed.includes("[LEGAL REVIEW REQUIRED]")) {
        return (
          <Alert
            key={index}
            severity="warning"
            sx={{ my: 2 }}
          >
            Legal review is required for this policy.
          </Alert>
        );
      }

      if (trimmed.includes("[TO CONFIRM")) {
        return (
          <Alert
            key={index}
            severity="info"
            sx={{ my: 1.5 }}
          >
            {trimmed}
          </Alert>
        );
      }

      return (
        <Typography
          key={index}
          variant="body1"
          sx={{
            lineHeight: 1.8,
            mb: 1,
          }}
        >
          {trimmed}
        </Typography>
      );
    });
  };

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >
      {/* HEADER */}

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          sm: "center",
        }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Button
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() =>
              navigate("/admin/policies")
            }
            sx={{
              textTransform: "none",
              mb: 1,
            }}
          >
            Back to Policies
          </Button>

          <Typography
            variant="h5"
            fontWeight={800}
          >
            Policy Preview
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Customer-facing preview
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<EditRoundedIcon />}
          onClick={() =>
            navigate(`/admin/policies/${id}`)
          }
          sx={{
            bgcolor: "#2e7d32",
            textTransform: "none",
            "&:hover": {
              bgcolor: "#1b5e20",
            },
          }}
        >
          Edit Policy
        </Button>
      </Stack>

      {/* DRAFT WARNING */}

      {policy.status !== "published" && (
        <Alert
          severity="warning"
          sx={{ mb: 2 }}
        >
          This is a preview only. This policy is not
          currently published on the public website.
        </Alert>
      )}

      {policy.requiresLegalReview && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
        >
          Legal review is still required. Do not
          publish this policy until the review is
          completed.
        </Alert>
      )}

      {/* POLICY */}

      <Paper
        elevation={0}
        sx={{
          maxWidth: 1000,
          mx: "auto",
          borderRadius: 3,
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        {/* POLICY HEADER */}

        <Box
          sx={{
            p: {
              xs: 3,
              sm: 4,
            },
            backgroundColor: "#fafafa",
          }}
        >
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            justifyContent="space-between"
            alignItems={{
              xs: "flex-start",
              sm: "center",
            }}
            spacing={2}
          >
            <Box>
              <Typography
                variant="overline"
                color="text.secondary"
              >
                {policy.category}
              </Typography>

              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  mt: 0.5,
                  wordBreak: "break-word",
                }}
              >
                {policy.title}
              </Typography>
            </Box>

            <Chip
              label={
                policy.status === "published"
                  ? "Published"
                  : "Draft"
              }
              color={
                policy.status === "published"
                  ? "success"
                  : "warning"
              }
            />
          </Stack>

          <Stack
            direction="row"
            flexWrap="wrap"
            gap={2}
            mt={2}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Version:{" "}
              <strong>{policy.version}</strong>
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Slug:{" "}
              <strong>{policy.slug}</strong>
            </Typography>

            {policy.effectiveDate && (
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Effective:{" "}
                <strong>
                  {new Date(
                    policy.effectiveDate
                  ).toLocaleDateString()}
                </strong>
              </Typography>
            )}
          </Stack>
        </Box>

        <Divider />

        {/* CONTENT */}

        <Box
          sx={{
            p: {
              xs: 3,
              sm: 4,
              md: 5,
            },
          }}
        >
          {renderContent(policy.content)}
        </Box>
      </Paper>
    </Box>
  );
};

export default PolicyPreview;