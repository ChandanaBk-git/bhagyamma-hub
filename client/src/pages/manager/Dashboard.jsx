import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import TodayIcon from "@mui/icons-material/Today";

import { useNavigate } from "react-router-dom";
import { getDashboard } from "../../services/manager.service";

const Dashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    totalMembers: 0,
    totalLayers: 0,
    recentMembers: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await getDashboard();

      console.log("Dashboard Response:", response);

      if (response.success) {
        setDashboard(response.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <PeopleIcon color="primary" sx={{ fontSize: 42 }} />

              <Typography mt={2}>Total Members</Typography>

              <Typography variant="h4" fontWeight="bold">
                {dashboard.totalMembers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <AccountTreeIcon color="success" sx={{ fontSize: 42 }} />

              <Typography mt={2}>Referral Levels</Typography>

              <Typography variant="h4" fontWeight="bold">
                {dashboard.totalLayers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <TodayIcon color="warning" sx={{ fontSize: 42 }} />

              <Typography mt={2}>Recent Members</Typography>

              <Typography variant="h4" fontWeight="bold">
                {dashboard.recentMembers.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mt: 5, borderRadius: 3 }}>
        <Box p={2}>
          <Typography variant="h6" fontWeight="bold">
            Recent Members
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Referral Code</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {dashboard.recentMembers.length > 0 ? (
                dashboard.recentMembers.map((member) => (
                  <TableRow key={member._id}>
                    <TableCell>{member.userId}</TableCell>

                    <TableCell>{member.name}</TableCell>

                    <TableCell>{member.referralCode}</TableCell>

                    <TableCell>
                      {new Date(member.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate("/manager/members")}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={5}>
                    No Members Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Dashboard;