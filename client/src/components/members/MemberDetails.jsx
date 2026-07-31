import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  Chip,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { getMemberById } from "../../services/admin.service";

const MemberDetails = () => {
  const { id } = useParams();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMember();
  }, []);

  const fetchMember = async () => {
    try {
      const response = await getMemberById(id);
      setMember(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to load member."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;

  if (error)
    return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" mb={3}>
        Member Details
      </Typography>

      <Paper sx={{ p: 4 }}>

        <Grid container spacing={3}>

          <Grid item xs={12} md={6}>
            <Typography><b>User ID</b></Typography>
            <Typography>{member.userId}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography><b>Name</b></Typography>
            <Typography>{member.name}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography><b>Email</b></Typography>
            <Typography>{member.email}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography><b>Mobile</b></Typography>
            <Typography>{member.mobile}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography><b>Referral Code</b></Typography>
            <Typography>{member.referralCode}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography><b>Sponsor ID</b></Typography>
            <Typography>{member.sponsorId || "-"}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography><b>Role</b></Typography>
            <Typography>{member.role}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography><b>Layer</b></Typography>
            <Typography>{member.layer || 1}</Typography>
          </Grid>

        </Grid>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>

          <Grid item xs={12} md={4}>
            <Typography><b>Payment Status</b></Typography>

            <Chip
              label={member.paymentStatus}
              color={
                member.paymentStatus === "Completed"
                  ? "success"
                  : "warning"
              }
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography><b>KYC Status</b></Typography>

            <Chip
              label={member.kycStatus}
              color={
                member.kycStatus === "Verified"
                  ? "success"
                  : "warning"
              }
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography><b>Welcome Kit</b></Typography>

            <Chip
              label={member.welcomeKitStatus}
              color={
                member.welcomeKitStatus === "Delivered"
                  ? "success"
                  : "warning"
              }
            />
          </Grid>

        </Grid>

      </Paper>
    </Container>
  );
};

export default MemberDetails;