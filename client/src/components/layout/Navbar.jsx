import { useEffect, useState } from "react";
import logo from "../../assets/images/logo.png";

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
                xs: 64,
                sm: 68,
                md: 72,
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
                BRAND LOGO
            ================================================= */}

            <Box
              onClick={() => {
                closeDrawer();
                navigate("/");
              }}
              sx={{
                position: {
                  xs: "absolute",
                  md: "static",
                },

                left: {
                  xs: "50%",
                  md: "auto",
                },

                transform: {
                  xs: "translateX(-50%)",
                  md: "none",
                },

                display: "flex",
                alignItems: "center",

                cursor: "pointer",

                flexShrink: 0,
              }}
            >
              <Box
                component="img"
                src={logo}
                alt="Bhagyamma Hub"
                sx={{
                  width: {
                    xs: 48,
                    sm: 54,
                    md: 64,
                  },

                  height: {
                    xs: 48,
                    sm: 54,
                    md: 64,
                  },

                  objectFit: "contain",
                  display: "block",
                }}
              />
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

                    px: 1.25,
                    py: 0.7,

                    borderRadius: 0,

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

                  px: 1.25,
                  py: 0.7,

                  borderRadius: 0,

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

                  px: 1.25,
                  py: 0.7,

                  borderRadius: 0,

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
                      ml: 0.5,

                      textTransform: "none",

                      borderRadius: 0,

                      height: 34,

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

                      borderRadius: 0,

                      height: 34,

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
                      ml: 0.5,

                      textTransform: "none",

                      borderRadius: 0,

                      height: 34,

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

                      borderRadius: 0,

                      height: 34,

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
          ANNOUNCEMENT BAR
      ===================================================== */}

      <Box
        sx={{
          height: {
            xs: 22,
            md: 24,
          },

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          overflow: "hidden",

          bgcolor: "#1B5E20",

          color: "#fff",

          borderBottom: "1px solid #154A18",
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: "0.5rem",
              sm: "0.55rem",
              md: "0.6rem",
            },

            fontWeight: 700,

            letterSpacing: {
              xs: 0.6,
              md: 1,
            },

            whiteSpace: "nowrap",

            textTransform: "uppercase",
          }}
        >
          Quality • Trust • Wellness • Family • Bhagyamma Hub
        </Typography>
      </Box>


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
            width: "40vw",

            minWidth: "40vw",

            maxWidth: "40vw",

            borderRadius: 0,

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
              minHeight: 64,

              px: 1,

              py: 1,

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              borderBottom: "1px solid #E1E5E2",

              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="Bhagyamma Hub"
              sx={{
                width: 42,
                height: 42,
                objectFit: "contain",
                display: "block",
              }}
            />
          </Box>

          <Divider />


          {/* MENU */}

          <List
            disablePadding
            sx={{
              pt: 0.5,
            }}
          >

            {navItems.map((item) => (
              <ListItem
                key={item.path}
                disablePadding
              >
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  onClick={closeDrawer}
                  sx={{
                    minHeight: 42,
                    px: 1,
                    py: 0.4,
                    borderRadius: 0,
                    overflow: "hidden",
                    "&.active": {
                      bgcolor: "#E8F5E9",
                      color: "#1B5E20",
                      fontWeight: 700,
                    },
                    "&:hover": {
                      bgcolor: "#F5F9F5",
                    },
                  }}
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
                sx={{
                  minHeight: 42,
                  px: 1,
                  py: 0.4,
                  borderRadius: 0,
                  "&:hover": {
                    bgcolor: "#F5F9F5",
                  },
                }}
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
                sx={{
                  minHeight: 42,
                  px: 1,
                  py: 0.4,
                  borderRadius: 0,
                  "&.active": {
                    bgcolor: "#E8F5E9",
                    color: "#1B5E20",
                    fontWeight: 700,
                  },
                  "&:hover": {
                    bgcolor: "#F5F9F5",
                  },
                }}
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


            <Divider sx={{ my: 0.5 }} />


            {/* LOGGED OUT */}

            {!isLoggedIn && (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    component={NavLink}
                    to="/login"
                    onClick={closeDrawer}
                    sx={{
                      minHeight: 42,
                      px: 1,
                      py: 0.4,
                      borderRadius: 0,
                      "&.active": {
                        bgcolor: "#E8F5E9",
                        color: "#1B5E20",
                        fontWeight: 700,
                      },
                      "&:hover": {
                        bgcolor: "#F5F9F5",
                      },
                    }}
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
                    sx={{
                      minHeight: 42,
                      px: 1,
                      py: 0.4,
                      borderRadius: 0,
                      "&.active": {
                        bgcolor: "#E8F5E9",
                        color: "#1B5E20",
                        fontWeight: 700,
                      },
                      "&:hover": {
                        bgcolor: "#F5F9F5",
                      },
                    }}
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
                    sx={{
                      minHeight: 42,
                      px: 1,
                      py: 0.4,
                      borderRadius: 0,
                      "&.active": {
                        bgcolor: "#E8F5E9",
                        color: "#1B5E20",
                        fontWeight: 700,
                      },
                      "&:hover": {
                        bgcolor: "#F5F9F5",
                      },
                    }}
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
                    sx={{
                      minHeight: 42,
                      px: 1,
                      py: 0.4,
                      borderRadius: 0,
                      "&:hover": {
                        bgcolor: "#F5F9F5",
                      },
                    }}
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
