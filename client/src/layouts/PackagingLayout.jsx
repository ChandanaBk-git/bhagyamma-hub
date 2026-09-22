import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

import {
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

const DRAWER_WIDTH = 250;

const PackagingLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [user, setUser] = React.useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("packagingUser") || "{}"
      );
    } catch (error) {
      return {};
    }
  });

  const menuItems = [
    {
      label: "Dashboard",
      path: "/packaging/dashboard",
      icon: <DashboardRoundedIcon />,
    },
    {
      label: "Orders",
      path: "/packaging/orders",
      icon: <Inventory2RoundedIcon />,
    },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleProfileMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("packagingToken");
    localStorage.removeItem("packagingUser");

    setAnchorEl(null);

    navigate("/packaging/login", {
      replace: true,
    });
  };

  const isActive = (path) => {
    if (path === "/packaging/dashboard") {
      return (
        location.pathname === "/packaging" ||
        location.pathname === "/packaging/dashboard"
      );
    }

    return location.pathname.startsWith(path);
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffffff",
      }}
    >
      {/* =================================================
          LOGO / BRAND
      ================================================= */}

      <Box
        sx={{
          height: 72,
          display: "flex",
          alignItems: "center",
          px: 2.5,
          borderBottom: "1px solid #eeeeee",
        }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg, #6a1b9a, #8e24aa)",
            color: "#ffffff",
            fontWeight: 800,
            fontSize: 18,
          }}
        >
          BH
        </Box>

        <Box sx={{ ml: 1.5 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 800,
              lineHeight: 1.1,
              color: "#222222",
            }}
          >
            Bhagyamma Hub
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: "#777777",
              fontWeight: 600,
            }}
          >
            Packaging Team
          </Typography>
        </Box>
      </Box>

      {/* =================================================
          MENU
      ================================================= */}

      <Box sx={{ px: 1.5, pt: 2 }}>
        <Typography
          variant="caption"
          sx={{
            px: 1.5,
            color: "#999999",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 0.8,
          }}
        >
          Packaging
        </Typography>

        <List sx={{ mt: 1 }}>
          {menuItems.map((item) => {
            const active = isActive(item.path);

            return (
              <ListItemButton
                key={item.path}
                onClick={() =>
                  handleNavigation(item.path)
                }
                sx={{
                  minHeight: 48,
                  mb: 0.5,
                  borderRadius: 2,
                  color: active
                    ? "#6a1b9a"
                    : "#555555",
                  backgroundColor: active
                    ? "rgba(106, 27, 154, 0.10)"
                    : "transparent",

                  "&:hover": {
                    backgroundColor:
                      "rgba(106, 27, 154, 0.07)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 42,
                    color: active
                      ? "#6a1b9a"
                      : "#777777",
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: active ? 700 : 500,
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      <Divider />

      {/* =================================================
          LOGGED-IN USER
      ================================================= */}

      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Avatar
          sx={{
            width: 38,
            height: 38,
            backgroundColor: "#6a1b9a",
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          {String(user?.name || "P")
            .charAt(0)
            .toUpperCase()}
        </Avatar>

        <Box
          sx={{
            ml: 1.2,
            minWidth: 0,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: "#222222",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user?.name || "Packaging Staff"}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: "#888888",
            }}
          >
            {user?.loginId || "PACKAGING"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f7f7f9",
      }}
    >
      {/* =================================================
          DESKTOP DRAWER
      ================================================= */}

      <Box
        component="nav"
        sx={{
          width: {
            xs: 0,
            md: DRAWER_WIDTH,
          },
          flexShrink: 0,
        }}
      >
        <Drawer
          variant="permanent"
          sx={{
            display: {
              xs: "none",
              md: "block",
            },

            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              borderRight: "1px solid #eeeeee",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* =================================================
          MOBILE DRAWER
      ================================================= */}

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
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
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: "#ffffff",
            color: "#222222",
            borderBottom: "1px solid #eeeeee",
          }}
        >
          <Toolbar
            sx={{
              minHeight: "72px !important",
              px: {
                xs: 1.5,
                sm: 3,
              },
            }}
          >
            {/* MOBILE MENU */}

            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                display: {
                  xs: "inline-flex",
                  md: "none",
                },
                mr: 1,
              }}
            >
              <MenuRoundedIcon />
            </IconButton>

            {/* PAGE TITLE */}

            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: "#222222",
                }}
              >
                Packaging Team
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  color: "#888888",
                }}
              >
                Manage and prepare customer orders
              </Typography>
            </Box>

            {/* USER */}

            <IconButton
              onClick={handleProfileMenu}
              sx={{
                ml: 1,
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: "#6a1b9a",
                  fontSize: 15,
                  fontWeight: 700,
                }}
              >
                {String(user?.name || "P")
                  .charAt(0)
                  .toUpperCase()}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem disabled>
                <AccountCircleRoundedIcon
                  sx={{
                    mr: 1,
                    fontSize: 20,
                  }}
                />

                {user?.name || "Packaging Staff"}
              </MenuItem>

              <Divider />

              <MenuItem onClick={handleLogout}>
                <LogoutRoundedIcon
                  sx={{
                    mr: 1,
                    fontSize: 20,
                  }}
                />

                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: {
              xs: 1.5,
              sm: 2.5,
              md: 3,
            },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default PackagingLayout;