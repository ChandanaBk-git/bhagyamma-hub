import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

import ManagerSidebar from "../components/manager/Sidebar";
import ManagerNavbar from "../components/manager/Navbar";

const ManagerLayout = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <ManagerSidebar />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          bgcolor: "#f5f7fb",
        }}
      >
        {/* Top Navbar */}
        <ManagerNavbar />

        {/* Page Content */}
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            overflow: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default ManagerLayout;