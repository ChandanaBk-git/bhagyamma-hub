import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  Badge,
  Tooltip,
} from "@mui/material";

import {
  Notifications,
  Menu,
  ShoppingCart,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import { useCart } from "../../../context/CartContext";

const MemberTopbar = ({ onMenuClick }) => {
  const navigate = useNavigate();

  const { cartCount } = useCart();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  // =====================================================
  // CART
  // =====================================================

  const handleCartClick = () => {
    navigate("/member/cart");
  };

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const handleNotificationClick = () => {
    // Notification functionality can be added later
  };

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        bgcolor: "#ffffff",
        color: "#333333",
        zIndex: (theme) =>
          theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          minHeight: {
            xs: 68,
            sm: 76,
          },

          px: {
            xs: 1.5,
            sm: 3,
          },

          gap: 1,
        }}
      >

        {/* =================================================
            MOBILE MENU
        ================================================= */}

        <IconButton
          edge="start"
          onClick={onMenuClick}
          sx={{
            display: {
              xs: "flex",
              md: "none",
            },

            mr: {
              xs: 0.5,
              sm: 1,
            },

            color: "#666",
          }}
        >
          <Menu />
        </IconButton>

        {/* =================================================
            WELCOME SECTION
        ================================================= */}

        <Box
          sx={{
            flexGrow: 1,
            minWidth: 0,
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              fontSize: {
                xs: "1rem",
                sm: "1.25rem",
              },

              lineHeight: 1.3,

              whiteSpace: "nowrap",

              overflow: "hidden",

              textOverflow: "ellipsis",
            }}
          >
            Welcome Back,{" "}
            {user?.name || "Member"}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: {
                xs: "0.72rem",
                sm: "0.875rem",
              },

              mt: 0.3,
            }}
          >
            Member ID :{" "}
            {user?.userId || "-"}
          </Typography>
        </Box>

        {/* =================================================
            CART
        ================================================= */}

        <Tooltip title="My Cart">
          <IconButton
            onClick={handleCartClick}
            aria-label="My Cart"
            sx={{
              color: "#2E7D32",

              width: {
                xs: 42,
                sm: 46,
              },

              height: {
                xs: 42,
                sm: 46,
              },

              "&:hover": {
                bgcolor: "#E8F5E9",
              },
            }}
          >
            <Badge
              badgeContent={cartCount || 0}
              color="error"
              max={99}
              showZero={false}
            >
              <ShoppingCart
                sx={{
                  fontSize: {
                    xs: 25,
                    sm: 28,
                  },
                }}
              />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* =================================================
            NOTIFICATIONS
        ================================================= */}

        <Tooltip title="Notifications">
          <IconButton
            onClick={handleNotificationClick}
            sx={{
              color: "#666",

              width: {
                xs: 42,
                sm: 46,
              },

              height: {
                xs: 42,
                sm: 46,
              },

              "&:hover": {
                bgcolor: "#F5F5F5",
              },
            }}
          >
            <Badge
              badgeContent={2}
              color="error"
            >
              <Notifications
                sx={{
                  fontSize: {
                    xs: 24,
                    sm: 27,
                  },
                }}
              />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* =================================================
            USER AVATAR
        ================================================= */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            ml: {
              xs: 0,
              sm: 0.5,
            },
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#2E7D32",

              width: {
                xs: 40,
                sm: 48,
              },

              height: {
                xs: 40,
                sm: 48,
              },

              fontWeight: "bold",

              fontSize: {
                xs: "1rem",
                sm: "1.25rem",
              },
            }}
          >
            {user?.name
              ?.charAt(0)
              ?.toUpperCase() || "M"}
          </Avatar>

          {/* Desktop user information */}

          <Box
            sx={{
              display: {
                xs: "none",
                lg: "block",
              },

              ml: 1.2,

              minWidth: 90,
            }}
          >
            <Typography
              fontWeight="bold"
              fontSize="0.9rem"
              noWrap
            >
              {user?.name || "Member"}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {user?.role || "MEMBER"}
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MemberTopbar;