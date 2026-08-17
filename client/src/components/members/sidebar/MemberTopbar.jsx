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

import {
  useNavigate,
} from "react-router-dom";

import { useCart } from "../../context/CartContext";

const MemberTopbar = ({
  onMenuClick,
}) => {
  const navigate =
    useNavigate();

  const { cartCount } =
    useCart();

  const user = JSON.parse(
    localStorage.getItem(
      "user"
    ) || "{}"
  );

  // =====================================================
  // CART
  // =====================================================

const handleCartClick = () => {
  navigate("/member/cart");
};

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        bgcolor: "#fff",
        color: "#333",

        zIndex: (theme) =>
          theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          minHeight: {
            xs: 70,
            sm: 76,
          },

          px: {
            xs: 2,
            sm: 3,
          },
        }}
      >
        {/* ===============================================
            MOBILE MENU
        ================================================ */}

        <IconButton
          edge="start"
          onClick={onMenuClick}
          sx={{
            display: {
              xs: "flex",
              md: "none",
            },

            mr: {
              xs: 1,
              sm: 2,
            },
          }}
        >
          <Menu />
        </IconButton>

        {/* ===============================================
            WELCOME
        ================================================ */}

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
                xs: "1.05rem",
                sm: "1.25rem",
              },

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
                xs: "0.75rem",
                sm: "0.875rem",
              },
            }}
          >
            Member ID :{" "}
            {user?.userId || "-"}
          </Typography>
        </Box>

        {/* ===============================================
            CART
        ================================================ */}

        <Tooltip title="Cart">
          <IconButton
            onClick={
              handleCartClick
            }
            sx={{
              mr: {
                xs: 0.5,
                sm: 1,
              },

              color: "#2E7D32",

              "&:hover": {
                backgroundColor:
                  "#E8F5E9",
              },
            }}
          >
            <Badge
              badgeContent={
                cartCount
              }
              color="error"
              max={99}
              showZero={false}
            >
              <ShoppingCart />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* ===============================================
            NOTIFICATIONS
        ================================================ */}

        <IconButton
          sx={{
            mr: {
              xs: 0.5,
              sm: 1,
            },
          }}
        >
          <Badge
            badgeContent={2}
            color="error"
          >
            <Notifications />
          </Badge>
        </IconButton>

        {/* ===============================================
            AVATAR
        ================================================ */}

        <Avatar
          sx={{
            bgcolor: "#2E7D32",

            ml: {
              xs: 0.5,
              sm: 1,
            },

            width: {
              xs: 42,
              sm: 48,
            },

            height: {
              xs: 42,
              sm: 48,
            },

            fontWeight: "bold",
          }}
        >
          {user?.name
            ?.charAt(0)
            ?.toUpperCase() || "M"}
        </Avatar>
      </Toolbar>
    </AppBar>
  );
};

export default MemberTopbar;