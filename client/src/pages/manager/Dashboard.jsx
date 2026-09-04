import React, {
  useEffect,
  useState,
} from "react";

import {
  Box,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

import api from "../../api";


/* =========================================================
   FORMAT CURRENCY
========================================================= */

const formatCurrency = (value) => {
  const amount = Number(value || 0);

  return `₹${amount.toLocaleString("en-IN")}`;
};


/* =========================================================
   FORMAT NUMBER
========================================================= */

const formatNumber = (value) => {
  return Number(value || 0).toLocaleString("en-IN");
};


/* =========================================================
   DASHBOARD CARD
========================================================= */

const DashboardCard = ({
  icon,
  title,
  value,
  subtitle,
  warning = false,
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,

        /*
         * COMPACT HEIGHT
         */
        minHeight: {
          xs: 105,
          sm: 125,
          md: 135,
        },

        height: "100%",

        /*
         * NO RADIUS
         */
        borderRadius: "0 !important",

        backgroundColor: "#FFFFFF",

        border: "1px solid #E1E5E8",

        boxShadow:
          "0 3px 10px rgba(15,23,42,0.05)",

        display: "flex",

        alignItems: "center",

        px: {
          xs: 1.5,
          sm: 2,
          md: 2.5,
        },

        py: {
          xs: 1.25,
          sm: 1.75,
          md: 2,
        },

        boxSizing: "border-box",

        overflow: "hidden",
      }}
    >
      {/* =================================================
          ICON
      ================================================= */}

      <Box
        sx={{
          width: {
            xs: 44,
            sm: 52,
            md: 58,
          },

          height: {
            xs: 44,
            sm: 52,
            md: 58,
          },

          minWidth: {
            xs: 44,
            sm: 52,
            md: 58,
          },

          borderRadius: "50%",

          backgroundColor: warning
            ? "#FFF3E0"
            : "#E8F5E9",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          mr: {
            xs: 1.25,
            sm: 1.75,
            md: 2,
          },

          color: warning
            ? "#F57C00"
            : "#2E7D32",

          flexShrink: 0,

          "& svg": {
            fontSize: {
              xs: 23,
              sm: 28,
              md: 31,
            },
          },
        }}
      >
        {icon}
      </Box>


      {/* =================================================
          CONTENT
      ================================================= */}

      <Box
        sx={{
          minWidth: 0,
          flex: 1,
          overflow: "hidden",
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: "0.78rem",
              sm: "0.88rem",
              md: "0.95rem",
            },

            color: "#616161",

            lineHeight: 1.25,

            mb: {
              xs: 0.35,
              sm: 0.5,
            },

            whiteSpace: "normal",

            overflowWrap: "break-word",
          }}
        >
          {title}
        </Typography>


        <Typography
          sx={{
            fontSize: {
              xs: "1.2rem",
              sm: "1.4rem",
              md: "1.6rem",
            },

            fontWeight: 700,

            lineHeight: 1.15,

            color: "#292929",

            mb: {
              xs: 0.3,
              sm: 0.5,
            },

            whiteSpace: "nowrap",

            overflow: "hidden",

            textOverflow: "ellipsis",
          }}
        >
          {value}
        </Typography>


        <Typography
          sx={{
            fontSize: {
              xs: "0.67rem",
              sm: "0.75rem",
              md: "0.82rem",
            },

            color: "#757575",

            lineHeight: 1.3,

            whiteSpace: "normal",

            overflowWrap: "break-word",
          }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
};


/* =========================================================
   DASHBOARD
========================================================= */

