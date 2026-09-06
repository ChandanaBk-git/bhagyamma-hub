import {
  useNavigate,
} from "react-router-dom";

import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

import logo from "../../assets/images/logo.png";

const Navbar = ({
  onMenuClick,
}) => {
  const navigate = useNavigate();

  /* =====================================================
     USER
  ===================================================== */

  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("user") || "null"
    );
  } catch (error) {
    console.error(
      "Unable to read manager user:",
      error
    );
  }

  const name =
    user?.name ||
    user?.fullName ||
    "Manager";

  const role =
    user?.role ||
    "MANAGER";

  const initial =
    name.charAt(0).toUpperCase();

  /* =====================================================
     PROFILE
  ===================================================== */

  const handleProfile = () => {
    navigate("/manager/profile");
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "#FFFFFF",
        color: "#0F172A",

        borderBottom:
          "1px solid #E5E7EB",

        width: "100%",
        flexShrink: 0,

        borderRadius: 0,
      }}
    >
      <Toolbar
        sx={{
          minHeight: {
            xs: 52,
            sm: 58,
            md: 62,
          },

          px: {
            xs: 0.75,
            sm: 1.5,
            md: 2.5,
          },

          gap: {
            xs: 0.35,
            sm: 0.75,
          },

          width: "100%",

          boxSizing: "border-box",
        }}
      >
        {/* =================================================
            MOBILE MENU
        ================================================= */}

        <IconButton
          onClick={onMenuClick}
          aria-label="Open manager menu"
          sx={{
            display: {
              xs: "inline-flex",
              md: "none",
            },

            width: 36,
            height: 36,

            flexShrink: 0,

            color: "#0F172A",
          }}
        >
          <MenuIcon
            sx={{
              fontSize: 21,
            }}
          />
        </IconButton>

        {/* =================================================
            LOGO
        ================================================= */}

        <Box
          sx={{
            width: {
              xs: 32,
              sm: 38,
              md: 42,
            },

            height: {
              xs: 32,
              sm: 38,
              md: 42,
            },

            flexShrink: 0,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            overflow: "hidden",

            cursor: "pointer",
          }}
          onClick={() =>
            navigate("/manager/dashboard")
          }
        >
          <Box
            component="img"
            src={logo}
            alt="Bhagyamma Hub"
            sx={{
              width: "100%",
              height: "100%",

              objectFit: "contain",

              display: "block",
            }}
          />
        </Box>

        {/* =================================================
            BRAND
        ================================================= */}

        <Box
          sx={{
            minWidth: 0,

            flex: 1,

            display: "flex",

            flexDirection: {
              xs: "column",
              sm: "row",
            },

            alignItems: {
              xs: "flex-start",
              sm: "center",
            },

            gap: {
              xs: 0,
              sm: 0.75,
            },
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: 13,
                sm: 16,
                md: 18,
              },

              fontWeight: 800,

              lineHeight: 1.2,

              whiteSpace: "nowrap",

              overflow: "hidden",

              textOverflow:
                "ellipsis",

              maxWidth: {
                xs: "100%",
                sm: "none",
              },
            }}
          >
            Bhagyamma Hub
          </Typography>

          <Typography
            sx={{
              display: {
                xs: "none",
                sm: "block",
              },

              fontSize: 11,

              color:
                "text.secondary",
            }}
          >
            / Manager Panel
          </Typography>
        </Box>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            gap: {
              xs: 0.1,
              sm: 0.4,
            },

            flexShrink: 0,
          }}
        >
          {/* NOTIFICATIONS */}

          <Tooltip title="Notifications">
            <IconButton
              aria-label="Notifications"
              sx={{
                width: {
                  xs: 34,
                  sm: 38,
                },

                height: {
                  xs: 34,
                  sm: 38,
                },

                color: "#475569",
              }}
            >
              <NotificationsNoneIcon
                sx={{
                  fontSize: {
                    xs: 19,
                    sm: 21,
                  },
                }}
              />
            </IconButton>
          </Tooltip>

          {/* USER */}

          <Box
            onClick={handleProfile}
            sx={{
              display: "flex",

              alignItems: "center",

              gap: {
                xs: 0.4,
                sm: 0.75,
              },

              cursor: "pointer",

              borderRadius: 0,

              px: {
                xs: 0.2,
                sm: 0.6,
              },

              py: 0.25,

              "&:hover": {
                bgcolor: "#F1F5F9",
              },
            }}
          >
            <Avatar
              sx={{
                width: {
                  xs: 30,
                  sm: 34,
                },

                height: {
                  xs: 30,
                  sm: 34,
                },

                bgcolor: "#E8F5E9",

                color: "#2E7D32",

                fontSize: {
                  xs: 12,
                  sm: 14,
                },

                fontWeight: 800,
              }}
            >
              {initial}
            </Avatar>

            <Box
              sx={{
                display: {
                  xs: "none",
                  sm: "block",
                },

                minWidth: 0,

                maxWidth: 140,
              }}
            >
              <Typography
                fontSize={12}
                fontWeight={700}
                noWrap
              >
                {name}
              </Typography>

              <Typography
                fontSize={9}
                color="text.secondary"
                noWrap
              >
                {role}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;