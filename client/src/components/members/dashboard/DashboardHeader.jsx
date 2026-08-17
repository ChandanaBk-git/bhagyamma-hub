import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
} from "@mui/material";

import {
  WorkspacePremium,
  Badge,
} from "@mui/icons-material";

const DashboardHeader = ({ user, summary }) => {
  const rank =
    summary?.currentRank || "MEMBER";

  return (
    <Card
      elevation={0}
      sx={{
        mb: 3,
        borderRadius: 4,
        background:
          "linear-gradient(135deg,#2E7D32,#43A047)",
        color: "#fff",
      }}
    >
      <CardContent sx={{ p: 4 }}>

        <Grid
          container
          spacing={3}
          alignItems="center"
        >

          <Grid item>

            <Avatar
              sx={{
                width: 75,
                height: 75,
                bgcolor: "#fff",
                color: "#2E7D32",
                fontSize: 32,
                fontWeight: "bold",
              }}
            >
              {user?.name?.charAt(0) || "M"}
            </Avatar>

          </Grid>

          <Grid item xs>

            <Typography
              variant="h5"
              fontWeight="bold"
            >
              Welcome,
              {" "}
              {user?.name || "Member"}
            </Typography>

            <Typography sx={{ opacity: .9 }}>
              Member ID :
              {" "}
              {user?.userId || "--"}
            </Typography>

            <Box
              mt={2}
              display="flex"
              gap={1}
              flexWrap="wrap"
            >

              <Chip
                icon={<WorkspacePremium />}
                label={rank}
                sx={{
                  bgcolor: "#fff",
                  color: "#2E7D32",
                  fontWeight: "bold",
                }}
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
                    ? "success"
                    : "error"
                }
              />

            </Box>

          </Grid>

          <Grid item>

            <Box textAlign="right">

              <Typography
                variant="body2"
                sx={{
                  opacity: .85,
                }}
              >
                Wallet Balance
              </Typography>

              <Typography
                variant="h4"
                fontWeight="bold"
              >
                ₹
                {summary?.walletBalance || 0}
              </Typography>

            </Box>

          </Grid>

        </Grid>

      </CardContent>
    </Card>
  );
};

export default DashboardHeader;