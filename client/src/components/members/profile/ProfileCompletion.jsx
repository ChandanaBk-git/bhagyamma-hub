import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from "@mui/material";

import {
  CheckCircle,
  Cancel,
} from "@mui/icons-material";

const ProfileCompletion = ({ user = {} }) => {
  // =====================================================
  // CHECK PERSONAL INFORMATION
  // =====================================================

  const personalCompleted = Boolean(
    user.name &&
    user.mobile &&
    user.email &&
    user.gender &&
    user.dateOfBirth
  );

  // =====================================================
  // CHECK ADDRESS INFORMATION
  // =====================================================

  const addressCompleted = Boolean(
    user.address &&
    user.city &&
    user.state &&
    user.pincode &&
    user.country
  );

  // =====================================================
  // CHECK BANK INFORMATION
  // =====================================================

  const bankCompleted = Boolean(
    user.bankName &&
    user.accountHolderName &&
    user.accountNumber &&
    user.ifscCode &&
    user.branch
  );

  // =====================================================
  // CHECK KYC INFORMATION
  // =====================================================

  const kycCompleted = Boolean(
    user.aadhaarNumber &&
    user.panNumber
  );

  // =====================================================
  // PROFILE CHECKS
  // =====================================================

  const checks = [
    {
      label: "Personal Information",
      completed: personalCompleted,
    },

    {
      label: "Address Information",
      completed: addressCompleted,
    },

    {
      label: "Bank Information",
      completed: bankCompleted,
    },

    {
      label: "KYC Information",
      completed: kycCompleted,
    },
  ];

  // =====================================================
  // CALCULATE COMPLETION
  // =====================================================

  const completedSections = checks.filter(
    (item) => item.completed
  ).length;

  const percentage = Math.round(
    (completedSections / checks.length) * 100
  );

  // =====================================================
  // STATUS TEXT
  // =====================================================

  const getStatusText = () => {
    if (percentage === 100) {
      return "Profile completed";
    }

    if (percentage >= 75) {
      return "Almost complete";
    }

    if (percentage >= 50) {
      return "Profile is halfway complete";
    }

    if (percentage >= 25) {
      return "Complete more information";
    }

    return "Profile needs information";
  };

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 4,
        mb: 3,
        width: "100%",
      }}
    >
      <CardContent
        sx={{
          p: {
            xs: 2,
            sm: 3,
          },
        }}
      >
        {/* ===============================================
            HEADER
        ================================================ */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            gap: 1,
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
          >
            Profile Completion
          </Typography>

          <Chip
            size="small"
            label={getStatusText()}
            color={
              percentage === 100
                ? "success"
                : "warning"
            }
          />
        </Box>

        {/* ===============================================
            PERCENTAGE
        ================================================ */}

        <Typography
          variant="h3"
          color="success.main"
          fontWeight="bold"
          mb={2}
        >
          {percentage}%
        </Typography>

        {/* ===============================================
            PROGRESS BAR
        ================================================ */}

        <LinearProgress
          variant="determinate"
          value={percentage}
          color="success"
          sx={{
            height: 12,
            borderRadius: 5,
            mb: 3,
          }}
        />

        {/* ===============================================
            SECTION STATUS
        ================================================ */}

        <List disablePadding>
          {checks.map((item) => (
            <ListItem
              key={item.label}
              disableGutters
              sx={{
                py: 1,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                }}
              >
                {item.completed ? (
                  <CheckCircle
                    color="success"
                  />
                ) : (
                  <Cancel
                    color="error"
                  />
                )}
              </ListItemIcon>

              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: 500,
                }}
              />

              <Chip
                size="small"
                label={
                  item.completed
                    ? "Complete"
                    : "Incomplete"
                }
                color={
                  item.completed
                    ? "success"
                    : "error"
                }
                variant="outlined"
              />
            </ListItem>
          ))}
        </List>

        {/* ===============================================
            COMPLETION MESSAGE
        ================================================ */}

        {percentage !== 100 && (
          <Box
            mt={2}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor:
                "success.50",
            }}
          >
            <Typography
              color="text.secondary"
              variant="body2"
            >
              Complete the remaining sections
              to reach 100% profile completion.
            </Typography>
          </Box>
        )}

        {percentage === 100 && (
          <Box
            mt={2}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor:
                "success.50",
            }}
          >
            <Typography
              color="success.main"
              fontWeight={600}
              variant="body2"
            >
              Your profile is completely filled.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCompletion;