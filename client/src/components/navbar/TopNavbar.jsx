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
} from "@mui/icons-material";

const TopNavbar = ({
  drawerWidth,
  collapsed,
  handleCollapse,
  handleDrawerToggle,
  isMobile,
}) => {
  const theme = useTheme();

    return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "#ffffff",
        color: "#222",

        borderBottom: "1px solid #E5E7EB",

        width: {
          md: `calc(100% - ${drawerWidth}px)`,
        },

        ml: {
          md: `${drawerWidth}px`,
        },

        transition: "all .3s ease",

        boxShadow: "0 2px 10px rgba(0,0,0,.05)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >

              <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Tooltip title="Menu">
            <IconButton
              color="inherit"
              onClick={
                isMobile
                  ? handleDrawerToggle
                  : handleCollapse
              }
            >
              {collapsed ? (
                <MenuRounded />
              ) : (
                <MenuOpenRounded />
              )}
            </IconButton>
          </Tooltip>

          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              ml: 2,
              display: {
                xs: "none",
                sm: "block",
              },
            }}
          >
            Admin Dashboard
          </Typography>

                  </Box>

        {/* Right Section */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Tooltip title="Notifications">
            <IconButton
              sx={{
                bgcolor: "#F5F7FA",

                "&:hover": {
                  bgcolor: "#E8F5E9",
                },
              }}
            >
              <NotificationsNoneRounded />
            </IconButton>
          </Tooltip>

          <Box
            sx={{
              display: {
                xs: "none",
                sm: "flex",
              },
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <Typography
              fontWeight={700}
              fontSize={15}
            >
              Super Admin
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Bhagyamma Hub
            </Typography>
          </Box>

          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              width: 42,
              height: 42,
              cursor: "pointer",
            }}
          >
            
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavbar;