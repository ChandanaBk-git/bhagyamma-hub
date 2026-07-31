import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  Tooltip,
} from "@mui/material";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const TopNavbar = ({ drawerWidth }) => {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={1}
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        bgcolor: "background.paper",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left Side */}
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Admin Dashboard
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Welcome back 👋
          </Typography>
        </Box>

        {/* Right Side */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Tooltip title="Notifications">
            <IconButton>
              <NotificationsNoneIcon />
            </IconButton>
          </Tooltip>

          <Avatar sx={{ bgcolor: "primary.main" }}>
            <AccountCircleIcon />
          </Avatar>

          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
            >
              {user?.name || "Super Admin"}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {user?.role || "SUPER_ADMIN"}
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavbar;