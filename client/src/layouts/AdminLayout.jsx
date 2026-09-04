import { useState } from "react";
import { Outlet } from "react-router-dom";

import {
  Box,
  CssBaseline,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import Sidebar from "../components/sidebar/Sidebar";
import TopNavbar from "../components/navbar/TopNavbar";

const drawerWidth = 260;
const collapsedDrawerWidth = 80;

const AdminLayout = () => {
  const theme = useTheme();

  // =========================================
  // MOBILE DETECTION
  // =========================================

  const isMobile = useMediaQuery(
    theme.breakpoints.down("md")
  );

  // =========================================
  // MOBILE SIDEBAR
  // =========================================

  const [mobileOpen, setMobileOpen] = useState(false);

  // =========================================
  // DESKTOP SIDEBAR COLLAPSE
  // =========================================

  const [collapsed, setCollapsed] = useState(false);

  // =========================================
  // MOBILE DRAWER TOGGLE
  // =========================================

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  // =========================================
  // DESKTOP SIDEBAR COLLAPSE
  // =========================================

  const handleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  // =========================================
  // SIDEBAR WIDTH
  // =========================================

  const currentDrawerWidth = collapsed
    ? collapsedDrawerWidth
    : drawerWidth;

  return (
    <>
      <CssBaseline />

      {/* =========================================
          MAIN APPLICATION CONTAINER
      ========================================= */}

      <Box
        sx={{
          display: "flex",

          width: "100%",
          maxWidth: "100%",

          minHeight: "100vh",

          bgcolor: "#F5F7FA",

          overflowX: "hidden",

          boxSizing: "border-box",
        }}
      >
        {/* =========================================
            SIDEBAR
        ========================================= */}

        <Sidebar
          drawerWidth={currentDrawerWidth}
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
          collapsed={collapsed}
        />

        {/* =========================================
            MAIN CONTENT AREA
        ========================================= */}

        <Box
          component="main"
          sx={{
            flexGrow: 1,

            width: {
              xs: "100%",
              md: `calc(100% - ${currentDrawerWidth}px)`,
            },

            maxWidth: {
              xs: "100%",
              md: `calc(100% - ${currentDrawerWidth}px)`,
            },

            minWidth: 0,

            ml: {
              xs: 0,
              md: `${currentDrawerWidth}px`,
            },

            minHeight: "100vh",

            display: "flex",

            flexDirection: "column",

            boxSizing: "border-box",

            overflowX: "hidden",

            transition:
              "margin-left 0.3s ease, width 0.3s ease",
          }}
        >
          {/* =========================================
              TOP NAVBAR
          ========================================= */}

          <TopNavbar
            drawerWidth={currentDrawerWidth}
            collapsed={collapsed}
            handleCollapse={handleCollapse}
            handleDrawerToggle={handleDrawerToggle}
            isMobile={isMobile}
          />

          {/* =========================================
              NAVBAR SPACING
              
              IMPORTANT:
              Only desktop gets spacing.
              Mobile gets NO extra 64px gap.
          ========================================= */}

          <Toolbar
            sx={{
              display: {
                xs: "none",
                md: "block",
              },

              minHeight: {
                md: "24px !important",
              },

              height: {
                md: "24px",
              },
            }}
          />

          {/* =========================================
              PAGE CONTENT
          ========================================= */}

<Box
  sx={{
    flexGrow: 1,

    width: "100%",
    maxWidth: "100%",
    minWidth: 0,

    p: 0,
    m: 0,

    bgcolor: "#F5F7FA",

    overflowY: "auto",
    overflowX: "hidden",

    boxSizing: "border-box",

    // Small spacing below navbar on mobile
    pt: {
      xs: "10px",
      sm: "12px",
      md: 0,
    },
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