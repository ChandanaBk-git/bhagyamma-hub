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
      elevation={0}
      sx={{
        width: "100%",

        mb: {
          xs: 1,
          sm: 1.5,
          md: 2,
        },

        borderRadius: 0,

        border: "1px solid #E0E0E0",

        boxShadow: "none",

        backgroundColor: "#FFFFFF",

        overflow: "hidden",
      }}
    >

      <CardContent
        sx={{
          p: {
            xs: "9px",
            sm: "12px",
            md: "15px",
          },

          "&:last-child": {
            pb: {
              xs: "9px",
              sm: "12px",
              md: "15px",
            },
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

            alignItems: "center",

            gap: 1,

            mb: {
              xs: "8px",
              sm: "10px",
              md: "12px",
            },

            minWidth: 0,
          }}
        >

          <Typography
            fontWeight={600}
            sx={{
              fontSize: {
                xs: "14px",
                sm: "16px",
                md: "18px",
              },

              lineHeight: 1.2,

              color: "#292929",
            }}
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
            sx={{
              height: {
                xs: "21px",
                sm: "23px",
              },

              borderRadius: 0,

              fontSize: {
                xs: "8px",
                sm: "9px",
                md: "10px",
              },

              fontWeight: 600,

              flexShrink: 0,

              "& .MuiChip-label": {
                px: {
                  xs: "5px",
                  sm: "6px",
                },
              },
            }}
          />

        </Box>


        {/* ===============================================
            PERCENTAGE
        ================================================ */}

        <Typography
          color="success.main"
          fontWeight={700}
          sx={{
            fontSize: {
              xs: "25px",
              sm: "30px",
              md: "34px",
            },

            lineHeight: 1,

            mb: {
              xs: "7px",
              sm: "9px",
            },
          }}
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
            height: {
              xs: 5,
              sm: 6,
            },

            borderRadius: 0,

            mb: {
              xs: "8px",
              sm: "10px",
              md: "12px",
            },

            backgroundColor: "#EEEEEE",

            "& .MuiLinearProgress-bar": {
              borderRadius: 0,
            },
          }}
        />


        {/* ===============================================
            SECTION STATUS
        ================================================ */}

        <List
          disablePadding
          sx={{
            width: "100%",
          }}
        >

          {checks.map((item) => (

            <ListItem
              key={item.label}
              disableGutters
              sx={{
                py: {
                  xs: "5px",
                  sm: "6px",
                },

                minHeight: {
                  xs: 34,
                  sm: 38,
                },

                gap: {
                  xs: "5px",
                  sm: "7px",
                },
              }}
            >

              <ListItemIcon
                sx={{
                  minWidth: {
                    xs: 22,
                    sm: 26,
                  },

                  width: {
                    xs: 22,
                    sm: 26,
                  },

                  display: "flex",

                  alignItems: "center",

                  justifyContent: "center",

                  "& svg": {
                    fontSize: {
                      xs: 17,
                      sm: 19,
                    },
                  },
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

                  fontSize: {
                    xs: "9px",
                    sm: "10px",
                    md: "11px",
                  },

                  lineHeight: 1.2,
                }}

                sx={{
                  minWidth: 0,

                  m: 0,
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
                sx={{
                  height: {
                    xs: "20px",
                    sm: "22px",
                  },

                  borderRadius: 0,

                  fontSize: {
                    xs: "7px",
                    sm: "8px",
                    md: "9px",
                  },

                  flexShrink: 0,

                  "& .MuiChip-label": {
                    px: {
                      xs: "4px",
                      sm: "5px",
                    },
                  },
                }}
              />

            </ListItem>

          ))}

        </List>


        {/* ===============================================
            COMPLETION MESSAGE
        ================================================ */}

        {percentage !== 100 && (

          <Box
            mt={{
              xs: 1,
              sm: 1.25,
            }}
            sx={{
              p: {
                xs: "7px",
                sm: "9px",
              },

              borderRadius: 0,

              border: "1px solid #E0E0E0",

              backgroundColor: "#F1F8E9",
            }}
          >

            <Typography
              color="text.secondary"
              sx={{
                fontSize: {
                  xs: "8px",
                  sm: "9px",
                  md: "10px",
                },

                lineHeight: 1.3,
              }}
            >
              Complete the remaining sections
              to reach 100% profile completion.
            </Typography>

          </Box>

        )}


        {percentage === 100 && (

          <Box
            mt={{
              xs: 1,
              sm: 1.25,
            }}
            sx={{
              p: {
                xs: "7px",
                sm: "9px",
              },

              borderRadius: 0,

              border: "1px solid #E0E0E0",

              backgroundColor: "#F1F8E9",
            }}
          >

            <Typography
              color="success.main"
              fontWeight={600}
              sx={{
                fontSize: {
                  xs: "8px",
                  sm: "9px",
                  md: "10px",
                },

                lineHeight: 1.3,
              }}
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