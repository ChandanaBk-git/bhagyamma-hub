import { useState } from "react";
import { Outlet } from "react-router-dom";

import {
  Box,
  IconButton,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import ManagerSidebar from "../components/manager/Sidebar";
import ManagerNavbar from "../components/manager/Navbar";


const ManagerLayout = () => {
  const [mobileOpen, setMobileOpen] =
    useState(false);


  /* =====================================================
     TOGGLE MOBILE SIDEBAR
  ===================================================== */

  const handleToggleSidebar = () => {
    setMobileOpen(
      (previous) => !previous
    );
  };


  /* =====================================================
     CLOSE MOBILE SIDEBAR
  ===================================================== */

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

          width: 260,

          minWidth: 260,

          maxWidth: 260,

          height: "100vh",

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
              "rgba(15, 23, 42, 0.45)",

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

          /*
           * =============================================
           * MOBILE SIDEBAR = 40% OF VIEWPORT WIDTH
           * =============================================
           */

          width: "40vw",

          minWidth: "40vw",

          maxWidth: "40vw",

          height: "100vh",

          zIndex: 1200,

          transform: mobileOpen
            ? "translateX(0)"
            : "translateX(-105%)",

          transition:
            "transform 0.25s ease",

          boxShadow: mobileOpen
            ? "8px 0 20px rgba(0,0,0,0.16)"
            : "none",

          overflow: "hidden",

          boxSizing: "border-box",
        }}
      >

        {/* =================================================
            CLOSE BUTTON
        ================================================= */}

        <IconButton
          onClick={handleCloseSidebar}
          aria-label="Close menu"
          sx={{
            position: "absolute",

            top: 8,

            right: 6,

            zIndex: 10,

            width: 38,

            height: 38,

            color: "#FFFFFF",

            bgcolor:
              "rgba(255,255,255,0.08)",

            "&:hover": {
              bgcolor:
                "rgba(255,255,255,0.16)",
            },
          }}
        >
          <CloseIcon
            fontSize="small"
          />
        </IconButton>


        {/* =================================================
            SIDEBAR
        ================================================= */}

        <Box
          sx={{
            width: "100%",

            height: "100%",

            overflow: "hidden",
          }}
        >
          <ManagerSidebar />
        </Box>

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

            boxSizing: "border-box",

            p: {
              xs: 0,
              sm: 1,
              md: 2,
            },

            pb: {
              xs: 0,
              sm: 1,
              md: 2,
            },

            m: 0,
          }}
        >

          <Box
            sx={{
              width: "100%",

              maxWidth: "100%",

              minWidth: 0,

              margin: 0,

              padding: 0,
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