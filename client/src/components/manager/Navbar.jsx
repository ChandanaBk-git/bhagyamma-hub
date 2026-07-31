import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate("/manager/profile");
    handleClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{
        bgcolor: "#fff",
        color: "#111827",
      }}
    >
      <Toolbar>

        <Box flexGrow={1}>

          <Typography
            variant="h5"
            fontWeight="bold"
          >
            Manager Dashboard
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Welcome,
            {" "}
            {user.name || "Manager"}
          </Typography>

        </Box>

        <IconButton>

          <NotificationsIcon />

        </IconButton>

        <IconButton
          onClick={handleOpen}
        >
          <Avatar
            sx={{
              bgcolor: "#2563EB",
            }}
          >
            <AccountCircleIcon />
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >

          <MenuItem
            onClick={handleProfile}
          >
            Profile
          </MenuItem>

          <MenuItem
            onClick={handleLogout}
          >
            Logout
          </MenuItem>

        </Menu>

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;