import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

import MemberSidebar from "../components/members/layout/MemberSidebar";
import MemberTopbar from "../components/members/layout/MemberTopbar";

const MemberLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#f5f7fa",
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
          MAIN CONTENT
      ===================================================== */}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ===================================================
            MEMBER TOPBAR
        =================================================== */}

        <MemberTopbar
          onMenuClick={handleDrawerToggle}
        />

        {/* ===================================================
            PAGE CONTENT
        =================================================== */}

        <Box
          sx={{
            flexGrow: 1,

            p: {
              xs: 1.5,
              sm: 2,
              md: 3,
            },

            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MemberLayout;