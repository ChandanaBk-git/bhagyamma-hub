import { useMemo } from "react";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import StoreRoundedIcon from "@mui/icons-material/StoreRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import FingerprintRoundedIcon from "@mui/icons-material/FingerprintRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";

import { useNavigate } from "react-router-dom";

/* -------------------------------------------------------------------------- */
/*                              HELPERS                                       */
/* -------------------------------------------------------------------------- */

const getUser = () => {
  try {
    const stored =
      localStorage.getItem("packagingUser") ||
      sessionStorage.getItem("packagingUser");

    return stored
      ? JSON.parse(stored)
      : {};
  } catch (error) {
    console.error(
      "PACKAGING PROFILE PARSE ERROR:",
      error
    );

    return {};
  }
};

const formatDate = (value) => {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
};

const formatDateTime = (value) => {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};

const getInitials = (name = "") => {
  const parts = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) {
    return "P";
  }

  if (parts.length === 1) {
    return parts[0]
      .charAt(0)
      .toUpperCase();
  }

  return (
    parts[0].charAt(0) +
    parts[parts.length - 1].charAt(0)
  ).toUpperCase();
};

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

const Profile = () => {
  const navigate = useNavigate();

  const user = useMemo(
    () => getUser(),
    []
  );

  const initials = getInitials(
    user?.name
  );

  const isActive =
    user?.isActive !== false;

  return (
    <Stack
      spacing={{
        xs: 1.5,
        sm: 2.5,
      }}
      sx={{
        width: "100%",
        maxWidth: 1000,
        mx: "auto",
      }}
    >
      {/* ================================================================
          TOP ACTION
      ================================================================ */}

      <Box>
        <Button
          startIcon={
            <ArrowBackRoundedIcon />
          }
          onClick={() =>
            navigate(
              "/packaging/dashboard"
            )
          }
          sx={{
            textTransform: "none",

            fontWeight: 700,

            borderRadius: 2,

            px: {
              xs: 0.75,
              sm: 1,
            },
          }}
        >
          Back to Dashboard
        </Button>
      </Box>

      {/* ================================================================
          PROFILE HEADER
      ================================================================ */}

      <Card
        elevation={0}
        sx={{
          borderRadius: {
            xs: 2.5,
            sm: 3,
          },

          border:
            "1px solid #E5E7EB",

          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: {
              xs: 90,
              sm: 125,
            },

            background:
              "linear-gradient(135deg, #6A1B9A 0%, #9C27B0 100%)",
          }}
        />

        <CardContent
          sx={{
            pt: 0,

            px: {
              xs: 1.75,
              sm: 3,
              md: 4,
            },

            pb: {
              xs: 2,
              sm: 3,
            },

            "&:last-child": {
              pb: {
                xs: 2,
                sm: 3,
              },
            },
          }}
        >
          <Box
            sx={{
              display: "flex",

              flexDirection: {
                xs: "column",
                sm: "row",
              },

              alignItems: {
                xs: "center",
                sm: "flex-end",
              },

              justifyContent:
                "space-between",

              gap: 2,

              mt: {
                xs: -5,
                sm: -5,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",

                flexDirection: {
                  xs: "column",
                  sm: "row",
                },

                alignItems: {
                  xs: "center",
                  sm: "flex-end",
                },

                gap: {
                  xs: 1.25,
                  sm: 1.75,
                },

                minWidth: 0,
              }}
            >
              <Avatar
                sx={{
                  width: {
                    xs: 82,
                    sm: 96,
                  },

                  height: {
                    xs: 82,
                    sm: 96,
                  },

                  border:
                    "5px solid #fff",

                  bgcolor: "#7B1FA2",

                  fontSize: {
                    xs: 27,
                    sm: 32,
                  },

                  fontWeight: 800,

                  boxShadow:
                    "0 5px 18px rgba(0,0,0,.15)",
                }}
              >
                {initials}
              </Avatar>

              <Box
                sx={{
                  textAlign: {
                    xs: "center",
                    sm: "left",
                  },

                  minWidth: 0,
                }}
              >
                <Typography
                  sx={{
                    fontSize: {
                      xs: 21,
                      sm: 26,
                    },

                    fontWeight: 800,

                    lineHeight: 1.2,

                    wordBreak:
                      "break-word",
                  }}
                >
                  {user?.name ||
                    "Packaging Staff"}
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{
                    mt: 0.35,

                    fontSize: {
                      xs: 13,
                      sm: 14,
                    },

                    wordBreak:
                      "break-word",
                  }}
                >
                  {user?.loginId ||
                    "Login ID not available"}
                </Typography>
              </Box>
            </Box>

            <Chip
              icon={
                <CheckCircleRoundedIcon />
              }
              label={
                isActive
                  ? "Active Account"
                  : "Inactive Account"
              }
              color={
                isActive
                  ? "success"
                  : "error"
              }
              sx={{
                fontWeight: 700,

                alignSelf: {
                  xs: "center",
                  sm: "flex-end",
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* ================================================================
          PERSONAL / ACCOUNT DETAILS
      ================================================================ */}

      <Card
        elevation={0}
        sx={{
          borderRadius: {
            xs: 2.5,
            sm: 3,
          },

          border:
            "1px solid #E5E7EB",
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 1.75,
              sm: 2.5,
              md: 3,
            },

            "&:last-child": {
              pb: {
                xs: 1.75,
                sm: 2.5,
                md: 3,
              },
            },
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: 17,
                sm: 19,
              },

              fontWeight: 800,

              mb: 2,
            }}
          >
            Account Details
          </Typography>

          <Grid
            container
            spacing={{
              xs: 1.25,
              sm: 2,
            }}
          >
            {/* FULL NAME */}

            <Grid
              item
              xs={12}
              sm={6}
            >
              <DetailCard
                icon={
                  <PersonRoundedIcon />
                }
                label="Full Name"
                value={
                  user?.name ||
                  "Not available"
                }
              />
            </Grid>

            {/* LOGIN ID */}

            <Grid
              item
              xs={12}
              sm={6}
            >
              <DetailCard
                icon={
                  <BadgeRoundedIcon />
                }
                label="Login ID"
                value={
                  user?.loginId ||
                  "Not available"
                }
              />
            </Grid>

            {/* ROLE */}

            <Grid
              item
              xs={12}
              sm={6}
            >
              <DetailCard
                icon={
                  <AdminPanelSettingsRoundedIcon />
                }
                label="Role"
                value={
                  user?.role ||
                  "PACKAGING"
                }
              />
            </Grid>

            {/* STAFF ID */}

            <Grid
              item
              xs={12}
              sm={6}
            >
              <DetailCard
                icon={
                  <FingerprintRoundedIcon />
                }
                label="Staff ID"
                value={
                  user?.id ||
                  user?._id ||
                  user?.packagingStaffId ||
                  "Not available"
                }
              />
            </Grid>

            {/* BRANCH NAME */}

            <Grid
              item
              xs={12}
              sm={6}
            >
              <DetailCard
                icon={
                  <StoreRoundedIcon />
                }
                label="Branch Name"
                value={
                  user?.branchName ||
                  "Not assigned"
                }
              />
            </Grid>

            {/* BRANCH ID */}

            <Grid
              item
              xs={12}
              sm={6}
            >
              <DetailCard
                icon={
                  <StoreRoundedIcon />
                }
                label="Branch ID"
                value={
                  user?.branchId ||
                  "Not assigned"
                }
              />
            </Grid>

            {/* BRANCH MEMBER NUMBER */}

            <Grid
              item
              xs={12}
              sm={6}
            >
              <DetailCard
                icon={
                  <GroupsRoundedIcon />
                }
                label="Branch Member Number"
                value={
                  user?.branchMemberNumber ||
                  "Not assigned"
                }
              />
            </Grid>

            {/* STATUS */}

            <Grid
              item
              xs={12}
              sm={6}
            >
              <DetailCard
                icon={
                  <CheckCircleRoundedIcon />
                }
                label="Account Status"
                value={
                  isActive
                    ? "Active"
                    : "Inactive"
                }
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ================================================================
          ACCOUNT TIMELINE
      ================================================================ */}

      <Card
        elevation={0}
        sx={{
          borderRadius: {
            xs: 2.5,
            sm: 3,
          },

          border:
            "1px solid #E5E7EB",
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 1.75,
              sm: 2.5,
              md: 3,
            },

            "&:last-child": {
              pb: {
                xs: 1.75,
                sm: 2.5,
                md: 3,
              },
            },
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: 17,
                sm: 19,
              },

              fontWeight: 800,

              mb: 2,
            }}
          >
            Account Activity
          </Typography>

          <Stack spacing={1.75}>
            <ActivityRow
              icon={
                <CalendarMonthRoundedIcon />
              }
              title="Account Created"
              value={formatDate(
                user?.createdAt
              )}
            />

            <Divider />

            <ActivityRow
              icon={
                <LoginRoundedIcon />
              }
              title="Last Login"
              value={formatDateTime(
                user?.lastLoginAt
              )}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* ================================================================
          PACKAGING RESPONSIBILITY
      ================================================================ */}

      <Card
        elevation={0}
        sx={{
          borderRadius: {
            xs: 2.5,
            sm: 3,
          },

          border:
            "1px solid #E5E7EB",

          background:
            "linear-gradient(135deg, #ffffff, #faf5ff)",
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 1.75,
              sm: 2.5,
              md: 3,
            },

            "&:last-child": {
              pb: {
                xs: 1.75,
                sm: 2.5,
                md: 3,
              },
            },
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: 17,
                sm: 19,
              },

              fontWeight: 800,
            }}
          >
            Packaging Team Responsibilities
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.75,

              fontSize: {
                xs: 12.5,
                sm: 14,
              },

              lineHeight: 1.6,
            }}
          >
            Your Packaging Team account is
            used to process orders assigned by
            Admin. You can view your assigned
            orders and move them through the
            packaging workflow.
          </Typography>

          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
              },

              gap: 1,

              mt: 2,
            }}
          >
            {[
              "View assigned orders",
              "Start packing assigned orders",
              "Mark orders as packed",
              "Mark orders ready for dispatch",
            ].map((item) => (
              <Box
                key={item}
                sx={{
                  p: 1.25,

                  borderRadius: 2,

                  backgroundColor:
                    "#fff",

                  border:
                    "1px solid #E9D5FF",
                }}
              >
                <Typography
                  sx={{
                    fontSize: {
                      xs: 12,
                      sm: 13,
                    },

                    fontWeight: 700,
                  }}
                >
                  ✓ {item}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* ================================================================
          BOTTOM ACTION
      ================================================================ */}

      <Box
        sx={{
          display: "flex",

          justifyContent: "center",

          pb: {
            xs: 1,
            sm: 2,
          },
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          startIcon={
            <ArrowBackRoundedIcon />
          }
          onClick={() =>
            navigate(
              "/packaging/dashboard"
            )
          }
          sx={{
            textTransform: "none",

            fontWeight: 700,

            borderRadius: 2,

            px: 3,
          }}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Stack>
  );
};

/* -------------------------------------------------------------------------- */
/*                              DETAIL CARD                                   */
/* -------------------------------------------------------------------------- */

const DetailCard = ({
  icon,
  label,
  value,
}) => {
  return (
    <Box
      sx={{
        height: "100%",

        p: {
          xs: 1.25,
          sm: 1.5,
        },

        border:
          "1px solid #E5E7EB",

        borderRadius: 2,

        backgroundColor:
          "#FAFAFA",

        display: "flex",

        alignItems: "flex-start",

        gap: 1.25,

        minWidth: 0,
      }}
    >
      <Box
        sx={{
          width: {
            xs: 34,
            sm: 38,
          },

          height: {
            xs: 34,
            sm: 38,
          },

          flexShrink: 0,

          borderRadius: 1.75,

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          backgroundColor:
            "#F3E8FF",

          color: "#7B1FA2",
        }}
      >
        {icon}
      </Box>

      <Box
        sx={{
          minWidth: 0,
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",

            mb: 0.25,
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            fontSize: {
              xs: 13,
              sm: 14,
            },

            fontWeight: 700,

            wordBreak:
              "break-word",

            overflowWrap:
              "anywhere",
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

/* -------------------------------------------------------------------------- */
/*                            ACTIVITY ROW                                    */
/* -------------------------------------------------------------------------- */

const ActivityRow = ({
  icon,
  title,
  value,
}) => {
  return (
    <Box
      sx={{
        display: "flex",

        alignItems: "center",

        gap: 1.25,
      }}
    >
      <Box
        sx={{
          width: 38,

          height: 38,

          flexShrink: 0,

          borderRadius: 1.75,

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          backgroundColor:
            "#F3E8FF",

          color: "#7B1FA2",
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
        >
          {title}
        </Typography>

        <Typography
          fontWeight={700}
          sx={{
            fontSize: {
              xs: 13,
              sm: 14,
            },
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

export default Profile;