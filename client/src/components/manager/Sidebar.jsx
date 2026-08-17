import { NavLink, useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LogoutIcon from "@mui/icons-material/Logout";


const Sidebar = () => {

  const navigate = useNavigate();


  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

  };


  /* =====================================================
     MANAGER MENU
  ===================================================== */

  const menuItems = [

    {
      title: "Dashboard",
      icon: <DashboardIcon />,
      path: "/manager/dashboard",
    },

    {
      title: "Members",
      icon: <PeopleIcon />,
      path: "/manager/members",
    },

    {
      title: "Orders",
      icon: <ReceiptLongIcon />,
      path: "/manager/orders",
    },

    {
      title: "Referral Tree",
      icon: <AccountTreeIcon />,
      path: "/manager/referral-tree",
    },

    {
      title: "Profile",
      icon: <PersonIcon />,
      path: "/manager/profile",
    },

  ];


  /* =====================================================
     UI
  ===================================================== */

  return (

    <Box
      sx={{
        width: 260,

        minHeight: "100vh",

        bgcolor: "#0F172A",

        color: "#fff",

        display: "flex",

        flexDirection: "column",
      }}
    >

      {/* =================================================
          LOGO
      ================================================= */}

      <Box
        sx={{
          py: 3,

          textAlign: "center",
        }}
      >

        <Typography
          variant="h5"
          fontWeight="bold"
        >
          Bhagyamma Hub
        </Typography>

        <Typography
          variant="body2"
          sx={{
            opacity: 0.7,
          }}
        >
          Manager Panel
        </Typography>

      </Box>


      <Divider
        sx={{
          bgcolor: "#334155",
        }}
      />


      {/* =================================================
          MENU
      ================================================= */}

      <List
        sx={{
          mt: 2,
        }}
      >

        {menuItems.map((item) => (

          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            sx={{
              mx: 1,

              borderRadius: 2,

              mb: 1,

              "&.active": {
                bgcolor: "#2563EB",
              },

              "&:hover": {
                bgcolor: "#1E40AF",
              },
            }}
          >

            <ListItemIcon
              sx={{
                color: "#fff",
              }}
            >
              {item.icon}
            </ListItemIcon>

            <ListItemText
              primary={item.title}
            />

          </ListItemButton>

        ))}

      </List>


      {/* =================================================
          SPACER
      ================================================= */}

      <Box
        sx={{
          flexGrow: 1,
        }}
      />


      <Divider
        sx={{
          bgcolor: "#334155",
        }}
      />


      {/* =================================================
          LOGOUT
      ================================================= */}

      <List>

        <ListItemButton
          onClick={handleLogout}
          sx={{
            color: "#fff",

            "&:hover": {
              bgcolor: "#DC2626",
            },
          }}
        >

          <ListItemIcon
            sx={{
              color: "#fff",
            }}
          >
            <LogoutIcon />
          </ListItemIcon>

          <ListItemText
            primary="Logout"
          />

        </ListItemButton>

      </List>

    </Box>
  );
};


export default Sidebar;