import { useState } from "react";
import { Outlet } from "react-router-dom";

import {
  Box,
  Toolbar,
  CssBaseline,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import Sidebar from "../components/sidebar/Sidebar";
import TopNavbar from "../components/navbar/TopNavbar";

const drawerWidth = 260;

const AdminLayout = () => {
  const theme = useTheme();

  // Mobile Detection
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Sidebar Open / Close
  const [mobileOpen, setMobileOpen] = useState(false);

  // Desktop Collapse
  const [collapsed, setCollapsed] = useState(false);

  // Open Drawer
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Collapse Sidebar
  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  // Drawer Width
  const currentDrawerWidth = collapsed ? 80 : drawerWidth;
  return (
  <>
    <CssBaseline />

    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#F5F7FA",
      }}
    >
      {/* Sidebar */}

      <Sidebar
        drawerWidth={currentDrawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        collapsed={collapsed}
      />

      {/* Main Content */}

      <Box
        component="main"
        sx={{
          flexGrow: 1,

          width: {
            md: `calc(100% - ${currentDrawerWidth}px)`,
          },

          ml: {
            md: `${currentDrawerWidth}px`,
          },

          transition: "all .3s ease",

          display: "flex",

          flexDirection: "column",

          minHeight: "100vh",
        }}
      >
        {/* Top Navbar */}

        <TopNavbar
          drawerWidth={currentDrawerWidth}
          collapsed={collapsed}
          handleCollapse={handleCollapse}
          handleDrawerToggle={handleDrawerToggle}
          isMobile={isMobile}
        />

        <Toolbar />

                {/* Page Content */}

        <Box
          sx={{
            flexGrow: 1,

            p: {
              xs: 2,
              sm: 3,
              md: 4,
            },

            bgcolor: "#F5F7FA",

            overflow: "auto",

            transition: "all .3s ease",
          }}
        >
          <Outlet />
        </Box>

      </Box>

    </Box>

  </>
);

};

export default AdminLayout;