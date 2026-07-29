import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from "@mui/material";
import { NavLink } from "react-router-dom";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Products", path: "/products" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  return (
    <AppBar position="sticky" color="inherit" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo */}
          <Typography
            variant="h5"
            sx={{
              color: "#2E7D32",
              fontWeight: 700,
            }}
          >
            Bhagyamma Hub
          </Typography>

          {/* Navigation */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={NavLink}
                to={item.path}
                sx={{
                  color: "#333",
                  fontWeight: 600,
                }}
              >
                {item.name}
              </Button>
            ))}

            {/* Login Button */}
            <Button
              component={NavLink}
              to="/login"
              variant="outlined"
              color="success"
            >
              Login
            </Button>

            {/* Register Button */}
            <Button
              component={NavLink}
              to="/register"
              variant="contained"
              color="success"
            >
              Register
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;