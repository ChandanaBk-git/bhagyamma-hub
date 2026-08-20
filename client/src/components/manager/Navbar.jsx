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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";


const Navbar = ({
  onMenuClick,
}) => {

  const navigate =
    useNavigate();


  /* =====================================================
     USER
  ===================================================== */

  let user = null;

  try {

    user =
      JSON.parse(
        localStorage.getItem(
          "user"
        ) || "null"
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
    name
      .charAt(0)
      .toUpperCase();


  /* =====================================================
     PROFILE
  ===================================================== */

  const handleProfile =
    () => {

      navigate(
        "/manager/profile"
      );

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
            xs: 1.2,
            sm: 2,
            md: 3,
          },

          gap: {
            xs: 0.5,
            sm: 1,
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

            width: 42,

            height: 42,

            flexShrink: 0,

            color: "#0F172A",
          }}
        >

          <MenuIcon />

        </IconButton>


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
              sm: 1,
            },
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

              textOverflow: "ellipsis",

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

              fontSize: 12,

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
              xs: 0.2,
              sm: 0.5,
            },

            flexShrink: 0,
          }}
        >

          {/* NOTIFICATIONS */}

          <Tooltip
            title="Notifications"
          >

            <IconButton
              aria-label="Notifications"
              sx={{
                width: {
                  xs: 40,
                  sm: 42,
                },

                height: {
                  xs: 40,
                  sm: 42,
                },

                color:
                  "#475569",
              }}
            >

              <NotificationsNoneIcon
                fontSize="small"
              />

            </IconButton>

          </Tooltip>


          {/* USER */}

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
                xs: 0.3,
                sm: 0.8,
              },

              py: 0.4,

              "&:hover": {
                bgcolor:
                  "#F1F5F9",
              },
            }}
          >

            <Avatar
              sx={{
                width: {
                  xs: 34,
                  sm: 38,
                },

                height: {
                  xs: 34,
                  sm: 38,
                },

                bgcolor:
                  "#E8F5E9",

                color:
                  "#2E7D32",

                fontSize: {
                  xs: 14,
                  sm: 16,
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

                maxWidth: 150,
              }}
            >

              <Typography
                fontSize={13}
                fontWeight={700}
                noWrap
              >
                {name}
              </Typography>


              <Typography
                fontSize={10}
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