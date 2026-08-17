import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import {
  WorkspacePremium,
  Badge,
  CalendarMonth,
  Groups,
} from "@mui/icons-material";

const ProfileHeader = ({ user = {} }) => {

  return (

    <Card
      elevation={2}
      sx={{
        borderRadius: 4,
        mb: 3,
        overflow: "hidden",
      }}
    >

      <Box
        sx={{
          height: 120,
          background:
            "linear-gradient(135deg,#2E7D32,#43A047)",
        }}
      />

      <CardContent>

        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={3}
          sx={{
            mt: -8,
          }}
          alignItems={{
            xs: "center",
            md: "flex-end",
          }}
        >

          <Avatar
            sx={{
              width: 120,
              height: 120,
              bgcolor: "#fff",
              color: "#2E7D32",
              fontSize: 46,
              fontWeight: "bold",
              border: "5px solid white",
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "M"}
          </Avatar>

          <Box flex={1}>

            <Typography
              variant="h4"
              fontWeight="bold"
            >
              {user?.name || "-"}
            </Typography>

            <Typography
              color="text.secondary"
              mt={1}
            >
              {user?.userId}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              mt={2}
              flexWrap="wrap"
            >

              <Chip
                icon={<WorkspacePremium />}
                label={user?.role || "MEMBER"}
                color="success"
              />

              <Chip
                icon={<Badge />}
                label={
                  user?.isActive
                    ? "Active"
                    : "Inactive"
                }
                color={
                  user?.isActive
                    ? "primary"
                    : "error"
                }
              />

            </Stack>

          </Box>

        </Stack>

        <Divider sx={{ my: 3 }} />

        <Grid
          container
          spacing={3}
        >

          <Grid item xs={12} md={4}>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Email
            </Typography>

            <Typography fontWeight="bold">
              {user?.email || "-"}
            </Typography>

          </Grid>

          <Grid item xs={12} md={4}>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Mobile
            </Typography>

            <Typography fontWeight="bold">
              {user?.mobile || "-"}
            </Typography>

          </Grid>

          <Grid item xs={12} md={4}>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Joining Date
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >

              <CalendarMonth
                color="success"
                fontSize="small"
              />

              <Typography fontWeight="bold">
                {
                  user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "-"
                }
              </Typography>

            </Stack>

          </Grid>

          <Grid item xs={12} md={4}>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Referral Code
            </Typography>

            <Typography fontWeight="bold">
              {user?.referralCode || "-"}
            </Typography>

          </Grid>

          <Grid item xs={12} md={4}>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Sponsor
            </Typography>

            <Typography fontWeight="bold">
              {user?.sponsorId?.name || "-"}
            </Typography>

          </Grid>

          <Grid item xs={12} md={4}>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Network
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >

              <Groups
                color="success"
                fontSize="small"
              />

              <Typography fontWeight="bold">
                {user?.directMembers || 0} Direct Members
              </Typography>

            </Stack>

          </Grid>

        </Grid>

      </CardContent>

    </Card>

  );

};

export default ProfileHeader;