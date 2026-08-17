import { useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import MemberSidebar from "../components/members/layout/MemberSidebar";
import MemberTopbar from "../components/members/layout/MemberTopbar";

const DRAWER_WIDTH = 280;

const MemberLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerOpen = () => {
    setMobileOpen(true);
  };

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
      {/* =====================================================
          MEMBER SIDEBAR
      ===================================================== */}
      <MemberSidebar
        mobileOpen={mobileOpen}
        onClose={handleDrawerClose}
      />

      {/* =====================================================
          MAIN AREA
      ===================================================== */}
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
        }}
      >
        {/* ===================================================
            TOPBAR
        =================================================== */}
        <MemberTopbar onMenuClick={handleDrawerOpen} />

        {/* ===================================================
            PAGE CONTENT
        =================================================== */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
            overflowX: "hidden",

            px: {
              xs: 1.5,
              sm: 2,
              md: 3,
              lg: 4,
            },

            py: {
              xs: 2,
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

export default MemberLayout;