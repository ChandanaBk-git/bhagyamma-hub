
import { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Breadcrumbs,
  CircularProgress,
  Container,
  Divider,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import API from "../../api";

const GREEN = "#1b5e20";

const extractPolicy = (response) => {
  const data = response?.data;

  if (data?.policy) return data.policy;
  if (data?.data?.policy) return data.data.policy;

  if (data && typeof data === "object" && data.slug) {
    return data;
  }

  return null;
};

const extractPolicies = (response) => {
  const data = response?.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.policies)) return data.policies;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.policies)) return data.data.policies;

  return [];
};

const isPublished = (policy) =>
  String(policy?.status || "").toLowerCase() === "published";

function PolicyContent({ content }) {
  if (typeof content !== "string" || !content.trim()) {
    return (
      <Alert severity="info">
        The policy content is not available. Please check that the complete
        content has been saved and published in the admin dashboard.
      </Alert>
    );
  }

  const lines = content.replace(/\r\n/g, "\n").split("\n");

  return (
    <Box
      sx={{
        minWidth: 0,
        overflowWrap: "anywhere",
        "& p": { lineHeight: 1.85 },
      }}
    >
      {lines.map((line, index) => {
        const text = line.trim();

        if (!text) {
          return <Box key={index} sx={{ height: 8 }} />;
        }

        if (/^###\s/.test(text)) {
          return (
            <Typography
              key={index}
              component="h3"
              sx={{
                mt: 2.5,
                mb: 1,
                fontSize: { xs: "1rem", sm: "1.08rem" },
                fontWeight: 700,
                lineHeight: 1.5,
              }}
            >
              {text.replace(/^###\s/, "")}
            </Typography>
          );
        }

        if (/^##\s/.test(text)) {
          return (
            <Typography
              key={index}
              component="h2"
              sx={{
                mt: 3,
                mb: 1.2,
                fontSize: { xs: "1.05rem", sm: "1.2rem" },
                fontWeight: 750,
                lineHeight: 1.5,
              }}
            >
              {text.replace(/^##\s/, "")}
            </Typography>
          );
        }

        if (/^#\s/.test(text)) {
          return (
            <Typography
              key={index}
              component="h2"
              sx={{
                mt: 1,
                mb: 2,
                fontSize: { xs: "1.2rem", sm: "1.55rem" },
                fontWeight: 800,
                lineHeight: 1.4,
              }}
            >
              {text.replace(/^#\s/, "")}
            </Typography>
          );
        }

        if (/^[-•]\s/.test(text)) {
          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1,
                mb: 1,
                pl: { xs: 0, sm: 1 },
              }}
            >
              <Typography
                component="span"
                sx={{ color: GREEN, fontWeight: 800 }}
              >
                •
              </Typography>

              <Typography
                component="span"
                sx={{
                  flex: 1,
                  minWidth: 0,
                  fontSize: { xs: "0.9rem", sm: "0.98rem" },
                  lineHeight: 1.8,
                }}
              >
                {text.replace(/^[-•]\s/, "")}
              </Typography>
            </Box>
          );
        }

        return (
          <Typography
            key={index}
            component="p"
            sx={{
              my: 0.8,
              fontSize: { xs: "0.9rem", sm: "0.98rem" },
              lineHeight: 1.85,
              overflowWrap: "anywhere",
              whiteSpace: "pre-wrap",
            }}
          >
            {text}
          </Typography>
        );
      })}
    </Box>
  );
}

export default function PolicyPage() {
  const { slug } = useParams();

  const [policies, setPolicies] = useState([]);
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadPage = async () => {
      setLoading(true);
      setError("");
      setPolicy(null);

      try {
        // Load public policies.
        const listResponse = await API.get("/policies");
        const items = extractPolicies(listResponse);

        if (!active) return;

        const published = items.filter(isPublished);
        setPolicies(published);

        // The main policies page displays the published policy list.
        if (!slug) {
          setLoading(false);
          return;
        }

        // Use the list entry if it contains the complete content.
        const matchingPolicy = published.find(
          (item) => item.slug === slug
        );

        if (
          matchingPolicy &&
          typeof matchingPolicy.content === "string" &&
          matchingPolicy.content.trim()
        ) {
          setPolicy(matchingPolicy);
          setLoading(false);
          return;
        }

        // Otherwise, request the individual policy by its slug.
        const detailResponse = await API.get(
          `/policies/${encodeURIComponent(slug)}`
        );

        if (!active) return;

        const detailPolicy = extractPolicy(detailResponse);

        if (detailPolicy && isPublished(detailPolicy)) {
          setPolicy(detailPolicy);
        } else {
          setError(
            "This policy was not found or has not been published."
          );
        }
      } catch (err) {
        if (!active) return;

        console.error("PUBLIC POLICY LOAD ERROR:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load this policy. Please check the public policy API."
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    loadPage();

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "55vh",
          display: "grid",
          placeItems: "center",
          px: 2,
        }}
      >
        <CircularProgress sx={{ color: GREEN }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "55vh",
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        bgcolor: "#f7f9f7",
        py: { xs: 2.5, sm: 4, md: 5 },
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          px: { xs: 2, sm: 3 },
          boxSizing: "border-box",
        }}
      >
        <Breadcrumbs
          separator="/"
          sx={{
            mb: { xs: 2, sm: 2.5 },
            fontSize: { xs: "0.75rem", sm: "0.88rem" },
            overflowWrap: "anywhere",
          }}
        >
          <Link
            component={RouterLink}
            to="/"
            color="inherit"
            underline="hover"
          >
            Home
          </Link>

          <Link
            component={RouterLink}
            to="/policies"
            color="inherit"
            underline="hover"
          >
            Policies
          </Link>

          {policy && (
            <Typography
              color="text.primary"
              sx={{
                fontSize: "inherit",
                overflowWrap: "anywhere",
              }}
            >
              {policy.title}
            </Typography>
          )}
        </Breadcrumbs>

        {error && (
          <Alert severity="error" sx={{ mb: 2.5 }}>
            {error}
          </Alert>
        )}

        {!slug ? (
          <Box>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "1.6rem", sm: "2rem" },
                fontWeight: 800,
                mb: 1,
              }}
            >
              Our Policies
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mb: 3, fontSize: { xs: "0.9rem", sm: "1rem" } }}
            >
              View Bhagyamma Hub policies and customer information.
            </Typography>

            {policies.length === 0 ? (
              <Alert severity="info">
                No policies are currently published.
              </Alert>
            ) : (
              <Stack spacing={1.5}>
                {policies.map((item) => (
                  <Paper
                    key={item._id || item.id || item.slug}
                    variant="outlined"
                    sx={{
                      p: { xs: 2, sm: 2.5 },
                      borderRadius: 2,
                      bgcolor: "#fff",
                      transition: "border-color 0.2s",
                      "&:hover": { borderColor: GREEN },
                    }}
                  >
                    <Link
                      component={RouterLink}
                      to={`/policies/${item.slug}`}
                      underline="hover"
                      color="inherit"
                      sx={{
                        display: "block",
                        fontWeight: 700,
                        fontSize: { xs: "0.95rem", sm: "1.05rem" },
                        overflowWrap: "anywhere",
                      }}
                    >
                      {item.title}
                    </Link>

                    {item.category && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {item.category}
                      </Typography>
                    )}
                  </Paper>
                ))}
              </Stack>
            )}
          </Box>
        ) : policy ? (
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              minWidth: 0,
              boxSizing: "border-box",
              p: { xs: 2, sm: 3.5, md: 4 },
              border: "1px solid #e2e8e2",
              borderRadius: { xs: 2.5, sm: 3 },
              bgcolor: "#fff",
              overflow: "hidden",
            }}
          >
            <Typography
              variant="overline"
              sx={{
                color: GREEN,
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              {policy.category || "POLICY"}
            </Typography>

            <Typography
              component="h1"
              sx={{
                fontSize: {
                  xs: "1.45rem",
                  sm: "1.9rem",
                  md: "2.1rem",
                },
                fontWeight: 800,
                lineHeight: 1.3,
                mt: 0.5,
                mb: 2,
                overflowWrap: "anywhere",
              }}
            >
              {policy.title}
            </Typography>

            <Divider sx={{ mb: 2.5 }} />

            <PolicyContent content={policy.content} />

            <Divider sx={{ mt: 3, mb: 2 }} />

            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              spacing={1}
            >
              {policy.version && (
                <Typography variant="caption" color="text.secondary">
                  Version: {policy.version}
                </Typography>
              )}

              {policy.updatedAt && (
                <Typography variant="caption" color="text.secondary">
                  Last updated:{" "}
                  {new Date(policy.updatedAt).toLocaleDateString("en-IN")}
                </Typography>
              )}
            </Stack>

            <Link
              component={RouterLink}
              to="/policies"
              underline="hover"
              sx={{
                display: "inline-block",
                mt: 3,
                color: GREEN,
                fontWeight: 700,
              }}
            >
              ← Back to all policies
            </Link>
          </Paper>
        ) : null}
      </Container>
    </Box>
  );
}
