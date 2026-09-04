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
import StarsIcon from "@mui/icons-material/Stars";


/* =====================================================
   MENU ITEMS
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
    path: "/",
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
    title: "Selling Points",
    icon: <StarsIcon />,
    path: "/manager/selling-points",
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


/* =====================================================
   SIDEBAR
===================================================== */

const Sidebar = () => {
  const navigate = useNavigate();


  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    window.dispatchEvent(
      new Event("auth-logout")
    );

    navigate("/login");
  };


  return (
    <Box
      sx={{
        width: {
          xs: "100%",
          md: 260,
        },

        maxWidth: "100%",

        height: "100vh",

        minHeight: "100vh",

        bgcolor: "#0F172A",

        color: "#FFFFFF",

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
    minHeight: {
      xs: 105,
      md: 122,
    },

    width: "100%",

    px: {
      xs: 0.8,
      sm: 1,
      md: 2,
    },

    py: {
      xs: 1.8,
      md: 3,
    },

    display: "flex",

    flexDirection: "column",

    justifyContent: "center",

    alignItems: "center",

    textAlign: "center",

    boxSizing: "border-box",

    flexShrink: 0,

    overflow: "hidden",

    /*
     * Leave room for the close button
     */
    pr: {
      xs: 4.5,
      sm: 1,
      md: 2,
    },
  }}
>
  <Typography
    sx={{
      width: "100%",

      fontSize: {
        xs: 12,
        sm: 14,
        md: 23,
      },

      lineHeight: 1.15,

      fontWeight: 800,

      color: "#FFFFFF",

      whiteSpace: "nowrap",

      overflow: "hidden",

      textOverflow: "ellipsis",
    }}
  >
    Bhagyamma Hub
  </Typography>

  <Typography
    sx={{
      mt: 0.45,

      fontSize: {
        xs: 8,
        sm: 10,
        md: 13,
      },

      lineHeight: 1.2,

      color:
        "rgba(255,255,255,0.68)",

      whiteSpace: "nowrap",
    }}
  >
    Manager Panel
  </Typography>
</Box>

      {/* =================================================
          DIVIDER
      ================================================= */}

      <Divider
        sx={{
          borderColor: "#334155",

          flexShrink: 0,
        }}
      />


      {/* =================================================
          MENU
      ================================================= */}

      <List
        disablePadding
        sx={{
          px: {
            xs: 0.6,
            md: 1,
          },

          py: {
            xs: 1.5,
            md: 2,
          },

          overflowY: "auto",

          overflowX: "hidden",

          flex: 1,

          minHeight: 0,

          "&::-webkit-scrollbar": {
            width: 3,
          },

          "&::-webkit-scrollbar-thumb": {
            bgcolor: "#334155",

            borderRadius: 3,
          },

          "&::-webkit-scrollbar-track": {
            bgcolor: "transparent",
          },
        }}
      >

        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}

            component={NavLink}

            to={item.path}

            end={item.path === "/"}

            sx={{
              width: "100%",

              minWidth: 0,

              minHeight: {
                xs: 46,
                md: 48,
              },

              mx: 0,

              mb: {
                xs: 0.5,
                md: 0.7,
              },

              px: {
                xs: 0.7,
                sm: 1,
                md: 1.8,
              },

              py: 0.4,

              borderRadius: 2,

              color: "#FFFFFF",

              boxSizing: "border-box",

              overflow: "hidden",

              transition:
                "background-color 0.2s ease",

              "&.active": {
                bgcolor: "#2563EB",

                color: "#FFFFFF",
              },

              "&:hover": {
                bgcolor:
                  "rgba(37,99,235,0.75)",
              },
            }}
          >

            {/* =================================================
                ICON
            ================================================= */}

            <ListItemIcon
              sx={{
                minWidth: {
                  xs: 28,
                  sm: 30,
                  md: 42,
                },

                width: {
                  xs: 28,
                  sm: 30,
                  md: 42,
                },

                mr: {
                  xs: 0.3,
                  sm: 0.5,
                  md: 0,
                },

                color: "#FFFFFF",

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                flexShrink: 0,

                "& svg": {
                  fontSize: {
                    xs: 19,
                    sm: 20,
                    md: 22,
                  },
                },
              }}
            >
              {item.icon}
            </ListItemIcon>


            {/* =================================================
                TEXT
            ================================================= */}

            <ListItemText
              primary={item.title}

              sx={{
                minWidth: 0,

                m: 0,

                overflow: "hidden",
              }}

              primaryTypographyProps={{
                fontSize: {
                  xs: 11,
                  sm: 11.5,
                  md: 15,
                },

                fontWeight: 500,

                color: "#FFFFFF",

                lineHeight: 1.2,

                whiteSpace: "nowrap",

                overflow: "hidden",

                textOverflow: "ellipsis",
              }}
            />

          </ListItemButton>
        ))}

      </List>


      {/* =================================================
          LOGOUT DIVIDER
      ================================================= */}

      <Divider
        sx={{
          borderColor: "#334155",

          flexShrink: 0,
        }}
      />


      {/* =================================================
          LOGOUT
      ================================================= */}

      <List
        disablePadding
        sx={{
          p: {
            xs: 0.6,
            md: 1,
          },

          flexShrink: 0,
        }}
      >

        <ListItemButton
          onClick={handleLogout}

          sx={{
            width: "100%",

            minWidth: 0,

            minHeight: {
              xs: 46,
              md: 48,
            },

            px: {
              xs: 0.7,
              sm: 1,
              md: 1.8,
            },

            py: 0.4,

            borderRadius: 2,

            color: "#FFFFFF",

            overflow: "hidden",

            boxSizing: "border-box",

            "&:hover": {
              bgcolor: "#DC2626",
            },
          }}
        >

          <ListItemIcon
            sx={{
              minWidth: {
                xs: 28,
                sm: 30,
                md: 42,
              },

              width: {
                xs: 28,
                sm: 30,
                md: 42,
              },

              mr: {
                xs: 0.3,
                sm: 0.5,
                md: 0,
              },

              color: "#FFFFFF",

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              flexShrink: 0,

              "& svg": {
                fontSize: {
                  xs: 19,
                  sm: 20,
                  md: 22,
                },
              },
            }}
          >
            <LogoutIcon />
          </ListItemIcon>


          <ListItemText
            primary="Logout"

            sx={{
              minWidth: 0,

              m: 0,

              overflow: "hidden",
            }}

            primaryTypographyProps={{
              fontSize: {
                xs: 11,
                sm: 11.5,
                md: 15,
              },

              fontWeight: 500,

              color: "#FFFFFF",

              lineHeight: 1.2,

              whiteSpace: "nowrap",

              overflow: "hidden",

              textOverflow: "ellipsis",
            }}
          />

        </ListItemButton>

      </List>

    </Box>
  );
};


export default Sidebar;