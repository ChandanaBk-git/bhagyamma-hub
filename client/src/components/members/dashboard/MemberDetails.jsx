import {
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  Box,
  Avatar,
} from "@mui/material";

import {
  Person,
  Phone,
  Email,
  Badge,
  CardGiftcard,
  CalendarMonth,
  Group,
} from "@mui/icons-material";

const MemberDetails = ({ user = {} }) => {
  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        mb: 3,
      }}
    >
      <CardContent>

        {/* Header */}

        <Box
          display="flex"
          alignItems="center"
          mb={3}
        >
          <Avatar
            sx={{
              width: 70,
              height: 70,
              bgcolor: "#2E7D32",
              mr: 2,
              fontSize: 30,
              fontWeight: "bold",
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "M"}
          </Avatar>

          <Box flex={1}>
            <Typography
              variant="h5"
              fontWeight="bold"
            >
              {user?.name || "-"}
            </Typography>

            <Typography color="text.secondary">
              {user?.userId || "-"}
            </Typography>
          </Box>

          <Chip
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

        <Grid container spacing={3}>

          {/* Mobile */}

          <Grid item xs={12} md={6}>
            <Box display="flex" gap={2}>
              <Phone color="success" />

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Mobile
                </Typography>

                <Typography fontWeight="500">
                  {user?.mobile || "-"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Email */}

          <Grid item xs={12} md={6}>
            <Box display="flex" gap={2}>
              <Email color="success" />

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Email
                </Typography>

                <Typography fontWeight="500">
                  {user?.email || "-"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Member ID */}

          <Grid item xs={12} md={6}>
            <Box display="flex" gap={2}>
              <Badge color="success" />

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Member ID
                </Typography>

                <Typography fontWeight="500">
                  {user?.userId || "-"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Referral Code */}

          <Grid item xs={12} md={6}>
            <Box display="flex" gap={2}>
              <CardGiftcard color="success" />

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Referral Code
                </Typography>

                <Typography fontWeight="500">
                  {user?.referralCode || "-"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Sponsor */}

          <Grid item xs={12} md={6}>
            <Box display="flex" gap={2}>
              <Group color="success" />

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Sponsor
                </Typography>

                <Typography fontWeight="500">
                  {user?.sponsorId?.name || "--"}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {user?.sponsorId?.userId || ""}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Joining Date */}

          <Grid item xs={12} md={6}>
            <Box display="flex" gap={2}>
              <CalendarMonth color="success" />

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Joining Date
                </Typography>

                <Typography fontWeight="500">
                  {user?.createdAt
                    ? new Date(
                        user.createdAt
                      ).toLocaleDateString()
                    : "-"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Payment Status */}

          <Grid item xs={12} md={6}>
            <Box display="flex" gap={2}>
              <Badge color="success" />

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Payment Status
                </Typography>

                <Chip
                  size="small"
                  label={
                    user?.paymentStatus ||
                    "Pending"
                  }
                  color={
                    user?.paymentStatus ===
                    "Paid"
                      ? "success"
                      : "warning"
                  }
                />
              </Box>
            </Box>
          </Grid>

          {/* Role */}

          <Grid item xs={12} md={6}>
            <Box display="flex" gap={2}>
              <Person color="success" />

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Role
                </Typography>

                <Typography fontWeight="500">
                  {user?.role || "MEMBER"}
                </Typography>
              </Box>
            </Box>
          </Grid>

        </Grid>

      </CardContent>
    </Card>
  );
};

export default MemberDetails;