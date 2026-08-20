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
        minHeight: {
          xs: 156,
          sm: 160,
        },

        borderRadius: 4,

        backgroundColor: "#FFFFFF",

        border: "1px solid #E2E8F0",

        boxShadow:
          "0 8px 24px rgba(15,23,42,0.06)",

        display: "flex",

        alignItems: "center",

        px: {
          xs: 3,
          sm: 3.5,
        },

        py: 3,

        boxSizing: "border-box",

        overflow: "hidden",
      }}
    >

      {/* ICON */}

      <Box
        sx={{
          width: {
            xs: 58,
            sm: 62,
          },

          height: {
            xs: 58,
            sm: 62,
          },

          minWidth: {
            xs: 58,
            sm: 62,
          },

          borderRadius: "50%",

          backgroundColor:
            warning
              ? "#FFF7E8"
              : "#EDF7EF",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          mr: 2.5,

          color:
            warning
              ? "#FF9800"
              : "#2E7D32",

          "& svg": {
            fontSize: {
              xs: 30,
              sm: 32,
            },
          },
        }}
      >

        {icon}

      </Box>


      {/* CONTENT */}

      <Box
        sx={{
          minWidth: 0,
          flex: 1,
        }}
      >

        <Typography
          sx={{
            fontSize: {
              xs: 15,
              sm: 16,
            },

            color: "#555",

            lineHeight: 1.3,

            mb: 0.7,
          }}
        >
          {title}
        </Typography>


        <Typography
          sx={{
            fontSize: {
              xs: 30,
              sm: 34,
            },

            fontWeight: 800,

            lineHeight: 1.1,

            color: "#222",

            mb: 0.8,

            whiteSpace: "nowrap",
          }}
        >
          {value}
        </Typography>


        <Typography
          sx={{
            fontSize: {
              xs: 13,
              sm: 14,
            },

            color: "#666",

            lineHeight: 1.4,
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
        -------------------------------------------------------
        IMPORTANT

        Only ONE API call.

        DO NOT call:

        /manager/commissions
        /manager/my-commissions
        /manager/network-commissions

        from this page.

        The dashboard endpoint already returns
        totalCommission.
        -------------------------------------------------------
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
        -------------------------------------------------------
        Axios response:

        response.data = {
          success: true,
          statusCode: 200,
          message: "...",
          data: {
            summary: {...}
          }
        }

        -------------------------------------------------------
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
        -------------------------------------------------------
        SUPPORT BOTH:

        response.data.data.summary

        AND

        response.data.summary

        This prevents the frontend from breaking if the
        API wrapper changes slightly.
        -------------------------------------------------------
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
        -------------------------------------------------------
        NORMALIZE DATA

        Do NOT calculate commission from wallet.

        Do NOT calculate commission from member count.

        Use the backend's totalCommission directly.
        -------------------------------------------------------
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

      }

      catch (err) {

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

      }

      finally {

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
          minHeight: "60vh",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",
        }}
      >

        <CircularProgress />

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

        minHeight: "100vh",

        backgroundColor: "#F5F7FA",

        boxSizing: "border-box",

        px: {
          xs: 1,
          sm: 2,
          md: 2.5,
        },

        py: {
          xs: 2,
          sm: 3,
        },
      }}
    >

      {/* ===================================================
          HEADER
      =================================================== */}

      <Box
        sx={{
          mb: 3,
        }}
      >

        <Typography
          sx={{
            fontSize: {
              xs: 30,
              sm: 36,
            },

            fontWeight: 800,

            lineHeight: 1.15,

            color: "#202124",

            mb: 1,
          }}
        >
          Manager Dashboard
        </Typography>


        <Typography
          sx={{
            fontSize: {
              xs: 15,
              sm: 17,
            },

            color: "#555",

            lineHeight: 1.55,

            maxWidth: 800,
          }}
        >
          Complete read-only overview of your
          managed members, commissions, orders,
          sales and products.
        </Typography>

      </Box>


      {/* ===================================================
          ERROR
      =================================================== */}

      {error && (

        <Alert
          severity="error"
          sx={{
            mb: 3,

            borderRadius: 3,
          }}
        >
          {error}
        </Alert>

      )}


      {/* ===================================================
          DASHBOARD CARDS

          CSS GRID instead of MUI Grid.

          This avoids the MUI Grid v2 warnings:
          xs prop removed
          sm prop removed
          md prop removed
          lg prop removed
          item prop removed
      =================================================== */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",

            sm: "repeat(2, minmax(0, 1fr))",

            md: "repeat(2, minmax(0, 1fr))",
          },

          gap: {
            xs: 2,

            sm: 2.5,
          },

          width: "100%",

          alignItems: "stretch",
        }}
      >

        {/* =================================================
            TOTAL MEMBERS
        ================================================= */}

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


        {/* =================================================
            TOTAL COMMISSION
        ================================================= */}

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


        {/* =================================================
            TOTAL ORDERS
        ================================================= */}

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


        {/* =================================================
            TOTAL SALES
        ================================================= */}

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


        {/* =================================================
            PRODUCTS
        ================================================= */}

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


        {/* =================================================
            PENDING KYC
        ================================================= */}

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


      {/* ===================================================
          READ ONLY INFORMATION
      =================================================== */}

      <Box
        sx={{
          mt: 3,

          borderRadius: 3,

          border:
            "1px solid #BFDBFE",

          backgroundColor: "#EFF6FF",

          px: {
            xs: 2,
            sm: 3,
          },

          py: 2,

          color: "#1E3A5F",
        }}
      >

        <Typography
          sx={{
            fontSize: {
              xs: 13,
              sm: 14,
            },

            lineHeight: 1.6,
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