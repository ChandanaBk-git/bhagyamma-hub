import {
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import GroupIcon from "@mui/icons-material/Group";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import LogoutIcon from "@mui/icons-material/Logout";

import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = ({ drawerWidth }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/admin/dashboard",
    },
    {
      text: "Products",
      icon: <Inventory2Icon />,
      path: "/admin/products",
    },
    {
      text: "Members",
      icon: <GroupIcon />,
      path: "/admin/members",
    },
    {
      text: "Referral Tree",
      icon: <AccountTreeIcon />,
      path: "/admin/referral-tree",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,

        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "primary.main",
          color: "#fff",
        },
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ width: "100%", textAlign: "center" }}
        >
          Bhagyamma Hub
        </Typography>
      </Toolbar>

      <Divider sx={{ bgcolor: "rgba(255,255,255,.2)" }} />

      <List sx={{ mt: 2 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={NavLink}
            to={item.path}
            sx={{
              mx: 1,
              mb: 1,
              borderRadius: 2,

              "&.active": {
                bgcolor: "secondary.main",
                color: "#000",

                "& .MuiListItemIcon-root": {
                  color: "#000",
                },
              },

              "&:hover": {
                bgcolor: "rgba(255,255,255,.15)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "#fff" }}>
              {item.icon}
            </ListItemIcon>

            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ bgcolor: "rgba(255,255,255,.2)" }} />

      <List>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            mx: 1,
            my: 2,
            borderRadius: 2,

            "&:hover": {
              bgcolor: "#d32f2f",
            },
          }}
        >
          <ListItemIcon sx={{ color: "#fff" }}>
            <LogoutIcon />
          </ListItemIcon>

          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;