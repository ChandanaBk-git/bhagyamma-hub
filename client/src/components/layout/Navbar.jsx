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
} from "@mui/material";

import {
  Menu as MenuIcon,
  ShoppingBag,
  ShoppingCartOutlined,
  Inventory2Outlined,
  PersonOutline,
  LogoutOutlined,
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

const Navbar = () => {
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  /* =====================================================
     CHECK LOGIN STATUS
  ===================================================== */

  const checkLoginStatus = () => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    setIsLoggedIn(Boolean(token));
  };

  /* =====================================================
     INITIAL LOGIN CHECK
  ===================================================== */

  useEffect(() => {
    checkLoginStatus();

    /*
     * LoginForm dispatches this event
     * after successful login.
     */
    window.addEventListener(
      "auth-login",
      checkLoginStatus
    );

    /*
     * Useful after logout.
     */
    window.addEventListener(
      "auth-logout",
      checkLoginStatus
    );

    /*
     * Also check when storage changes.
     */
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
     MOBILE DRAWER
  ===================================================== */

  const toggleDrawer = () => {
    setMobileOpen((prev) => !prev);
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    /*
     * Notify other components that
     * authentication has changed.
     */
    window.dispatchEvent(
      new Event("auth-logout")
    );

    setIsLoggedIn(false);

    setMobileOpen(false);

    /*
     * Send user to Login page.
     * Login page now has Home navigation.
     */
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
          bgcolor:
            "rgba(255,255,255,0.92)",

          backdropFilter:
            "blur(14px)",

          borderBottom:
            "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <Container maxWidth="xl">

          <Toolbar
            sx={{
              minHeight: {
                xs: 65,
                sm: 75,
              },

              justifyContent:
                "space-between",

              px: {
                xs: 0,
                sm: 1,
              },
            }}
          >

            {/* =================================================
                LOGO
            ================================================= */}

            <Box
              display="flex"
              alignItems="center"
              gap={1}
              sx={{
                cursor: "pointer",
              }}
              onClick={() =>
                navigate("/")
              }
            >
              <ShoppingBag
                sx={{
                  color: "#2E7D32",

                  fontSize: {
                    xs: 28,
                    sm: 34,
                  },
                }}
              />

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,

                  color: "#2E7D32",

                  letterSpacing: {
                    xs: 0.5,
                    sm: 1,
                  },

                  fontSize: {
                    xs: "1.15rem",
                    sm: "1.5rem",
                  },
                }}
              >
                Bhagyamma Hub
              </Typography>
            </Box>


            {/* =================================================
                DESKTOP MENU
            ================================================= */}

            <Box
              sx={{
                display: {
                  xs: "none",
                  md: "flex",
                },

                gap: 0.5,

                alignItems: "center",
              }}
            >

              {/* HOME / ABOUT / PRODUCTS / CONTACT */}

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

                    textTransform:
                      "none",

                    fontWeight: 600,

                    "&.active": {
                      color: "#fff",

                      bgcolor:
                        "#2E7D32",
                    },

                    "&:hover": {
                      bgcolor:
                        "#E8F5E9",
                    },
                  }}
                >
                  {item.name}
                </Button>
              ))}


              {/* =================================================
                  CART
              ================================================= */}

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

                  textTransform:
                    "none",

                  fontWeight: 600,

                  "&.active": {
                    color: "#fff",

                    bgcolor:
                      "#2E7D32",
                  },

                  "&:hover": {
                    bgcolor:
                      "#E8F5E9",
                  },
                }}
              >
                Cart
              </Button>


              {/* =================================================
                  PUBLIC ORDERS
              ================================================= */}

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

                  textTransform:
                    "none",

                  fontWeight: 600,

                  "&.active": {
                    color: "#fff",

                    bgcolor:
                      "#2E7D32",
                  },

                  "&:hover": {
                    bgcolor:
                      "#E8F5E9",
                  },
                }}
              >
                Orders
              </Button>


              {/* =================================================
                  LOGGED OUT
              ================================================= */}

              {!isLoggedIn && (
                <>
                  <Button
                    component={NavLink}
                    to="/login"
                    variant="outlined"
                    color="success"
                    sx={{
                      ml: 1.5,

                      textTransform:
                        "none",

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
                      textTransform:
                        "none",

                      borderRadius: 2,

                      fontWeight: 700,
                    }}
                  >
                    Register
                  </Button>
                </>
              )}


              {/* =================================================
                  LOGGED IN
              ================================================= */}

              {isLoggedIn && (
                <>
                  <Button
                    component={NavLink}
                    to="/member/profile"
                    startIcon={
                      <PersonOutline />
                    }
                    variant="outlined"
                    color="success"
                    sx={{
                      ml: 1.5,

                      textTransform:
                        "none",

                      borderRadius: 2,

                      fontWeight: 700,
                    }}
                  >
                    Profile
                  </Button>

                  <Button
                    onClick={
                      handleLogout
                    }
                    startIcon={
                      <LogoutOutlined />
                    }
                    variant="contained"
                    color="success"
                    sx={{
                      textTransform:
                        "none",

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
                MOBILE MENU BUTTON
            ================================================= */}

            <IconButton
              sx={{
                display: {
                  xs: "flex",
                  md: "none",
                },

                color: "#2E7D32",
              }}
              onClick={
                toggleDrawer
              }
            >
              <MenuIcon />
            </IconButton>

          </Toolbar>
        </Container>
      </AppBar>


      {/* =====================================================
          MOBILE DRAWER
      ===================================================== */}

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={
          toggleDrawer
        }
      >
        <Box
          sx={{
            width: {
              xs: "82vw",
              sm: 300,
            },

            maxWidth: 320,
          }}
        >

          {/* =================================================
              DRAWER HEADER
          ================================================= */}

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
                color:
                  "#2E7D32",

                fontSize: 30,
              }}
            />

            <Typography
              variant="h6"
              sx={{
                color:
                  "#2E7D32",

                fontWeight:
                  "bold",
              }}
            >
              Bhagyamma Hub
            </Typography>
          </Box>

          <Divider />


          {/* =================================================
              NAVIGATION
          ================================================= */}

          <List>

            {/* HOME / ABOUT / PRODUCTS / CONTACT */}

            {navItems.map(
              (item) => (
                <ListItem
                  key={
                    item.path
                  }
                  disablePadding
                >
                  <ListItemButton
                    component={
                      NavLink
                    }
                    to={
                      item.path
                    }
                    onClick={
                      toggleDrawer
                    }
                  >
                    <ListItemText
                      primary={
                        item.name
                      }
                    />
                  </ListItemButton>
                </ListItem>
              )
            )}


            {/* =================================================
                CART
            ================================================= */}

            <ListItem
              disablePadding
            >
              <ListItemButton
                component={
                  NavLink
                }
                to="/cart"
                onClick={
                  toggleDrawer
                }
              >
                <ShoppingCartOutlined
                  sx={{
                    mr: 2,

                    color:
                      "#333",
                  }}
                />

                <ListItemText
                  primary="Cart"
                />
              </ListItemButton>
            </ListItem>


            {/* =================================================
                ORDERS
            ================================================= */}

            <ListItem
              disablePadding
            >
              <ListItemButton
                component={
                  NavLink
                }
                to="/orders"
                onClick={
                  toggleDrawer
                }
              >
                <Inventory2Outlined
                  sx={{
                    mr: 2,

                    color:
                      "#333",
                  }}
                />

                <ListItemText
                  primary="Orders"
                />
              </ListItemButton>
            </ListItem>


            <Divider
              sx={{
                my: 2,
              }}
            />


            {/* =================================================
                LOGGED OUT MOBILE
            ================================================= */}

            {!isLoggedIn && (
              <>
                <ListItem
                  disablePadding
                >
                  <ListItemButton
                    component={
                      NavLink
                    }
                    to="/login"
                    onClick={
                      toggleDrawer
                    }
                  >
                    <ListItemText
                      primary="Login"
                    />
                  </ListItemButton>
                </ListItem>

                <ListItem
                  disablePadding
                >
                  <ListItemButton
                    component={
                      NavLink
                    }
                    to="/register"
                    onClick={
                      toggleDrawer
                    }
                  >
                    <ListItemText
                      primary="Register"
                    />
                  </ListItemButton>
                </ListItem>
              </>
            )}


            {/* =================================================
                LOGGED IN MOBILE
            ================================================= */}

            {isLoggedIn && (
              <>
                <ListItem
                  disablePadding
                >
                  <ListItemButton
                    component={
                      NavLink
                    }
                    to="/member/profile"
                    onClick={
                      toggleDrawer
                    }
                  >
                    <PersonOutline
                      sx={{
                        mr: 2,

                        color:
                          "#2E7D32",
                      }}
                    />

                    <ListItemText
                      primary="Profile"
                    />
                  </ListItemButton>
                </ListItem>

                <ListItem
                  disablePadding
                >
                  <ListItemButton
                    onClick={
                      handleLogout
                    }
                  >
                    <LogoutOutlined
                      sx={{
                        mr: 2,

                        color:
                          "#2E7D32",
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