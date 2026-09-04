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

      {/* TOP HEADER */}

      <Box
        sx={{
          height: {
            xs: 65,
            sm: 80,
            md: 95,
          },

          background:
            "linear-gradient(135deg,#2E7D32,#43A047)",
        }}
      />


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

        {/* PROFILE SUMMARY */}

        <Stack
          direction={{
            xs: "row",
            md: "row",
          }}
          spacing={{
            xs: 1,
            sm: 1.5,
            md: 2,
          }}
          sx={{
            mt: {
              xs: -4.5,
              sm: -5.5,
              md: -6.5,
            },

            minWidth: 0,
          }}
          alignItems="flex-end"
        >

          {/* AVATAR */}

          <Avatar
            sx={{
              width: {
                xs: 58,
                sm: 70,
                md: 82,
              },

              height: {
                xs: 58,
                sm: 70,
                md: 82,
              },

              bgcolor: "#FFFFFF",

              color: "#2E7D32",

              fontSize: {
                xs: 23,
                sm: 28,
                md: 34,
              },

              fontWeight: "bold",

              border: {
                xs: "3px solid white",
                sm: "4px solid white",
              },

              flexShrink: 0,
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "M"}
          </Avatar>


          {/* USER INFORMATION */}

          <Box
            sx={{
              flex: 1,

              minWidth: 0,

              pb: {
                xs: 0,
                sm: 0.25,
              },
            }}
          >

            <Typography
              fontWeight={700}
              sx={{
                fontSize: {
                  xs: "15px",
                  sm: "19px",
                  md: "23px",
                },

                lineHeight: 1.15,

                overflow: "hidden",

                textOverflow: "ellipsis",

                whiteSpace: "nowrap",

                color: "#292929",
              }}
            >
              {user?.name || "-"}
            </Typography>


            <Typography
              color="text.secondary"
              sx={{
                mt: "3px",

                fontSize: {
                  xs: "9px",
                  sm: "10px",
                  md: "11px",
                },

                lineHeight: 1.2,

                overflow: "hidden",

                textOverflow: "ellipsis",

                whiteSpace: "nowrap",
              }}
            >
              {user?.userId}
            </Typography>


            <Stack
              direction="row"
              spacing={0.5}
              mt={{
                xs: "5px",
                sm: "7px",
              }}
              flexWrap="wrap"
              useFlexGap
            >

              <Chip
                icon={<WorkspacePremium />}
                label={user?.role || "MEMBER"}
                color="success"
                size="small"
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

                  "& .MuiChip-icon": {
                    fontSize: {
                      xs: 13,
                      sm: 15,
                    },
                  },

                  "& .MuiChip-label": {
                    px: {
                      xs: "5px",
                      sm: "6px",
                    },
                  },
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
                    ? "primary"
                    : "error"
                }
                size="small"
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

                  "& .MuiChip-icon": {
                    fontSize: {
                      xs: 13,
                      sm: 15,
                    },
                  },

                  "& .MuiChip-label": {
                    px: {
                      xs: "5px",
                      sm: "6px",
                    },
                  },
                }}
              />

            </Stack>

          </Box>

        </Stack>


        <Divider
          sx={{
            my: {
              xs: "10px",
              sm: "12px",
              md: "15px",
            },
          }}
        />


        {/* PROFILE DETAILS */}

        <Grid
          container
          spacing={{
            xs: 1,
            sm: 1.5,
            md: 2,
          }}
        >

          {/* EMAIL */}

          <Grid
            item
            xs={6}
            md={4}
          >

            <Typography
              color="text.secondary"
              sx={{
                fontSize: {
                  xs: "8px",
                  sm: "9px",
                  md: "10px",
                },

                lineHeight: 1.2,

                mb: "3px",
              }}
            >
              Email
            </Typography>

            <Typography
              fontWeight={600}
              sx={{
                fontSize: {
                  xs: "9px",
                  sm: "10px",
                  md: "11px",
                },

                lineHeight: 1.3,

                wordBreak: "break-word",
              }}
            >
              {user?.email || "-"}
            </Typography>

          </Grid>


          {/* MOBILE */}

          <Grid
            item
            xs={6}
            md={4}
          >

            <Typography
              color="text.secondary"
              sx={{
                fontSize: {
                  xs: "8px",
                  sm: "9px",
                  md: "10px",
                },

                lineHeight: 1.2,

                mb: "3px",
              }}
            >
              Mobile
            </Typography>

            <Typography
              fontWeight={600}
              sx={{
                fontSize: {
                  xs: "9px",
                  sm: "10px",
                  md: "11px",
                },

                lineHeight: 1.3,

                wordBreak: "break-word",
              }}
            >
              {user?.mobile || "-"}
            </Typography>

          </Grid>


          {/* JOINING DATE */}

          <Grid
            item
            xs={6}
            md={4}
          >

            <Typography
              color="text.secondary"
              sx={{
                fontSize: {
                  xs: "8px",
                  sm: "9px",
                  md: "10px",
                },

                lineHeight: 1.2,

                mb: "3px",
              }}
            >
              Joining Date
            </Typography>


            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
            >

              <CalendarMonth
                color="success"
                sx={{
                  fontSize: {
                    xs: 14,
                    sm: 16,
                  },
                }}
              />

              <Typography
                fontWeight={600}
                sx={{
                  fontSize: {
                    xs: "9px",
                    sm: "10px",
                    md: "11px",
                  },

                  lineHeight: 1.3,
                }}
              >
                {
                  user?.createdAt
                    ? new Date(
                        user.createdAt
                      ).toLocaleDateString()
                    : "-"
                }
              </Typography>

            </Stack>

          </Grid>


          {/* REFERRAL CODE */}

          <Grid
            item
            xs={6}
            md={4}
          >

            <Typography
              color="text.secondary"
              sx={{
                fontSize: {
                  xs: "8px",
                  sm: "9px",
                  md: "10px",
                },

                lineHeight: 1.2,

                mb: "3px",
              }}
            >
              Referral Code
            </Typography>

            <Typography
              fontWeight={600}
              sx={{
                fontSize: {
                  xs: "9px",
                  sm: "10px",
                  md: "11px",
                },

                lineHeight: 1.3,

                wordBreak: "break-word",
              }}
            >
              {user?.referralCode || "-"}
            </Typography>

          </Grid>


          {/* SPONSOR */}

          <Grid
            item
            xs={6}
            md={4}
          >

            <Typography
              color="text.secondary"
              sx={{
                fontSize: {
                  xs: "8px",
                  sm: "9px",
                  md: "10px",
                },

                lineHeight: 1.2,

                mb: "3px",
              }}
            >
              Sponsor
            </Typography>

            <Typography
              fontWeight={600}
              sx={{
                fontSize: {
                  xs: "9px",
                  sm: "10px",
                  md: "11px",
                },

                lineHeight: 1.3,

                wordBreak: "break-word",
              }}
            >
              {user?.sponsorId?.name || "-"}
            </Typography>

          </Grid>


          {/* NETWORK */}

          <Grid
            item
            xs={6}
            md={4}
          >

            <Typography
              color="text.secondary"
              sx={{
                fontSize: {
                  xs: "8px",
                  sm: "9px",
                  md: "10px",
                },

                lineHeight: 1.2,

                mb: "3px",
              }}
            >
              Network
            </Typography>


            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
            >

              <Groups
                color="success"
                sx={{
                  fontSize: {
                    xs: 14,
                    sm: 16,
                  },
                }}
              />

              <Typography
                fontWeight={600}
                sx={{
                  fontSize: {
                    xs: "9px",
                    sm: "10px",
                    md: "11px",
                  },

                  lineHeight: 1.3,
                }}
              >
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