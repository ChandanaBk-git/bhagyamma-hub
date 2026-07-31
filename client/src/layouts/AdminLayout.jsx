import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/sidebar/Sidebar";
import TopNavbar from "../components/navbar/TopNavbar";

const drawerWidth = 260;

const AdminLayout = () => {
  return (
    <Box sx={{ display: "flex", bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar drawerWidth={drawerWidth} />

      {/* Main Section */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${drawerWidth}px`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top Navbar */}
        <TopNavbar drawerWidth={drawerWidth} />

        {/* Space below AppBar */}
        <Toolbar />

        {/* Page Content */}
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            bgcolor: "background.default",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;