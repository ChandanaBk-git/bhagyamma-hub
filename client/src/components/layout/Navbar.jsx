import { useState } from "react";
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
} from "@mui/icons-material";

import { NavLink } from "react-router-dom";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Products", path: "/products" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            sx={{
              minHeight: 75,
              justifyContent: "space-between",
            }}
          >
            {/* Logo */}

            <Box
              display="flex"
              alignItems="center"
              gap={1}
            >
              <ShoppingBag
                sx={{
                  color: "#2E7D32",
                  fontSize: 34,
                }}
              />

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "#2E7D32",
                  letterSpacing: 1,
                }}
              >
                Bhagyamma Hub
              </Typography>
            </Box>

            {/* Desktop Menu */}

            <Box
              sx={{
                display: {
                  xs: "none",
                  md: "flex",
                },
                gap: 1,
                alignItems: "center",
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={NavLink}
                  to={item.path}
                  sx={{
                    color: "#333",
                    px: 2,
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

              <Button
                component={NavLink}
                to="/login"
                variant="outlined"
                color="success"
                sx={{
                  ml: 2,
                  textTransform: "none",
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
                }}
              >
                Register
              </Button>
            </Box>

            {/* Mobile Menu */}

            <IconButton
              sx={{
                display: {
                  md: "none",
                },
              }}
              onClick={toggleDrawer}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Drawer */}

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={toggleDrawer}
      >
        <Box sx={{ width: 260 }}>
          <Typography
            variant="h5"
            sx={{
              p: 2,
              color: "#2E7D32",
              fontWeight: "bold",
            }}
          >
            Bhagyamma Hub
          </Typography>

          <Divider />

          <List>
            {navItems.map((item) => (
              <ListItem
                key={item.path}
                disablePadding
              >
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  onClick={toggleDrawer}
                >
                  <ListItemText
                    primary={item.name}
                  />
                </ListItemButton>
              </ListItem>
            ))}

            <Divider sx={{ my: 2 }} />

            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/login"
                onClick={toggleDrawer}
              >
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/register"
                onClick={toggleDrawer}
              >
                <ListItemText primary="Register" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;