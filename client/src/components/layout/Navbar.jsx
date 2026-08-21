import { useEffect, useState } from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Badge,
} from "@mui/material";

import {
  Menu as MenuIcon,
  ShoppingBag,
  ShoppingCartOutlined,
  Inventory2Outlined,
  PersonOutline,
  LogoutOutlined,
  Close as CloseIcon,
} from "@mui/icons-material";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

const navItems = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "About",
    path: "/about",
  },
  {
    name: "Products",
    path: "/products",
  },
  {
    name: "Contact",
    path: "/contact",
  },
];

const getProfilePath = () => {
  let user = {};

  try {
    user = JSON.parse(
      localStorage.getItem("user") ||
        sessionStorage.getItem("user") ||
        "{}"
    );
  } catch (error) {
    console.error("Unable to read the logged-in user:", error);
  }

  const role = String(user?.role || "").toUpperCase();

  if (role === "MANAGER") {
    return "/manager/profile";
  }

  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return "/admin/profile";
  }

  return "/member/profile";
};

const Navbar = () => {
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const profilePath = getProfilePath();

  /* =====================================================
     LOGIN STATUS
  ===================================================== */

  const checkLoginStatus = () => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    setIsLoggedIn(Boolean(token));
  };

  useEffect(() => {
    checkLoginStatus();

    window.addEventListener(
      "auth-login",
      checkLoginStatus
    );

    window.addEventListener(
      "auth-logout",
      checkLoginStatus
    );

    window.addEventListener(
      "storage",
      checkLoginStatus
    );

    return () => {
      window.removeEventListener(
        "auth-login",
        checkLoginStatus
      );

      window.removeEventListener(
        "auth-logout",
        checkLoginStatus
      );

      window.removeEventListener(
        "storage",
        checkLoginStatus
      );
    };
  }, []);

  /* =====================================================
     DRAWER
  ===================================================== */

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const closeDrawer = () => {
    setMobileOpen(false);
  };

  /* =====================================================
     CART
  ===================================================== */

  const handleCartClick = () => {
    closeDrawer();
    navigate("/cart");
  };

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

    setIsLoggedIn(false);
    closeDrawer();

    navigate("/login");
  };

  return (
    <>
      {/* =================================================
          APP BAR
      ================================================= */}

      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(14px)",
          borderBottom:
            "1px solid rgba(0,0,0,0.08)",
          color: "#222",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              minHeight: {
                xs: 62,
                sm: 70,
                md: 76,
              },

              px: {
                xs: 1,
                sm: 1,
                md: 2,
              },

              display: "flex",
              alignItems: "center",
            }}
          >

            {/* =================================================
                MOBILE MENU BUTTON
            ================================================= */}

            <IconButton
              onClick={handleDrawerToggle}
              aria-label="Open menu"
              sx={{
                display: {
                  xs: "flex",
                  md: "none",
                },

                color: "#2E7D32",

                mr: 0.5,

                width: 44,
                height: 44,
              }}
            >
              {mobileOpen ? (
                <CloseIcon />
              ) : (
                <MenuIcon />
              )}
            </IconButton>


            {/* =================================================
                LOGO
            ================================================= */}

            <Box
              onClick={() => {
                closeDrawer();
                navigate("/");
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: {
                  xs: 0.7,
                  sm: 1,
                },

                cursor: "pointer",

                minWidth: 0,

                flexShrink: 1,
              }}
            >
              <ShoppingBag
                sx={{
                  color: "#2E7D32",

                  fontSize: {
                    xs: 27,
                    sm: 32,
                    md: 34,
                  },

                  flexShrink: 0,
                }}
              />

              <Typography
                sx={{
                  fontWeight: 700,

                  color: "#2E7D32",

                  letterSpacing: {
                    xs: 0.2,
                    sm: 0.5,
                    md: 1,
                  },

                  fontSize: {
                    xs: "1rem",
                    sm: "1.25rem",
                    md: "1.5rem",
                  },

                  whiteSpace: "nowrap",

                  overflow: "hidden",

                  textOverflow: "ellipsis",
                }}
              >
                Bhagyamma Hub
              </Typography>
            </Box>


            {/* =================================================
                DESKTOP NAVIGATION
            ================================================= */}

            <Box
              sx={{
                display: {
                  xs: "none",
                  md: "flex",
                },

                gap: 0.5,

                alignItems: "center",

                ml: "auto",
              }}
            >

              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={NavLink}
                  to={item.path}
                  sx={{
                    color: "#333",

                    px: 1.8,
                    py: 1,

                    borderRadius: 2,

                    textTransform: "none",

                    fontWeight: 600,

                    "&.active": {
                      color: "#fff",
                      bgcolor: "#2E7D32",
                    },

                    "&:hover": {
                      bgcolor: "#E8F5E9",
                    },
                  }}
                >
                  {item.name}
                </Button>
              ))}


              {/* CART */}

              <Button
                component={NavLink}
                to="/cart"
                startIcon={
                  <ShoppingCartOutlined />
                }
                sx={{
                  color: "#333",

                  px: 1.8,
                  py: 1,

                  borderRadius: 2,

                  textTransform: "none",

                  fontWeight: 600,

                  "&.active": {
                    color: "#fff",
                    bgcolor: "#2E7D32",
                  },

                  "&:hover": {
                    bgcolor: "#E8F5E9",
                  },
                }}
              >
                Cart
              </Button>


              {/* ORDERS */}

              <Button
                component={NavLink}
                to="/orders"
                startIcon={
                  <Inventory2Outlined />
                }
                sx={{
                  color: "#333",

                  px: 1.8,
                  py: 1,

                  borderRadius: 2,

                  textTransform: "none",

                  fontWeight: 600,

                  "&.active": {
                    color: "#fff",
                    bgcolor: "#2E7D32",
                  },

                  "&:hover": {
                    bgcolor: "#E8F5E9",
                  },
                }}
              >
                Orders
              </Button>


              {/* LOGIN */}

              {!isLoggedIn && (
                <>
                  <Button
                    component={NavLink}
                    to="/login"
                    variant="outlined"
                    color="success"
                    sx={{
                      ml: 1,

                      textTransform: "none",

                      borderRadius: 2,

                      fontWeight: 700,
                    }}
                  >
                    Login
                  </Button>

                  <Button
                    component={NavLink}
                    to="/register"
                    variant="contained"
                    color="success"
                    sx={{
                      textTransform: "none",

                      borderRadius: 2,

                      fontWeight: 700,
                    }}
                  >
                    Register
                  </Button>
                </>
              )}


              {/* LOGGED IN */}

              {isLoggedIn && (
                <>
                  <Button
                    component={NavLink}
                    to={profilePath}
                    startIcon={
                      <PersonOutline />
                    }
                    variant="outlined"
                    color="success"
                    sx={{
                      ml: 1,

                      textTransform: "none",

                      borderRadius: 2,

                      fontWeight: 700,
                    }}
                  >
                    Profile
                  </Button>

                  <Button
                    onClick={handleLogout}
                    startIcon={
                      <LogoutOutlined />
                    }
                    variant="contained"
                    color="success"
                    sx={{
                      textTransform: "none",

                      borderRadius: 2,

                      fontWeight: 700,
                    }}
                  >
                    Logout
                  </Button>
                </>
              )}
            </Box>


            {/* =================================================
                MOBILE CART
            ================================================= */}

            <Box
              sx={{
                display: {
                  xs: "flex",
                  md: "none",
                },

                alignItems: "center",

                ml: "auto",
              }}
            >
              <IconButton
                onClick={handleCartClick}
                aria-label="Cart"
                sx={{
                  color: "#2E7D32",

                  width: 44,
                  height: 44,

                  "&:hover": {
                    bgcolor: "#E8F5E9",
                  },
                }}
              >
                <Badge
                  badgeContent={0}
                  color="error"
                  invisible
                >
                  <ShoppingCartOutlined
                    sx={{
                      fontSize: 27,
                    }}
                  />
                </Badge>
              </IconButton>
            </Box>

          </Toolbar>
        </Container>
      </AppBar>


      {/* =====================================================
          MOBILE DRAWER
      ===================================================== */}

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={closeDrawer}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          "& .MuiDrawer-paper": {
            width: {
              xs: "82vw",
              sm: 320,
            },

            maxWidth: 340,

            boxSizing: "border-box",
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
          }}
        >

          {/* DRAWER HEADER */}

          <Box
            sx={{
              p: 2.5,

              display: "flex",

              alignItems: "center",

              gap: 1,
            }}
          >
            <ShoppingBag
              sx={{
                color: "#2E7D32",
                fontSize: 30,
              }}
            />

            <Typography
              variant="h6"
              sx={{
                color: "#2E7D32",
                fontWeight: "bold",
              }}
            >
              Bhagyamma Hub
            </Typography>
          </Box>

          <Divider />


          {/* MENU */}

          <List>

            {navItems.map((item) => (
              <ListItem
                key={item.path}
                disablePadding
              >
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  onClick={closeDrawer}
                >
                  <ListItemText
                    primary={item.name}
                  />
                </ListItemButton>
              </ListItem>
            ))}


            {/* CART */}

            <ListItem disablePadding>
              <ListItemButton
                onClick={handleCartClick}
              >
                <ShoppingCartOutlined
                  sx={{
                    mr: 2,
                    color: "#2E7D32",
                  }}
                />

                <ListItemText
                  primary="Cart"
                />
              </ListItemButton>
            </ListItem>


            {/* ORDERS */}

            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/orders"
                onClick={closeDrawer}
              >
                <Inventory2Outlined
                  sx={{
                    mr: 2,
                    color: "#2E7D32",
                  }}
                />

                <ListItemText
                  primary="Orders"
                />
              </ListItemButton>
            </ListItem>


            <Divider sx={{ my: 2 }} />


            {/* LOGGED OUT */}

            {!isLoggedIn && (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    component={NavLink}
                    to="/login"
                    onClick={closeDrawer}
                  >
                    <ListItemText
                      primary="Login"
                    />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    component={NavLink}
                    to="/register"
                    onClick={closeDrawer}
                  >
                    <ListItemText
                      primary="Register"
                    />
                  </ListItemButton>
                </ListItem>
              </>
            )}


            {/* LOGGED IN */}

            {isLoggedIn && (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    component={NavLink}
                    to={profilePath}
                    onClick={closeDrawer}
                  >
                    <PersonOutline
                      sx={{
                        mr: 2,
                        color: "#2E7D32",
                      }}
                    />

                    <ListItemText
                      primary="Profile"
                    />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    onClick={handleLogout}
                  >
                    <LogoutOutlined
                      sx={{
                        mr: 2,
                        color: "#2E7D32",
                      }}
                    />

                    <ListItemText
                      primary="Logout"
                    />
                  </ListItemButton>
                </ListItem>
              </>
            )}

          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