const Dashboard = () => {
  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [summary, setSummary] =
    useState({
      totalMembers: 0,
      activeMembers: 0,
      totalCommission: 0,
      totalOrders: 0,
      totalSales: 0,
      totalProducts: 0,
      activeProducts: 0,
      pendingKyc: 0,
    });


  /* =======================================================
     FETCH MANAGER DASHBOARD
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        console.log(
          "========================"
        );

        console.log(
          "MANAGER DASHBOARD REQUEST"
        );

        console.log(
          "========================"
        );


        /*
         * ONLY ONE API CALL
         */

        const response =
          await api.get(
            "/manager/dashboard"
          );


        console.log(
          "========================"
        );

        console.log(
          "MANAGER DASHBOARD API RESPONSE"
        );

        console.log(
          response
        );

        console.log(
          "========================"
        );


        if (
          !response ||
          !response.data
        ) {
          throw new Error(
            "Empty dashboard response."
          );
        }


        /*
         * AXIOS RESPONSE
         */

        const apiBody =
          response.data;


        if (
          apiBody.success === false
        ) {
          throw new Error(
            apiBody.message ||
            "Failed to load manager dashboard."
          );
        }


        /*
         * SUPPORT BOTH RESPONSE STRUCTURES
         */

        const dashboardData =
          apiBody.data ||
          apiBody;


        const dashboardSummary =
          dashboardData.summary;


        console.log(
          "========================"
        );

        console.log(
          "MANAGER DASHBOARD SUMMARY"
        );

        console.log(
          dashboardSummary
        );

        console.log(
          "========================"
        );


        if (
          !dashboardSummary
        ) {
          throw new Error(
            "Manager dashboard summary is missing."
          );
        }


        if (!mounted) {
          return;
        }


        /*
         * NORMALIZE DATA
         */

        setSummary({
          totalMembers:
            Number(
              dashboardSummary.totalMembers || 0
            ),

          activeMembers:
            Number(
              dashboardSummary.activeMembers || 0
            ),

          totalCommission:
            Number(
              dashboardSummary.totalCommission || 0
            ),

          totalOrders:
            Number(
              dashboardSummary.totalOrders || 0
            ),

          totalSales:
            Number(
              dashboardSummary.totalSales || 0
            ),

          totalProducts:
            Number(
              dashboardSummary.totalProducts || 0
            ),

          activeProducts:
            Number(
              dashboardSummary.activeProducts ||
              dashboardSummary.totalProducts ||
              0
            ),

          pendingKyc:
            Number(
              dashboardSummary.pendingKyc || 0
            ),
        });

      } catch (err) {
        console.error(
          "MANAGER DASHBOARD ERROR:",
          err
        );

        if (!mounted) {
          return;
        }

        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load manager dashboard."
        );

      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };


    fetchDashboard();


    return () => {
      mounted = false;
    };
  }, []);


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,

          minHeight: "60vh",

          margin: 0,
          padding: 0,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          boxSizing: "border-box",

          bgcolor: "#F5F7FA",

          overflowX: "hidden",

          borderRadius:
            "0 !important",
        }}
      >
        <CircularProgress
          color="success"
          size={28}
        />
      </Box>
    );
  }


  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,

        minHeight: "100vh",

        margin: 0,

        /*
         * NO EXTRA OUTER SPACE
         */
        padding: {
          xs: "8px 8px 20px",
          sm: "14px 14px 24px",
          md: "20px 8px 30px",
        },

        backgroundColor: "#F5F7FA",

        boxSizing: "border-box",

        overflowX: "hidden",

        /*
         * REMOVE ALL CONTAINER CURVES
         */
        borderRadius:
          "0 !important",

        "& .MuiPaper-root": {
          borderRadius:
            "0 !important",
        },

        "& .MuiCard-root": {
          borderRadius:
            "0 !important",
        },

        "& .MuiAlert-root": {
          borderRadius:
            "0 !important",
        },
      }}
    >


      {/* =================================================
          HEADER
      ================================================= */}

      <Box
        sx={{
          width: "100%",

          margin: 0,

          padding: 0,

          mb: {
            xs: 1.5,
            sm: 2,
            md: 2.5,
          },

          boxSizing: "border-box",
        }}
      >
        <Typography
          component="h1"
          sx={{
            margin: 0,

            padding: 0,

            fontSize: {
              xs: "21px",
              sm: "26px",
              md: "30px",
            },

            lineHeight: {
              xs: "26px",
              sm: "31px",
              md: "36px",
            },

            fontWeight: 700,

            color: "#202124",
          }}
        >
          Manager Dashboard
        </Typography>


        <Typography
          sx={{
            marginTop: {
              xs: "4px",
              sm: "6px",
            },

            fontSize: {
              xs: "12px",
              sm: "14px",
              md: "15px",
            },

            color: "#666",

            lineHeight: 1.45,

            maxWidth: 800,
          }}
        >
          Complete read-only overview of your
          managed members, commissions, orders,
          sales and products.
        </Typography>
      </Box>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <Alert
          severity="error"
          sx={{
            width: "100%",

            marginBottom: {
              xs: 1.5,
              sm: 2,
            },

            boxSizing: "border-box",

            borderRadius:
              "0 !important",

            fontSize: {
              xs: "12px",
              sm: "13px",
            },
          }}
        >
          {error}
        </Alert>
      )}


      {/* =================================================
          DASHBOARD CARDS
      ================================================= */}

      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,

          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(2, minmax(0, 1fr))",
          },

          gap: {
            xs: 1,
            sm: 1.5,
            md: 2,
          },

          boxSizing: "border-box",

          overflow: "hidden",
        }}
      >


        {/* TOTAL MEMBERS */}

        <DashboardCard
          icon={
            <PeopleIcon />
          }
          title="Total Members"
          value={
            formatNumber(
              summary.totalMembers
            )
          }
          subtitle={
            `${formatNumber(
              summary.activeMembers
            )} active`
          }
        />


        {/* TOTAL COMMISSION */}

        <DashboardCard
          icon={
            <AccountBalanceWalletIcon />
          }
          title="Total Commission"
          value={
            formatCurrency(
              summary.totalCommission
            )
          }
          subtitle="Commission earned by manager"
        />


        {/* TOTAL ORDERS */}

        <DashboardCard
          icon={
            <ShoppingBagIcon />
          }
          title="Total Orders"
          value={
            formatNumber(
              summary.totalOrders
            )
          }
          subtitle="Orders from managed members"
        />


        {/* TOTAL SALES */}

        <DashboardCard
          icon={
            <TrendingUpIcon />
          }
          title="Total Sales"
          value={
            formatCurrency(
              summary.totalSales
            )
          }
          subtitle="Total sales by managed members"
        />


        {/* PRODUCTS */}

        <DashboardCard
          icon={
            <Inventory2Icon />
          }
          title="Products"
          value={
            formatNumber(
              summary.totalProducts
            )
          }
          subtitle={
            `${formatNumber(
              summary.activeProducts
            )} active`
          }
        />


        {/* PENDING KYC */}

        <DashboardCard
          icon={
            <PendingActionsIcon />
          }
          title="Pending KYC"
          value={
            formatNumber(
              summary.pendingKyc
            )
          }
          subtitle="Members requiring verification"
          warning
        />

      </Box>


      {/* =================================================
          READ ONLY INFORMATION
      ================================================= */}

      <Box
        sx={{
          width: "100%",

          marginTop: {
            xs: 1.5,
            sm: 2,
            md: 2.5,
          },

          padding: {
            xs: "10px 12px",
            sm: "12px 16px",
          },

          boxSizing: "border-box",

          borderRadius:
            "0 !important",

          border:
            "1px solid #BFDBFE",

          backgroundColor: "#EFF6FF",

          color: "#1E3A5F",

          overflow: "hidden",
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: "11px",
              sm: "13px",
              md: "14px",
            },

            lineHeight: 1.5,

            margin: 0,
          }}
        >
          Manager access is read-only. Member,
          commission, order, referral and product
          details are available from their respective
          sidebar pages.
        </Typography>
      </Box>


    </Box>
  );
};


export default Dashboard;