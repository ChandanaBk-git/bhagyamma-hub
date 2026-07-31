import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";

const Profile = () => {

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  return (
    <Box>

      <Typography
        variant="h4"
        mb={3}
        fontWeight="bold"
      >
        My Profile
      </Typography>

      <Card>

        <CardContent>

          <Box textAlign="center">

            <Avatar
              sx={{
                width: 90,
                height: 90,
                margin: "auto",
                bgcolor: "#1976d2",
              }}
            >
              <PersonIcon sx={{ fontSize: 50 }} />
            </Avatar>

            <Typography
              variant="h5"
              mt={2}
            >
              {user.name}
            </Typography>

            <Typography color="text.secondary">
              {user.role}
            </Typography>

          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3}>

            <Grid item xs={12} md={6}>
              <Typography fontWeight="bold">
                User ID
              </Typography>

              <Typography>
                {user.userId}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography fontWeight="bold">
                Email
              </Typography>

              <Typography>
                {user.email}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography fontWeight="bold">
                Mobile
              </Typography>

              <Typography>
                {user.mobile}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography fontWeight="bold">
                Referral Code
              </Typography>

              <Typography>
                {user.referralCode}
              </Typography>
            </Grid>

          </Grid>

        </CardContent>

      </Card>

    </Box>
  );
};

export default Profile;