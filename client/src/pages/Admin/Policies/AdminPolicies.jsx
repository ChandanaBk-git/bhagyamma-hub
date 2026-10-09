
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import { getAdminPolicies } from "../../../services/adminPolicy.service";

const AdminPolicies = () => {
  const navigate = useNavigate();

  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminPolicies();

      setPolicies(response.policies || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load policies"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const filteredPolicies = policies.filter((policy) => {
    const query = search.toLowerCase();

    return (
      policy.title?.toLowerCase().includes(query) ||
      policy.category?.toLowerCase().includes(query) ||
      policy.slug?.toLowerCase().includes(query)
    );
  });

  const draftCount = policies.filter(
    (p) => p.status === "draft"
  ).length;

  const publishedCount = policies.filter(
    (p) => p.status === "published"
  ).length;

  const archivedCount = policies.filter(
    (p) => p.status === "archived"
  ).length;

  const statusColor = (status) => {
    if (status === "published") return "success";
    if (status === "archived") return "default";
    return "warning";
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={800}
            color="#263238"
          >
            Policy Management
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            mt={0.5}
          >
            Manage Bhagyamma Hub website policies
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshRoundedIcon />}
          onClick={fetchPolicies}
          disabled={loading}
          sx={{ textTransform: "none" }}
        >
          Refresh
        </Button>
      </Stack>

      {/* SUMMARY CARDS */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {[
          {
            label: "Total Policies",
            value: policies.length,
            color: "#1976d2",
          },
          {
            label: "Drafts",
            value: draftCount,
            color: "#ed6c02",
          },
          {
            label: "Published",
            value: publishedCount,
            color: "#2e7d32",
          },
        ].map((item) => (
          <Paper
            key={item.label}
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: "1px solid #e5e7eb",
              borderLeft: `5px solid ${item.color}`,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {item.label}
            </Typography>

            <Typography
              variant="h4"
              fontWeight={800}
              sx={{ color: item.color, mt: 1 }}
            >
              {item.value}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* SEARCH */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 3,
          border: "1px solid #e5e7eb",
          mb: 2,
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search by policy title, category or slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* POLICY TABLE */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: "1px solid #e5e7eb",
          borderRadius: 3,
          overflowX: "auto",
        }}
      >
        <Table sx={{ minWidth: 750 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f7fa" }}>
              <TableCell><b>Policy</b></TableCell>
              <TableCell><b>Category</b></TableCell>
              <TableCell><b>Version</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Legal Review</b></TableCell>
              <TableCell align="center"><b>Action</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress size={28} sx={{ my: 3 }} />
                </TableCell>
              </TableRow>
            ) : filteredPolicies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No policies found
                </TableCell>
              </TableRow>
            ) : (
              filteredPolicies.map((policy) => (
                <TableRow
                  key={policy._id}
                  hover
                >
                  <TableCell>
                    <Typography fontWeight={700}>
                      {policy.title}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {policy.slug}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    {policy.category}
                  </TableCell>

                  <TableCell>
                    {policy.version}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={policy.status}
                      color={statusColor(policy.status)}
                      size="small"
                      sx={{ textTransform: "capitalize" }}
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={
                        policy.requiresLegalReview
                          ? "Required"
                          : "Cleared"
                      }
                      color={
                        policy.requiresLegalReview
                          ? "warning"
                          : "success"
                      }
                      size="small"
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<EditRoundedIcon />}
                      onClick={() =>
                        navigate(
                          `/admin/policies/${policy._id}`
                        )
                      }
                      sx={{
                        bgcolor: "#2e7d32",
                        textTransform: "none",
                        "&:hover": {
                          bgcolor: "#1b5e20",
                        },
                      }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        mt={2}
      >
        Archived policies: {archivedCount}
      </Typography>
    </Box>
  );
};

export default AdminPolicies;
