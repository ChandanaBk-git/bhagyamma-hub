import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        setError("Admin session not found.");
        return;
      }

      const parsedUser =
        JSON.parse(storedUser);

      setUser(parsedUser);
    } catch (err) {
      console.error(
        "Admin profile error:",
        err
      );

      setError(
        "Unable to load admin profile."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography
        variant="h4"
        fontWeight={700}
        mb={1}
      >
        Admin Profile
      </Typography>

      <Typography
        color="text.secondary"
        mb={4}
      >
        View your administrator account information.
      </Typography>

      <Card
        sx={{
          borderRadius: 4,
          boxShadow: 3,
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Typography
            variant="h5"
            fontWeight={700}
            mb={3}
          >
            Account Information
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Full Name
              </Typography>

              <Typography
                fontWeight={600}
                mt={0.5}
              >
                {user?.name || "Admin"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                User ID
              </Typography>

              <Typography
                fontWeight={600}
                mt={0.5}
              >
                {user?.userId || "-"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Email
              </Typography>

              <Typography
                fontWeight={600}
                mt={0.5}
              >
                {user?.email || "-"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Mobile Number
              </Typography>

              <Typography
                fontWeight={600}
                mt={0.5}
              >
                {user?.mobile || "-"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Role
              </Typography>

              <Typography
                fontWeight={600}
                mt={0.5}
              >
                {user?.role || "ADMIN"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Status
              </Typography>

              <Typography
                fontWeight={600}
                mt={0.5}
              >
                {user?.isActive === false
                  ? "Inactive"
                  : "Active"}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;