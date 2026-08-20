import {
  NavLink,
  useNavigate,
} from "react-router-dom";

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
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import HomeIcon from "@mui/icons-material/Home";

const Sidebar = () => {

  const navigate =
    useNavigate();


  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate(
      "/login"
    );

  };


  /* =====================================================
     MENU
  ===================================================== */

  const menuItems = [

  {
    title: "Dashboard",
    icon: <DashboardIcon />,
    path: "/manager/dashboard",
  },

  {
    title: "Home",
    icon: <HomeIcon />,
    path: "/manager/home",
  },

  {
    title: "Members",
    icon: <PeopleIcon />,
    path: "/manager/members",
  },

  {
    title: "Orders",
    icon: <ShoppingBagIcon />,
    path: "/manager/orders",
  },

  {
    title: "Commission",
    icon: <AccountBalanceWalletIcon />,
    path: "/manager/commissions",
  },

  {
    title: "Products",
    icon: <Inventory2Icon />,
    path: "/manager/products",
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


  return (

    <Box
      sx={{
        /*
        =================================================
        IMPORTANT

        Desktop:
        260px sidebar

        Mobile:
        Fill the mobile drawer width.

        Do NOT use xs: 0 here.
        =================================================
        */

        width: {
          xs: "100%",
          md: 260,
        },

        maxWidth: "100%",

        height: "100vh",

        minHeight: "100vh",

        bgcolor: "#0F172A",

        color: "#fff",

        display: "flex",

        flexDirection: "column",

        overflow: "hidden",

        boxSizing: "border-box",

        flexShrink: 0,
      }}
    >

      {/* =================================================
          BRAND
      ================================================= */}

      <Box
        sx={{
          minHeight: 122,

          px: 2,

          py: 3,

          pr: {
            xs: 5,
            md: 2,
          },

          display: "flex",

          flexDirection: "column",

          justifyContent: "center",

          textAlign: "center",

          boxSizing: "border-box",

          flexShrink: 0,
        }}
      >

        <Typography
          sx={{
            fontSize: {
              xs: 21,
              md: 23,
            },

            lineHeight: 1.1,

            fontWeight: 800,

            whiteSpace: "normal",

            overflowWrap: "anywhere",
          }}
        >
          Bhagyamma Hub
        </Typography>


        <Typography
          sx={{
            mt: 0.5,

            fontSize: 13,

            color:
              "rgba(255,255,255,0.68)",
          }}
        >
          Manager Panel
        </Typography>

      </Box>


      <Divider
        sx={{
          bgcolor: "#334155",

          flexShrink: 0,
        }}
      />


      {/* =================================================
          MENU
      ================================================= */}

      <List
        sx={{
          px: 1,

          py: 2,

          overflowY: "auto",

          flex: 1,

          minHeight: 0,

          "&::-webkit-scrollbar": {
            width: 4,
          },

          "&::-webkit-scrollbar-thumb": {
            bgcolor: "#334155",

            borderRadius: 10,
          },

          "&::-webkit-scrollbar-track": {
            bgcolor: "transparent",
          },
        }}
      >

        {menuItems.map(
          (
            item
          ) => (

            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              sx={{
                minHeight: 48,

                mx: 0,

                mb: 0.7,

                px: {
                  xs: 1.8,
                  md: 1.8,
                },

                borderRadius: 2,

                color: "#fff",

                transition:
                  "background-color 0.2s ease",

                "&.active": {
                  bgcolor: "#2563EB",
                },

                "&:hover": {
                  bgcolor:
                    "rgba(37,99,235,0.75)",
                },
              }}
            >

              <ListItemIcon
                sx={{
                  minWidth: 42,

                  color: "#fff",

                  display: "flex",

                  alignItems: "center",

                  justifyContent:
                    "center",
                }}
              >
                {item.icon}
              </ListItemIcon>


              <ListItemText
                primary={
                  item.title
                }
                primaryTypographyProps={{
                  fontSize: 15,

                  fontWeight: 500,

                  whiteSpace:
                    "nowrap",
                }}
              />

            </ListItemButton>

          )
        )}

      </List>


      {/* =================================================
          LOGOUT
      ================================================= */}

      <Divider
        sx={{
          bgcolor: "#334155",

          flexShrink: 0,
        }}
      />


      <List
        sx={{
          p: 1,

          flexShrink: 0,
        }}
      >

        <ListItemButton
          onClick={
            handleLogout
          }
          sx={{
            minHeight: 48,

            borderRadius: 2,

            color: "#fff",

            "&:hover": {
              bgcolor: "#DC2626",
            },
          }}
        >

          <ListItemIcon
            sx={{
              minWidth: 42,

              color: "#fff",

              display: "flex",

              alignItems: "center",

              justifyContent:
                "center",
            }}
          >
            <LogoutIcon />
          </ListItemIcon>


          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontSize: 15,

              fontWeight: 500,

              whiteSpace:
                "nowrap",
            }}
          />

        </ListItemButton>

      </List>

    </Box>

  );

};


export default Sidebar;