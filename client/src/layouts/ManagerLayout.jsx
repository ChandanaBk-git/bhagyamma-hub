import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, IconButton } from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import ManagerSidebar from "../components/manager/Sidebar";
import ManagerNavbar from "../components/manager/Navbar";

const ManagerLayout = () => {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  const handleToggleSidebar = () => {
    setMobileOpen(
      (previous) => !previous
    );
  };

  const handleCloseSidebar = () => {
    setMobileOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        bgcolor: "#F5F7FA",
        overflowX: "hidden",
      }}
    >

      {/* =================================================
          DESKTOP SIDEBAR
      ================================================= */}

      <Box
        sx={{
          display: {
            xs: "none",
            md: "block",
          },

          flexShrink: 0,
        }}
      >
        <ManagerSidebar />
      </Box>


      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {mobileOpen && (
        <Box
          onClick={handleCloseSidebar}
          sx={{
            display: {
              xs: "block",
              md: "none",
            },

            position: "fixed",
            inset: 0,

            bgcolor:
              "rgba(15, 23, 42, 0.55)",

            zIndex: 1199,
          }}
        />
      )}


      {/* =================================================
          MOBILE SIDEBAR
      ================================================= */}

      <Box
        sx={{
          display: {
            xs: "block",
            md: "none",
          },

          position: "fixed",

          top: 0,
          left: 0,
          bottom: 0,

          width: {
            xs: "min(280px, 82vw)",
          },

          zIndex: 1200,

          transform: mobileOpen
            ? "translateX(0)"
            : "translateX(-105%)",

          transition:
            "transform 0.25s ease",

          boxShadow:
            mobileOpen
              ? "8px 0 25px rgba(0,0,0,0.18)"
              : "none",
        }}
      >

        {/* Close button */}

        <IconButton
          onClick={handleCloseSidebar}
          aria-label="Close menu"
          sx={{
            position: "absolute",
            top: 10,
            right: 8,
            zIndex: 10,

            color: "#fff",

            bgcolor:
              "rgba(255,255,255,0.08)",

            "&:hover": {
              bgcolor:
                "rgba(255,255,255,0.16)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        <ManagerSidebar />

      </Box>


      {/* =================================================
          MAIN APPLICATION
      ================================================= */}

      <Box
        sx={{
          flex: 1,

          minWidth: 0,

          width: "100%",

          display: "flex",

          flexDirection: "column",

          overflow: "hidden",

          bgcolor: "#F5F7FA",
        }}
      >

        {/* =================================================
            NAVBAR
        ================================================= */}

        <Box
          sx={{
            flexShrink: 0,
            width: "100%",
          }}
        >

          <ManagerNavbar
            onMenuClick={
              handleToggleSidebar
            }
          />

        </Box>


        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <Box
          component="main"
          sx={{
            flex: 1,

            minWidth: 0,

            width: "100%",

            overflowX: "hidden",

            overflowY: "auto",

            p: {
              xs: 1.5,
              sm: 2,
              md: 3,
            },

            pb: {
              xs: 3,
              md: 3,
            },

            boxSizing: "border-box",
          }}
        >

          <Box
            sx={{
              width: "100%",
              maxWidth: "100%",
              minWidth: 0,
            }}
          >
            <Outlet />
          </Box>

        </Box>

      </Box>

    </Box>
  );
};

export default ManagerLayout;