import { useNavigate, NavLink } from "react-router-dom";

import {
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
  Avatar,
} from "@mui/material";

import {
  DashboardRounded,
  Inventory2Rounded,
  GroupRounded,
  AccountTreeRounded,
  LogoutRounded,
  AdminPanelSettingsRounded,
} from "@mui/icons-material";

const Sidebar = ({
  drawerWidth,
  mobileOpen,
  handleDrawerToggle,
  collapsed,
}) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardRounded />,
      path: "/admin/dashboard",
    },
    {
      text: "Products",
      icon: <Inventory2Rounded />,
      path: "/admin/products",
    },
    {
      text: "Members",
      icon: <GroupRounded />,
      path: "/admin/members",
    },
    {
      text: "Referral Tree",
      icon: <AccountTreeRounded />,
      path: "/admin/referral-tree",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const drawerContent = (
    <>
      <Toolbar
        sx={{
          height: 110,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <Avatar
          sx={{
            bgcolor: "#fff",
            color: "#2E7D32",
            width: collapsed ? 45 : 60,
            height: collapsed ? 45 : 60,
            transition: ".3s",
          }}
        >
          <AdminPanelSettingsRounded fontSize="large" />
        </Avatar>

        {!collapsed && (
          <>
            <Typography
              fontWeight="bold"
              fontSize={20}
            >
              Bhagyamma Hub
            </Typography>

            <Typography
              variant="caption"
              sx={{ opacity: .8 }}
            >
              Admin Panel
            </Typography>
          </>
        )}
      </Toolbar>

      <Divider sx={{ bgcolor: "rgba(255,255,255,.15)" }} />

      <List sx={{ mt: 2 }}>

              {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={NavLink}
            to={item.path}
            onClick={() => {
              if (mobileOpen) {
                handleDrawerToggle();
              }
            }}
            sx={{
              mx: 2,
              mb: 1,
              py: 1.3,
              borderRadius: 3,
              transition: "all .3s ease",

              justifyContent: collapsed ? "center" : "flex-start",

              "& .MuiListItemIcon-root": {
                color: "#fff",
                minWidth: collapsed ? 0 : 40,
                mr: collapsed ? 0 : 1,
                justifyContent: "center",
                transition: ".3s",
              },

              "&.active": {
                bgcolor: "#fff",
                color: "#2E7D32",
                boxShadow: "0 6px 20px rgba(0,0,0,.18)",

                "& .MuiListItemIcon-root": {
                  color: "#2E7D32",
                },
              },

              "&:hover": {
                bgcolor: "rgba(255,255,255,.15)",
                transform: "translateX(5px)",
              },
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>

            {!collapsed && (
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: 15,
                }}
              />
            )}
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

            <Box
        sx={{
          p: 2,
        }}
      >
        <Divider
          sx={{
            bgcolor: "rgba(255,255,255,.15)",
            mb: 2,
          }}
        />

        {!collapsed && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "#fff",
                color: "#2E7D32",
                width: 42,
                height: 42,
                mr: 1.5,
              }}
            >
              A
            </Avatar>

            <Box>
              <Typography
                fontWeight="bold"
                fontSize={15}
              >
                Super Admin
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255,255,255,.7)",
                }}
              >
                Bhagyamma Hub
              </Typography>
            </Box>
          </Box>
        )}

        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 3,
            py: 1.3,
            justifyContent: collapsed ? "center" : "flex-start",
            bgcolor: "#d32f2f",
            transition: ".3s",

            "&:hover": {
              bgcolor: "#b71c1c",
              transform: "scale(1.02)",
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: "#fff",
              minWidth: collapsed ? 0 : 40,
              mr: collapsed ? 0 : 1,
            }}
          >
            <LogoutRounded />
          </ListItemIcon>

          {!collapsed && (
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontWeight: 600,
              }}
            />
          )}
        </ListItemButton>
      </Box>
    </>
  );

    return (
    <>
      {/* Mobile Drawer */}

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: {
            xs: "block",
            md: "none",
          },

          "& .MuiDrawer-paper": {
            width: drawerWidth,

            background:
              "linear-gradient(180deg,#2E7D32 0%,#1B5E20 100%)",

            color: "#fff",

            border: "none",

            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}

      <Drawer
        variant="permanent"
        open
        sx={{
          display: {
            xs: "none",
            md: "block",
          },

          width: drawerWidth,

          flexShrink: 0,

          "& .MuiDrawer-paper": {
            width: drawerWidth,

            transition: ".3s",

            overflowX: "hidden",

            background:
              "linear-gradient(180deg,#2E7D32 0%,#1B5E20 100%)",

            color: "#fff",

            border: "none",

            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;