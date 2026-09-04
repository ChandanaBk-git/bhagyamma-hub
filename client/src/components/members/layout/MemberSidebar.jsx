import {
  Box,
  Drawer,
  Typography,
  Avatar,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";

import {
  HomeRounded,
  DashboardRounded,
  PersonRounded,
  StorefrontRounded,
  ReceiptLongRounded,
  HubRounded,
  StarsRounded,
  PaidRounded,
  AccountBalanceWalletRounded,
  PaymentsRounded,
  CardGiftcardRounded,
  LogoutRounded,
} from "@mui/icons-material";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";


const DRAWER_WIDTH = 280;


/* =====================================================
   MAIN MENU
===================================================== */

const mainMenu = [
  {
    title: "Home",
    icon: <HomeRounded />,
    path: "/",
  },

  {
    title: "Dashboard",
    icon: <DashboardRounded />,
    path: "/member/dashboard",
  },

  {
    title: "My Profile",
    icon: <PersonRounded />,
    path: "/member/profile",
  },

  {
    title: "Products",
    icon: <StorefrontRounded />,
    path: "/member/products",
  },

  {
    title: "My Orders",
    icon: <ReceiptLongRounded />,
    path: "/member/orders",
  },
];


/* =====================================================
   MLM MENU
===================================================== */

const mlmMenu = [
  {
    title: "My Network",
    icon: <HubRounded />,
    path: "/member/network",
  },

  {
    title: "Selling Points",
    icon: <StarsRounded />,
    path: "/member/selling-points",
  },

  {
    title: "Commission",
    icon: <PaidRounded />,
    path: "/member/commission",
  },

  {
    title: "Wallet",
    icon: <AccountBalanceWalletRounded />,
    path: "/member/wallet",
  },

  {
    title: "Withdraw",
    icon: <PaymentsRounded />,
    path: "/member/withdraw",
  },
];


/* =====================================================
   OTHER MENU
===================================================== */

const otherMenu = [
  {
    title: "Welcome Kit",
    icon: <CardGiftcardRounded />,
    path: "/member/welcome-kit",
  },
];


/* =====================================================
   MEMBER SIDEBAR
===================================================== */

const MemberSidebar = ({
  mobileOpen = false,
  onClose = () => {},
}) => {

  const location = useLocation();

  const navigate = useNavigate();


  /* ===================================================
     USER
  =================================================== */

  let user = {};

  try {

    user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

  } catch {

    user = {};

  }


  const memberName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    "Member";


  const memberId =
    user?.userId ||
    user?.memberId ||
    user?.id ||
    "-";


  const firstLetter =
    memberName
      ?.charAt(0)
      ?.toUpperCase() || "M";


  /* ===================================================
     ACTIVE MENU
     
     IMPORTANT:
     
     "/" must ONLY be active when the user is
     actually on the public homepage.

     Otherwise every member page would have Home
     highlighted because all paths technically begin
     with "/".
  =================================================== */

  const isActive = (path) => {

    if (path === "/") {

      return location.pathname === "/";

    }


    if (path === "/member") {

      return (
        location.pathname === "/member"
      );

    }


    return (
      location.pathname === path ||
      location.pathname.startsWith(
        `${path}/`
      )
    );

  };


  /* ===================================================
     NAVIGATION
  =================================================== */

  const handleNavigation = () => {

    onClose();

  };


  /* ===================================================
     LOGOUT
  =================================================== */

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    onClose();

    navigate("/login", {
      replace: true,
    });

  };


  /* ===================================================
     MENU RENDER
  =================================================== */

  const renderMenu = (items) =>

    items.map((item) => {

      const active =
        isActive(item.path);


      return (

        <ListItemButton
          key={item.path}

          component={Link}

          to={item.path}

          onClick={
            handleNavigation
          }

          selected={active}

          sx={{

            minHeight: 36,

            mx: 0.15,

            mb: 0.1,

            px: 0.35,

            borderRadius: 0,

            color: "#fff",

            transition:
              "all 0.2s ease",


            "&:hover": {

              bgcolor:
                "rgba(255,255,255,0.12)",

            },


            "&.Mui-selected": {

              bgcolor: "#4CAF50",

              color: "#fff",

            },


            "&.Mui-selected:hover": {

              bgcolor: "#43A047",

            },

          }}
        >

<ListItemIcon
  sx={{
    minWidth: 30,
    color: "inherit",
    "& svg": {
      fontSize: 18,
    },
  }}
>
  {item.icon}
</ListItemIcon>


          <ListItemText
            primary={item.title}

            primaryTypographyProps={{
              fontSize: {
                xs: "0.55rem",
                md: "0.82rem",
              },

              fontWeight:
                active
                  ? 600
                  : 400,

              whiteSpace:
                "nowrap",

              overflow: "hidden",

              textOverflow: "ellipsis",
            }}
          />

        </ListItemButton>

      );

    });


  /* ===================================================
     SIDEBAR CONTENT
  =================================================== */

  const sidebarContent = (

    <Box
      sx={{
        width: {
          xs: "100%",
          md: DRAWER_WIDTH,
        },

        maxWidth: "100%",

        minWidth: 0,

        height: "100%",

        display: "flex",

        flexDirection: "column",

        bgcolor: "#176B2A",

        color: "#fff",

        overflow: "hidden",
      }}
    >

      <Divider
        sx={{
          borderColor:
            "rgba(255,255,255,0.12)",
        }}
      />


      {/* =================================================
          MEMBER PROFILE
      ================================================= */}

      <Box
        sx={{
          px: 0.25,

          py: 1,

          textAlign: "center",
        }}
      >

        <Avatar
          sx={{
            width: 38,

            height: 38,

            mx: "auto",

            mb: 1.5,

            bgcolor: "#4CAF50",

            color: "#fff",

            fontSize: "1.15rem",

            fontWeight: 700,
          }}
        >
          {firstLetter}
        </Avatar>


        <Typography
          fontWeight={700}
          sx={{
            fontSize: "0.68rem",

            whiteSpace:
              "nowrap",

            overflow:
              "hidden",

            textOverflow:
              "ellipsis",
          }}
        >
          {memberName}
        </Typography>


        <Typography
          sx={{
            mt: 0.4,

            fontSize: "0.55rem",

            opacity: 0.8,

            letterSpacing: 0.5,
          }}
        >
          MEMBER
        </Typography>


        <Typography
          sx={{
            mt: 0.5,

            fontSize: "0.52rem",

            opacity: 0.65,

            wordBreak:
              "break-word",
          }}
        >
          ID: {memberId}
        </Typography>

      </Box>


      <Divider
        sx={{
          borderColor:
            "rgba(255,255,255,0.12)",
        }}
      />


      {/* =================================================
          SCROLLABLE MENU
      ================================================= */}

      <Box
        sx={{
          flex: 1,

          overflowY: "auto",

          overflowX: "hidden",

          py: 2,


          "&::-webkit-scrollbar": {

            width: 5,

          },


          "&::-webkit-scrollbar-thumb": {

            backgroundColor:
              "rgba(255,255,255,0.25)",

            borderRadius: 0,

          },

        }}
      >

        {/* =================================================
            MAIN
        ================================================= */}

        <Typography
          sx={{
            px: 0.6,

            mb: 0.4,

            fontSize: "0.5rem",

            fontWeight: 700,

            opacity: 0.55,

            letterSpacing: 1,
          }}
        >
          MAIN
        </Typography>


        <List
          disablePadding
        >
          {renderMenu(
            mainMenu
          )}
        </List>


        {/* =================================================
            MLM
        ================================================= */}

        <Typography
          sx={{
            px: 0.6,

            mt: 1.2,

            mb: 0.4,

            fontSize: "0.5rem",

            fontWeight: 700,

            opacity: 0.55,

            letterSpacing: 1,
          }}
        >
          MLM
        </Typography>


        <List
          disablePadding
        >
          {renderMenu(
            mlmMenu
          )}
        </List>


        {/* =================================================
            OTHER
        ================================================= */}

        <Typography
          sx={{
            px: 1,

            mt: 1.5,

            mb: 0.6,

            fontSize: "0.55rem",

            fontWeight: 700,

            opacity: 0.55,

            letterSpacing: 1,
          }}
        >
          OTHER
        </Typography>


        <List
          disablePadding
        >
          {renderMenu(
            otherMenu
          )}
        </List>

      </Box>


      {/* =================================================
          LOGOUT
      ================================================= */}

      <Box
        sx={{
          borderTop:
            "1px solid rgba(255,255,255,0.12)",

          p: 1.5,
        }}
      >

        <Tooltip
          title="Logout"
          placement="right"
        >

          <ListItemButton
            onClick={
              handleLogout
            }

            sx={{
              minHeight: 40,

              borderRadius: 0,

              color: "#fff",


              "&:hover": {

                bgcolor:
                  "rgba(255,255,255,0.12)",

              },

            }}
          >

            <ListItemIcon
              sx={{
                minWidth: 25,

                color: "#fff",
              }}
            >

              <LogoutRounded />

            </ListItemIcon>


            <ListItemText
              primary="Logout"

              primaryTypographyProps={{
                fontSize:
                  "0.75rem",
              }}
            />

          </ListItemButton>

        </Tooltip>

      </Box>

    </Box>
  );


  /* ===================================================
     RETURN
  =================================================== */

  return (

    <>

      {/* =================================================
          MOBILE DRAWER
      ================================================= */}

      <Drawer
        variant="temporary"

        open={mobileOpen}

        onClose={onClose}

        ModalProps={{
          keepMounted: true,
        }}

        sx={{
          display: {
            xs: "block",

            md: "none",
          },


          "& .MuiDrawer-paper": {

            width: {
              xs: "30vw",
              md: DRAWER_WIDTH,
            },

            minWidth: {
              xs: "30vw",
              md: DRAWER_WIDTH,
            },

            maxWidth: {
              xs: "30vw",
              md: DRAWER_WIDTH,
            },

            boxSizing:
              "border-box",

            border: 0,

          },

        }}
      >

        {sidebarContent}

      </Drawer>


      {/* =================================================
          DESKTOP DRAWER
      ================================================= */}

      <Drawer
        variant="permanent"

        open

        sx={{
          display: {
            xs: "none",

            md: "block",
          },

          width:
            DRAWER_WIDTH,

          flexShrink: 0,


          "& .MuiDrawer-paper": {

            width:
              DRAWER_WIDTH,

            boxSizing:
              "border-box",

            border: 0,

            bgcolor:
              "#176B2A",

          },

        }}
      >

        {sidebarContent}

      </Drawer>

    </>

  );

};


export default MemberSidebar;