import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  Tooltip,
  useTheme,
} from "@mui/material";

import {
  MenuRounded,
  MenuOpenRounded,
  NotificationsNoneRounded,
  AccountCircleRounded,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

const TopNavbar = ({
  drawerWidth,
  collapsed,
  handleCollapse,
  handleDrawerToggle,
  isMobile,
}) => {
  const theme = useTheme();

  const navigate = useNavigate();

  /* =====================================================
     GET LOGGED-IN USER
  ===================================================== */

  let user = {};

  try {
    user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );
  } catch (error) {
    console.error(
      "Unable to read user:",
      error
    );

    user = {};
  }

  /* =====================================================
     USER DETAILS
  ===================================================== */

  const name =
    user?.name ||
    user?.fullName ||
    user?.username ||
    "User";

  const role = String(
    user?.role || "MEMBER"
  ).toUpperCase();

  const initial =
    name
      .charAt(0)
      .toUpperCase();

  /* =====================================================
     PROFILE ROUTE
  ===================================================== */

  const getProfilePath = () => {
    if (
      role === "MANAGER"
    ) {
      return "/manager/profile";
    }

    if (
      role === "ADMIN" ||
      role === "SUPER_ADMIN"
    ) {
      return "/admin/profile";
    }

    return "/member/profile";
  };

  /* =====================================================
     PROFILE CLICK
  ===================================================== */

  const handleProfile = () => {
    navigate(
      getProfilePath()
    );
  };

  /* =====================================================
     HOME ROUTE
  ===================================================== */

  const handleHome = () => {
    navigate("/");
  };

  /* =====================================================
     ROLE LABEL
  ===================================================== */

  const getRoleLabel = () => {
    if (role === "SUPER_ADMIN") {
      return "SUPER ADMIN";
    }

    if (role === "ADMIN") {
      return "ADMIN";
    }

    if (role === "MANAGER") {
      return "MANAGER";
    }

    return "MEMBER";
  };

  /* =====================================================
     TITLE
  ===================================================== */

  const getTitle = () => {
    if (role === "MANAGER") {
      return "Manager Panel";
    }

    if (
      role === "ADMIN" ||
      role === "SUPER_ADMIN"
    ) {
      return "Admin Panel";
    }

    return "Bhagyamma Hub";
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "#FFFFFF",

        color: "#0F172A",

        borderBottom:
          "1px solid #E5E7EB",

        width: {
          xs: "100%",
          md: `calc(100% - ${drawerWidth}px)`,
        },

        ml: {
          xs: 0,
          md: `${drawerWidth}px`,
        },

        transition:
          "all 0.3s ease",

        boxShadow:
          "0 2px 10px rgba(0,0,0,0.05)",

        zIndex: 1100,
      }}
    >
      <Toolbar
        sx={{
          minHeight: {
            xs: 60,
            sm: 64,
            md: 68,
          },

          px: {
            xs: 1,
            sm: 2,
            md: 3,
          },

          display: "flex",

          justifyContent:
            "space-between",

          gap: 1,
        }}
      >

        {/* =================================================
            LEFT SECTION
        ================================================= */}

        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            minWidth: 0,
          }}
        >

          {/* MENU BUTTON */}

          <Tooltip
            title={
              isMobile
                ? "Open menu"
                : collapsed
                ? "Expand menu"
                : "Collapse menu"
            }
          >
            <IconButton
              color="inherit"
              onClick={() => {
                if (isMobile) {
                  handleDrawerToggle();
                } else {
                  handleCollapse();
                }
              }}
              sx={{
                flexShrink: 0,
              }}
            >
              {collapsed ? (
                <MenuRounded />
              ) : (
                <MenuOpenRounded />
              )}
            </IconButton>
          </Tooltip>


          {/* BRAND / TITLE */}

          <Box
            sx={{
              ml: {
                xs: 0.5,
                sm: 1.5,
              },

              minWidth: 0,
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: 15,
                  sm: 17,
                  md: 19,
                },

                fontWeight: 800,

                lineHeight: 1.2,

                whiteSpace: "nowrap",

                overflow: "hidden",

                textOverflow:
                  "ellipsis",
              }}
            >
              Bhagyamma Hub
            </Typography>

            <Typography
              sx={{
                fontSize: {
                  xs: 10,
                  sm: 11,
                  md: 12,
                },

                color:
                  "text.secondary",

                mt: 0.2,

                whiteSpace:
                  "nowrap",
              }}
            >
              {getTitle()}
            </Typography>
          </Box>

        </Box>


        {/* =================================================
            RIGHT SECTION
        ================================================= */}

        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            gap: {
              xs: 0.5,
              sm: 1,
              md: 1.5,
            },

            flexShrink: 0,
          }}
        >

          {/* =================================================
              HOME
          ================================================= */}

          <Tooltip
            title="Main Home"
          >
            <IconButton
              onClick={handleHome}
              sx={{
                color:
                  "#475569",

                display: {
                  xs: "none",
                  sm: "inline-flex",
                },

                "&:hover": {
                  bgcolor:
                    "#F1F5F9",
                },
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Home
              </span>
            </IconButton>
          </Tooltip>


          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <Tooltip
            title="Notifications"
          >
            <IconButton
              sx={{
                bgcolor:
                  "#F5F7FA",

                color:
                  "#475569",

                "&:hover": {
                  bgcolor:
                    "#E8F5E9",
                },
              }}
            >
              <NotificationsNoneRounded />
            </IconButton>
          </Tooltip>


          {/* =================================================
              USER PROFILE
          ================================================= */}

          <Box
            onClick={
              handleProfile
            }
            sx={{
              display: "flex",

              alignItems: "center",

              gap: {
                xs: 0.5,
                sm: 1,
              },

              cursor: "pointer",

              borderRadius: 2,

              px: {
                xs: 0.4,
                sm: 0.8,
              },

              py: 0.5,

              transition:
                "background-color 0.2s ease",

              "&:hover": {
                bgcolor:
                  "#F1F5F9",
              },
            }}
          >

            {/* AVATAR */}

            <Avatar
              sx={{
                width: {
                  xs: 34,
                  sm: 40,
                  md: 42,
                },

                height: {
                  xs: 34,
                  sm: 40,
                  md: 42,
                },

                bgcolor:
                  role === "MANAGER"
                    ? "#E8F5E9"
                    : theme.palette
                        .primary
                        .main,

                color:
                  role === "MANAGER"
                    ? "#2E7D32"
                    : "#FFFFFF",

                fontWeight: 800,

                fontSize: {
                  xs: 14,
                  sm: 16,
                },
              }}
            >
              {initial}
            </Avatar>


            {/* USER INFORMATION */}

            <Box
              sx={{
                display: {
                  xs: "none",
                  sm: "flex",
                },

                flexDirection:
                  "column",

                alignItems:
                  "flex-start",

                minWidth: 0,

                maxWidth: {
                  sm: 120,
                  md: 180,
                },
              }}
            >

              <Typography
                fontWeight={700}
                fontSize={{
                  sm: 12,
                  md: 14,
                }}
                noWrap
                sx={{
                  maxWidth: "100%",
                }}
              >
                {name}
              </Typography>


              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontSize: {
                    sm: 9,
                    md: 10,
                  },

                  lineHeight: 1.2,
                }}
              >
                {getRoleLabel()}
              </Typography>

            </Box>


            {/* PROFILE ICON */}

            <AccountCircleRounded
              sx={{
                display: {
                  xs: "none",
                  md: "block",
                },

                color:
                  "#64748B",
              }}
            />

          </Box>

        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default TopNavbar;