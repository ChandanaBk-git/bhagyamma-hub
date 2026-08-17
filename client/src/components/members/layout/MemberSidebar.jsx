import {
  Box,
  Drawer,
  Typography,
  Avatar,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
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
  AccountBalanceWalletRounded,
  PaymentsRounded,
  CardGiftcardRounded,
  SettingsRounded,
  LogoutRounded,
} from "@mui/icons-material";

import { Link, useLocation, useNavigate } from "react-router-dom";

const DRAWER_WIDTH = 280;

const mainMenu = [
{
  title: "Home",
  icon: <HomeRounded />,
  path: "/member/home",
},
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
    title: "My Orders",
    icon: <ReceiptLongRounded />,
    path: "/member/orders",
  },
];

const mlmMenu = [
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
];

const otherMenu = [
  {
    title: "Welcome Kit",
    icon: <CardGiftcardRounded />,
    path: "/member/welcome-kit",
  },
  // {
  //   title: "Settings",
  //   icon: <SettingsRounded />,
  //   path: "/member/settings",
  // },
];

const MemberSidebar = ({
  mobileOpen = false,
  onClose = () => {},
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }

  const memberName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    "Member";

  const memberId =
    user?.userId ||
    user?.memberId ||
    user?.id ||
    "-";

  const firstLetter =
    memberName?.charAt(0)?.toUpperCase() || "M";

  const isActive = (path) => {
    if (path === "/member") {
      return location.pathname === "/member";
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  const handleNavigation = () => {
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    onClose();

    navigate("/login", {
      replace: true,
    });
  };

  const renderMenu = (items) =>
    items.map((item) => {
      const active = isActive(item.path);

      return (
        <ListItemButton
          key={item.path}
          component={Link}
          to={item.path}
          onClick={handleNavigation}
          selected={active}
          sx={{
            minHeight: 50,
            mx: 1.5,
            mb: 0.6,
            px: 2,
            borderRadius: 3,

            color: "#fff",

            transition: "all 0.2s ease",

            "&:hover": {
              bgcolor: "rgba(255,255,255,0.12)",
            },

            "&.Mui-selected": {
              bgcolor: "#4CAF50",
              color: "#fff",
            },

            "&.Mui-selected:hover": {
              bgcolor: "#43A047",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 40,
              color: "inherit",
            }}
          >
            {item.icon}
          </ListItemIcon>

          <ListItemText
            primary={item.title}
            primaryTypographyProps={{
              fontSize: {
                xs: "0.9rem",
                md: "0.95rem",
              },
              fontWeight: active ? 600 : 400,
              whiteSpace: "nowrap",
            }}
          />
        </ListItemButton>
      );
    });

  const sidebarContent = (
    <Box
      sx={{
        width: DRAWER_WIDTH,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#176B2A",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      {/* =====================================================
          BRAND
      ===================================================== */}
      <Box
        sx={{
          px: 3,
          py: 3,
          minHeight: 90,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: "1.45rem",
              md: "1.55rem",
            },
            fontWeight: 800,
            color: "#fff",
            whiteSpace: "nowrap",
          }}
        >
          Bhagyamma Hub
        </Typography>
      </Box>

      <Divider
        sx={{
          borderColor: "rgba(255,255,255,0.12)",
        }}
      />

      {/* =====================================================
          USER
      ===================================================== */}
      <Box
        sx={{
          px: 2,
          py: 3,
          textAlign: "center",
        }}
      >
        <Avatar
          sx={{
            width: 74,
            height: 74,
            mx: "auto",
            mb: 1.5,
            bgcolor: "#4CAF50",
            color: "#fff",
            fontSize: "2rem",
            fontWeight: 700,
          }}
        >
          {firstLetter}
        </Avatar>

        <Typography
          fontWeight={700}
          sx={{
            fontSize: "1rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {memberName}
        </Typography>

        <Typography
          sx={{
            mt: 0.4,
            fontSize: "0.75rem",
            opacity: 0.8,
            letterSpacing: 0.5,
          }}
        >
          MEMBER
        </Typography>

        <Typography
          sx={{
            mt: 0.5,
            fontSize: "0.7rem",
            opacity: 0.65,
            wordBreak: "break-word",
          }}
        >
          ID: {memberId}
        </Typography>
      </Box>

      <Divider
        sx={{
          borderColor: "rgba(255,255,255,0.12)",
        }}
      />

      {/* =====================================================
          SCROLLABLE MENU
      ===================================================== */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          py: 2,

          "&::-webkit-scrollbar": {
            width: 5,
          },

          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(255,255,255,0.25)",
            borderRadius: 10,
          },
        }}
      >
        <Typography
          sx={{
            px: 3,
            mb: 1,
            fontSize: "0.68rem",
            fontWeight: 700,
            opacity: 0.55,
            letterSpacing: 1,
          }}
        >
          MAIN
        </Typography>

        <List disablePadding>
          {renderMenu(mainMenu)}
        </List>

        <Typography
          sx={{
            px: 3,
            mt: 2.5,
            mb: 1,
            fontSize: "0.68rem",
            fontWeight: 700,
            opacity: 0.55,
            letterSpacing: 1,
          }}
        >
          MLM
        </Typography>

        <List disablePadding>
          {renderMenu(mlmMenu)}
        </List>

        <Typography
          sx={{
            px: 3,
            mt: 2.5,
            mb: 1,
            fontSize: "0.68rem",
            fontWeight: 700,
            opacity: 0.55,
            letterSpacing: 1,
          }}
        >
          OTHER
        </Typography>

        <List disablePadding>
          {renderMenu(otherMenu)}
        </List>
      </Box>

      {/* =====================================================
          LOGOUT
      ===================================================== */}
      <Box
        sx={{
          borderTop: "1px solid rgba(255,255,255,0.12)",
          p: 1.5,
        }}
      >
        <Tooltip title="Logout" placement="right">
          <ListItemButton
            onClick={handleLogout}
            sx={{
              minHeight: 50,
              borderRadius: 3,
              color: "#fff",

              "&:hover": {
                bgcolor: "rgba(255,255,255,0.12)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: "#fff",
              }}
            >
              <LogoutRounded />
            </ListItemIcon>

            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontSize: "0.95rem",
              }}
            />
          </ListItemButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <>
      {/* =====================================================
          MOBILE DRAWER
      ===================================================== */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: {
            xs: "block",
            md: "none",
          },

          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            maxWidth: "85vw",
            boxSizing: "border-box",
            border: 0,
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* =====================================================
          DESKTOP DRAWER
      ===================================================== */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: {
            xs: "none",
            md: "block",
          },

          width: DRAWER_WIDTH,
          flexShrink: 0,

          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            border: 0,
            bgcolor: "#176B2A",
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
};

export default MemberSidebar;