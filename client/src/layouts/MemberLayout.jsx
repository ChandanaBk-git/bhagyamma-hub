import { useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import MemberSidebar from "../components/members/layout/MemberSidebar";
import MemberTopbar from "../components/members/layout/MemberTopbar";

const DRAWER_WIDTH = 280;

const MemberLayout = ({ children }) => {

  const [mobileOpen, setMobileOpen] =
    useState(false);


  // =====================================================
  // OPEN MOBILE SIDEBAR
  // =====================================================

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };


  // =====================================================
  // CLOSE MOBILE SIDEBAR
  // =====================================================

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };


  return (
    <Box
      sx={{
        display: "flex",

        minHeight: "100vh",

        width: "100%",

        maxWidth: "100%",

        overflowX: "hidden",

        bgcolor: "#F5F7FA",
      }}
    >

      {/* =================================================
          MEMBER SIDEBAR
      ================================================= */}

      <MemberSidebar
        mobileOpen={mobileOpen}
        onClose={handleDrawerClose}
      />


      {/* =================================================
          MAIN AREA
      ================================================= */}

      <Box
        component="main"
        sx={{
          flexGrow: 1,

          minWidth: 0,

          width: {
            xs: "100%",

            md: `calc(100% - ${DRAWER_WIDTH}px)`,
          },

          maxWidth: "100%",

          overflowX: "hidden",
          borderRadius: 0,
        }}
      >

        {/* =================================================
            MEMBER TOPBAR
        ================================================= */}

        <MemberTopbar
          onMenuClick={handleDrawerToggle}
        />


        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <Box
          sx={{
            width: "100%",

            maxWidth: "100%",

            minWidth: 0,

            overflowX: "hidden",

            px: {
              xs: 0,
              sm: 1,
              md: 2,
              lg: 3,
            },

            py: {
              xs: 0.5,
              sm: 1,
              md: 1.5,
            },

            borderRadius: 0,
          }}
        >

          {/* =================================================
              IMPORTANT

              If children exist, render children.

              Otherwise render the React Router Outlet.

              This allows:

              /member/dashboard
                    → Outlet

              /
                    → Home as children
          ================================================= */}

          {children || <Outlet />}

        </Box>

      </Box>

    </Box>
  );
};

export default MemberLayout;