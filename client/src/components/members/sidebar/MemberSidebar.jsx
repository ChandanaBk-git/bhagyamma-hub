import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";

import {
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

const drawerWidth = 280;

// =====================================================
// MAIN NAVIGATION
// =====================================================

const mainMenu = [
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

// =====================================================
// MLM NAVIGATION
// =====================================================

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

// =====================================================
// OTHER NAVIGATION
// =====================================================

const otherMenu = [
  {
    title: "Welcome Kit",
    icon: <CardGiftcardRounded />,
    path: "/member/welcome-kit",
  },
  {
    title: "Settings",
    icon: <SettingsRounded />,
    path: "/member/settings",
  },
];

// =====================================================
// COMPONENT
// =====================================================

const MemberSidebar = ({
  mobileOpen,
  onClose,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    onClose?.();

    navigate("/login", {
      replace: true,
    });
  };

  // ===================================================
  // RENDER MENU
  // ===================================================

  const renderMenu = (items) => (
    <List sx={{ pt: 0 }}>
      {items.map((item) => {
        const isActive =
          location.pathname === item.path ||
          location.pathname.startsWith(
            `${item.path}/`
          );

        return (
          <ListItemButton
            key={item.title}
            component={Link}
            to={item.path}
            selected={isActive}
            onClick={onClose}
            sx={{
              mx: 1.5,
              mb: 0.8,
              px: 2,
              py: 1.2,
              borderRadius: 2,
              color: "#fff",

              transition:
                "background-color .25s, transform .25s",

              "& .MuiListItemIcon-root": {
                color: "#E8F5E9",
                minWidth: 42,
              },

              "&.Mui-selected": {
                bgcolor:
                  "rgba(255,255,255,.16)",

                borderLeft:
                  "4px solid #A5D6A7",

                "& .MuiListItemIcon-root": {
                  color: "#A5D6A7",
                },

                "&:hover": {
                  bgcolor:
                    "rgba(255,255,255,.20)",
                },
              },

              "&:hover": {
                bgcolor:
                  "rgba(255,255,255,.08)",

                transform:
                  "translateX(4px)",
              },
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>

            <ListItemText
              primary={item.title}
              primaryTypographyProps={{
                fontWeight: isActive
                  ? 700
                  : 500,
              }}
            />
          </ListItemButton>
        );
      })}
    </List>
  );

  // ===================================================
  // DRAWER CONTENT
  // ===================================================

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",

        "&::-webkit-scrollbar": {
          width: 5,
        },

        "&::-webkit-scrollbar-thumb": {
          backgroundColor:
            "rgba(255,255,255,.25)",
          borderRadius: 10,
        },
      }}
    >
      <Toolbar />

      {/* ===============================================
          BRAND
      =============================================== */}

      <Box
        sx={{
          textAlign: "center",
          py: 3,
          px: 2,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            fontSize: {
              xs: "1.4rem",
              sm: "1.5rem",
            },
          }}
        >
          🌿 Bhagyamma Hub
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            opacity: 0.8,
          }}
        >
          Member Portal
        </Typography>
      </Box>

      <Divider
        sx={{
          borderColor:
            "rgba(255,255,255,.15)",
        }}
      />

      {/* ===============================================
          MEMBER PROFILE
      =============================================== */}

      <Box
        sx={{
          m: 2,
          p: 2.5,
          borderRadius: 3,
          textAlign: "center",
          bgcolor:
            "rgba(255,255,255,.08)",
        }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mx: "auto",
            bgcolor: "#66BB6A",
            fontSize: 34,
            fontWeight: "bold",
          }}
        >
          {user?.name
            ?.charAt(0)
            ?.toUpperCase() || "M"}
        </Avatar>

        <Typography
          mt={2}
          fontWeight="bold"
        >
          {user?.name || "Member"}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#C8E6C9",
            mt: 0.5,
          }}
        >
          {user?.userId || "Member"}
        </Typography>

        <Chip
          label={user?.role || "MEMBER"}
          size="small"
          color="success"
          sx={{
            mt: 2,
            fontWeight: "bold",
          }}
        />
      </Box>

      <Divider
        sx={{
          borderColor:
            "rgba(255,255,255,.15)",
        }}
      />

      {/* ===============================================
          MAIN
      =============================================== */}

      <Typography
        variant="caption"
        sx={{
          px: 3,
          pt: 2,
          pb: 1,
          display: "block",
          color: "#B2DFDB",
          fontWeight: "bold",
          letterSpacing: 2,
        }}
      >
        MAIN
      </Typography>

      {renderMenu(mainMenu)}

      {/* ===============================================
          MLM
      =============================================== */}

      <Typography
        variant="caption"
        sx={{
          px: 3,
          pt: 2,
          pb: 1,
          display: "block",
          color: "#B2DFDB",
          fontWeight: "bold",
          letterSpacing: 2,
        }}
      >
        MLM
      </Typography>

      {renderMenu(mlmMenu)}

      {/* ===============================================
          OTHER
      =============================================== */}

      <Typography
        variant="caption"
        sx={{
          px: 3,
          pt: 2,
          pb: 1,
          display: "block",
          color: "#B2DFDB",
          fontWeight: "bold",
          letterSpacing: 2,
        }}
      >
        OTHER
      </Typography>

      {renderMenu(otherMenu)}

      {/* Push logout to bottom */}
      <Box sx={{ flexGrow: 1, minHeight: 20 }} />

      <Divider
        sx={{
          borderColor:
            "rgba(255,255,255,.15)",
        }}
      />

      {/* ===============================================
          LOGOUT
      =============================================== */}

      <List>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            mx: 1.5,
            my: 1,
            borderRadius: 2,
            color: "#fff",

            "& .MuiListItemIcon-root": {
              color: "#fff",
              minWidth: 42,
            },

            "&:hover": {
              bgcolor: "#C62828",
            },
          }}
        >
          <ListItemIcon>
            <LogoutRounded />
          </ListItemIcon>

          <ListItemText
            primary="Logout"
          />
        </ListItemButton>
      </List>
    </Box>
  );

  // ===================================================
  // RETURN
  // ===================================================

  return (
    <>
      {/* ===============================================
          MOBILE SIDEBAR
      =============================================== */}

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
            width: drawerWidth,
            background:
              "linear-gradient(180deg,#1B5E20,#2E7D32)",
            color: "#fff",
            borderRight: "none",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* ===============================================
          DESKTOP SIDEBAR
      =============================================== */}

      <Drawer
        variant="permanent"
        open
        sx={{
          display: {
            xs: "none",
            md: "block",
          },

          width: drawerWidth,
          flexShrink: 0,

          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",

            background:
              "linear-gradient(180deg,#1B5E20,#2E7D32)",

            color: "#fff",

            borderRight: "none",

            boxShadow:
              "6px 0 25px rgba(0,0,0,.18)",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default MemberSidebar;