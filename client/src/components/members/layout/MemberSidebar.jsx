import { Link, useLocation } from "react-router-dom";

import {
  Box,
  Drawer,
  Toolbar,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
} from "@mui/material";

import {
  HomeRounded,
  DashboardRounded,
  PersonRounded,
  StorefrontRounded,
  ReceiptLongRounded,
  HubRounded,
  StarsRounded,
  PaidRounded,
  PaymentsRounded,
  AccountBalanceWalletRounded,
  CardGiftcardRounded,
  BarChartRounded,
  SettingsRounded,
  LogoutRounded,
} from "@mui/icons-material";

const drawerWidth = 260;

const menuItems = [

  // ================= PUBLIC =================

  {
    title: "Home",
    icon: <HomeRounded />,
    path: "/",
  },

  // ================= MAIN =================

  {
    title: "Dashboard",
    icon: <DashboardRounded />,
    path: "/member/dashboard",
  },

  {
    title: "My Profile",
    icon: <PersonRounded />,
    path: "/member/profile",
  },

  {
    title: "Products",
    icon: <StorefrontRounded />,
    path: "/member/products",
  },

  {
    title: "Orders",
    icon: <ReceiptLongRounded />,
    path: "/member/orders",
  },

  // ================= MLM =================

  {
    title: "My Network",
    icon: <HubRounded />,
    path: "/member/network",
  },

  {
    title: "Selling Points",
    icon: <StarsRounded />,
    path: "/member/selling-points",
  },

  {
    title: "Commission",
    icon: <PaidRounded />,
    path: "/member/commission",
  },

  {
    title: "Wallet",
    icon: <AccountBalanceWalletRounded />,
    path: "/member/wallet",
  },

  {
    title: "Withdraw",
    icon: <PaymentsRounded />,
    path: "/member/withdraw",
  },

  // ================= OTHER =================

  {
    title: "Welcome Kit",
    icon: <CardGiftcardRounded />,
    path: "/member/welcome-kit",
  },

  {
    title: "Reports",
    icon: <BarChartRounded />,
    path: "/member/reports",
  },

  {
    title: "Settings",
    icon: <SettingsRounded />,
    path: "/member/settings",
  },
];

const MemberSidebar = () => {
  const location = useLocation();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    window.dispatchEvent(
      new Event("auth-logout")
    );

    window.location.href = "/login";
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

          bgcolor: "#1B5E20",

          color: "#fff",
        },
      }}
    >

      <Toolbar />

      {/* =================================================
          LOGO
      ================================================= */}

      <Box
        sx={{
          textAlign: "center",

          py: 2,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
        >
          Bhagyamma Hub
        </Typography>
      </Box>

      <Divider
        sx={{
          bgcolor:
            "rgba(255,255,255,.2)",
        }}
      />


      {/* =================================================
          USER
      ================================================= */}

      <Box
        sx={{
          textAlign: "center",

          py: 3,
        }}
      >
        <Avatar
          sx={{
            width: 70,

            height: 70,

            bgcolor: "#43A047",

            mx: "auto",

            fontSize: 28,
          }}
        >
          {user?.name
            ?.charAt(0)
            ?.toUpperCase() || "M"}
        </Avatar>

        <Typography
          mt={2}
          fontWeight="bold"
          noWrap
          sx={{
            px: 2,
          }}
        >
          {user?.name || "Member"}
        </Typography>

        <Typography
          variant="caption"
          color="#B2DFDB"
        >
          MEMBER
        </Typography>
      </Box>

      <Divider
        sx={{
          bgcolor:
            "rgba(255,255,255,.2)",
        }}
      />


      {/* =================================================
          MENU
      ================================================= */}

      <List
        sx={{
          mt: 1,

          px: 0.5,
        }}
      >

        {menuItems.map(
          (item) => {

            const isHome =
              item.path === "/";

            const isSelected =
              isHome
                ? location.pathname === "/"
                : location.pathname ===
                  item.path;

            return (
              <ListItemButton
                key={item.title}
                component={Link}
                to={item.path}
                selected={isSelected}
                sx={{
                  mx: 1,

                  mb: 0.5,

                  borderRadius: 2,

                  color: "#fff",

                  minHeight: 46,

                  "&.Mui-selected": {
                    bgcolor:
                      "#43A047",
                  },

                  "&.Mui-selected:hover": {
                    bgcolor:
                      "#4CAF50",
                  },

                  "&:hover": {
                    bgcolor:
                      "#2E7D32",
                  },
                }}
              >

                <ListItemIcon
                  sx={{
                    color: "#fff",

                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={
                    item.title
                  }
                />

              </ListItemButton>
            );
          }
        )}

      </List>


      {/* =================================================
          BOTTOM AREA
      ================================================= */}

      <Box
        sx={{
          flexGrow: 1,
        }}
      />


      <Divider
        sx={{
          bgcolor:
            "rgba(255,255,255,.2)",
        }}
      />


      {/* =================================================
          LOGOUT
      ================================================= */}

      <List>

        <ListItemButton
          onClick={
            handleLogout
          }
          sx={{
            color: "#fff",

            mx: 1,

            borderRadius: 2,

            "&:hover": {
              bgcolor: "#D32F2F",
            },
          }}
        >

          <ListItemIcon
            sx={{
              color: "#fff",

              minWidth: 40,
            }}
          >
            <LogoutRounded />
          </ListItemIcon>

          <ListItemText
            primary="Logout"
          />

        </ListItemButton>

      </List>

    </Drawer>
  );
};

export default MemberSidebar;