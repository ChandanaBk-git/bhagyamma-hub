import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Container,
  Alert,
  Typography,
} from "@mui/material";

import { getDashboard } from "../../services/admin.service";

import DashboardCards from "../../components/dashboard/DashboardCards";
import RecentMembers from "../../components/dashboard/RecentMembers";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState({
    totalMembers: 0,
    totalProducts: 0,
    totalLayers: 0,
    recentMembers: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const response = await getDashboard();

      console.log("Dashboard API:", response);
console.log("Dashboard Data:", response.data);

      console.log("Dashboard Response:", response);

      // Backend returns:
      // { success, message, data }
      setDashboard(response.data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <Typography
        variant="h4"
        fontWeight={700}
        gutterBottom
      >
        Admin Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <DashboardCards data={dashboard} />

      <RecentMembers
        members={dashboard.recentMembers}
      />
    </Container>
  );
};

export default Dashboard;