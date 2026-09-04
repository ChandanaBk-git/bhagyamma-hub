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
import logo from "../../../assets/images/logo.png";

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
      elevation={0}
      sx={{
        bgcolor: "#ffffff",
        color: "#333333",
        borderRadius: 0,
        zIndex: (theme) =>
          theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          minHeight: {
            xs: 56,
            sm: 62,
            md: 66,
          },

          px: {
            xs: 0.75,
            sm: 1.5,
            md: 2,
          },

          gap: 0.5,
          borderRadius: 0,
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

            mr: 0.5,

            color: "#2E7D32",

            width: 34,
            height: 34,

            borderRadius: 0,

            p: 0.25,
          }}
        >
          <Menu
            sx={{
              fontSize: 24,
            }}
          />
        </IconButton>

        {/* =================================================
            MEMBER LOGO
        ================================================= */}

        <Box
          component="img"
          src={logo}
          alt="Bhagyamma Hub"
          onClick={() => navigate("/")}
          sx={{
            display: {
              xs: "block",
              md: "none",
            },

            width: 36,
            height: 36,

            objectFit: "contain",

            flexShrink: 0,

            cursor: "pointer",

            borderRadius: 0,
          }}
        />

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
              display: {
                xs: "none",
                sm: "block",
              },

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
                xs: 40,
                sm: 44,
              },

              height: {
                xs: 40,
                sm: 44,
              },

              borderRadius: 0,

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
                xs: 40,
                sm: 44,
              },

              height: {
                xs: 40,
                sm: 44,
              },

              borderRadius: 0,

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

      </Toolbar>
    </AppBar>
  );
};

export default MemberTopbar;